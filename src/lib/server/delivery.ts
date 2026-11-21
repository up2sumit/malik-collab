import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import {
  budgetRanges,
  collabTypes,
  contentTypes,
  labelFor,
  sportOptions,
  timelines,
  type ApplyKind,
  type BrandData,
  type CreatorData,
} from "../schemas";

export class NotConfiguredError extends Error {
  constructor() {
    super("Submission delivery is not configured.");
    this.name = "NotConfiguredError";
  }
}

export class DeliveryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DeliveryError";
  }
}

/** Strip control characters so user input can never inject email headers. */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
}

interface Message {
  subject: string;
  replyTo: string;
  text: string;
}

export function composeMessage(kind: "creator", data: CreatorData): Message;
export function composeMessage(kind: "brand", data: BrandData): Message;
export function composeMessage(kind: ApplyKind, data: CreatorData | BrandData): Message {
  if (kind === "creator") {
    const d = data as CreatorData;
    return {
      subject: `Creator application: ${sanitizeHeaderValue(d.name).slice(0, 80)}`,
      replyTo: d.email,
      text: [
        `Name: ${d.name}`,
        `Email: ${d.email}`,
        `Main sport: ${labelFor(sportOptions, d.sport)}`,
        `Content type: ${labelFor(contentTypes, d.contentType)}`,
        `Instagram: ${d.instagram || "-"}`,
        `YouTube: ${d.youtube || "-"}`,
        `Portfolio: ${d.portfolio || "-"}`,
        "",
        "Introduction:",
        d.intro,
      ].join("\n"),
    };
  }
  const d = data as BrandData;
  return {
    subject: `Brand enquiry: ${sanitizeHeaderValue(d.company).slice(0, 80)}`,
    replyTo: d.workEmail,
    text: [
      `Contact: ${d.contactName}`,
      `Work email: ${d.workEmail}`,
      `Company: ${d.company}`,
      `Collaboration type: ${labelFor(collabTypes, d.collabType)}`,
      `Budget: ${labelFor(budgetRanges, d.budget)}`,
      `Timeline: ${labelFor(timelines, d.timeline)}`,
      "",
      "Campaign description:",
      d.description,
    ].join("\n"),
  };
}

function resendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.SUBMISSIONS_TO_EMAIL;
  const from = process.env.SUBMISSIONS_FROM_EMAIL;
  return apiKey && to && from ? { apiKey, to, from } : null;
}

/**
 * Deliver a validated submission.
 *
 * - Production/preview with Resend configured: send an email.
 * - Development without configuration: append to `.data/submissions.jsonl`
 *   (git-ignored) so the flow can be exercised locally.
 * - Anything else: throw NotConfiguredError. We never report success for a
 *   submission that went nowhere.
 */
export async function deliver(kind: ApplyKind, message: Message): Promise<void> {
  const config = resendConfig();

  if (config) {
    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: config.from,
          to: [config.to],
          reply_to: message.replyTo,
          subject: message.subject,
          text: message.text,
        }),
        signal: AbortSignal.timeout(10_000),
      });
    } catch (cause) {
      throw new DeliveryError(`Email provider unreachable: ${(cause as Error).message}`);
    }
    if (!response.ok) {
      throw new DeliveryError(`Email provider responded ${response.status}.`);
    }
    return;
  }

  if (process.env.NODE_ENV === "development" || process.env.ALLOW_LOCAL_SUBMISSION_SINK === "true") {
    const dir = path.join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, "submissions.jsonl"),
      `${JSON.stringify({ kind, receivedAt: new Date().toISOString(), ...message })}\n`,
      "utf8",
    );
    return;
  }

  throw new NotConfiguredError();
}
