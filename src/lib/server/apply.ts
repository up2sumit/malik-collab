import type { z } from "zod";
import { brandSchema, creatorSchema, type ApplyKind, type ApplyResponse } from "../schemas";
import {
  DeliveryError,
  NotConfiguredError,
  composeMessage,
  deliver,
} from "./delivery";
import { clientKey, hit } from "./rate-limit";

const MAX_BODY_BYTES = 20_000;
/** Humans cannot fill these forms in under this many milliseconds. */
const MIN_FILL_MS = 2500;

function respond(body: ApplyResponse, status: number, extra?: HeadersInit): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}

function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Browsers always send Origin on cross-origin and same-origin POSTs with fetch. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function handleApply(request: Request, kind: ApplyKind): Promise<Response> {
  if (!isSameOrigin(request)) {
    return respond({ ok: false, code: "forbidden", message: "This request was not allowed." }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return respond({ ok: false, code: "bad_request", message: "Unsupported content type." }, 415);
  }

  const limit = hit(`${kind}:${clientKey(request.headers)}`);
  if (!limit.allowed) {
    return respond(
      { ok: false, code: "rate_limited", message: "Too many submissions. Please try again in a few minutes." },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return respond({ ok: false, code: "bad_request", message: "That submission is too large." }, 413);
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return respond({ ok: false, code: "bad_request", message: "Invalid request." }, 400);
  }

  const schema = kind === "creator" ? creatorSchema : brandSchema;
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    // A filled honeypot fails validation (max length 0). Do not reveal that.
    const filledHoneypot =
      typeof json === "object" && json !== null && "website" in json && (json as { website?: unknown }).website;
    if (filledHoneypot) return respond({ ok: true }, 200);

    return respond(
      {
        ok: false,
        code: "validation",
        message: "Please check the highlighted fields.",
        fieldErrors: fieldErrors(parsed.error),
      },
      422,
    );
  }

  if (Date.now() - parsed.data.startedAt < MIN_FILL_MS) {
    return respond(
      { ok: false, code: "too_fast", message: "That was quick. Please review your answers and send again." },
      429,
    );
  }

  try {
    const message =
      kind === "creator"
        ? composeMessage("creator", parsed.data as z.output<typeof creatorSchema>)
        : composeMessage("brand", parsed.data as z.output<typeof brandSchema>);
    await deliver(kind, message);
    return respond({ ok: true }, 200);
  } catch (error) {
    if (error instanceof NotConfiguredError) {
      console.error("[apply] Delivery is not configured. Set RESEND_API_KEY, SUBMISSIONS_TO_EMAIL and SUBMISSIONS_FROM_EMAIL.");
      return respond(
        {
          ok: false,
          code: "not_configured",
          message: "We can't accept submissions right now. Please try again later.",
        },
        503,
      );
    }
    console.error("[apply] Delivery failed:", error instanceof DeliveryError ? error.message : error);
    return respond(
      { ok: false, code: "delivery_failed", message: "Something went wrong sending your submission. Please try again." },
      502,
    );
  }
}
