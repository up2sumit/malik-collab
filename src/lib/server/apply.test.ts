import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { handleApply } from "./apply";
import { composeMessage, sanitizeHeaderValue } from "./delivery";
import { resetRateLimit } from "./rate-limit";

const creatorBody = {
  name: "Alex Rivera",
  email: "alex@example.com",
  sport: "running",
  contentType: "vlog",
  instagram: "@alexruns",
  youtube: "",
  portfolio: "",
  intro: "I film long trail runs and write up what I learn about pacing and gear.",
  consent: true,
  website: "",
  startedAt: Date.now() - 60_000,
};

const brandBody = {
  contactName: "Sam Lee",
  workEmail: "sam@brand.example",
  company: "Trail Co",
  collabType: "campaign",
  description: "A spring campaign for a new trail shoe aimed at first-time trail runners.",
  budget: "unspecified",
  timeline: "flexible",
  consent: true,
  website: "",
  startedAt: Date.now() - 60_000,
};

function post(body: unknown, headers: Record<string, string> = {}, raw?: string): Request {
  return new Request("http://localhost:3000/api/apply/creator", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3000", host: "localhost:3000", "x-forwarded-for": "203.0.113.9", ...headers },
    body: raw ?? JSON.stringify(body),
  });
}

const json = async (response: Response) => (await response.json()) as Record<string, unknown>;

beforeEach(() => {
  resetRateLimit();
  vi.stubEnv("RESEND_API_KEY", "");
  vi.stubEnv("SUBMISSIONS_TO_EMAIL", "");
  vi.stubEnv("SUBMISSIONS_FROM_EMAIL", "");
  vi.stubEnv("ALLOW_LOCAL_SUBMISSION_SINK", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("request guards", () => {
  it("rejects requests with no Origin header", async () => {
    const request = new Request("http://localhost:3000/api/apply/creator", { method: "POST", headers: { "content-type": "application/json", host: "localhost:3000" }, body: "{}" });
    expect((await handleApply(request, "creator")).status).toBe(403);
  });

  it("rejects a cross-origin POST", async () => {
    const response = await handleApply(post(creatorBody, { origin: "https://evil.example" }), "creator");
    expect(response.status).toBe(403);
  });

  it("rejects non-JSON content types", async () => {
    expect((await handleApply(post(creatorBody, { "content-type": "text/plain" }), "creator")).status).toBe(415);
  });

  it("rejects oversized and malformed bodies", async () => {
    expect((await handleApply(post(null, {}, "x".repeat(25_000)), "creator")).status).toBe(413);
    expect((await handleApply(post(null, {}, "{not json"), "creator")).status).toBe(400);
  });

  it("rate limits after five requests from one client", async () => {
    for (let i = 0; i < 5; i++) await handleApply(post({}), "creator");
    const blocked = await handleApply(post({}), "creator");
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
    expect((await json(blocked)).code).toBe("rate_limited");
  });
});

describe("validation and spam controls", () => {
  it("returns per-field errors for invalid input", async () => {
    const response = await handleApply(post({ ...creatorBody, email: "nope", intro: "short" }), "creator");
    const body = await json(response);
    expect(response.status).toBe(422);
    expect(body.code).toBe("validation");
    expect(Object.keys(body.fieldErrors as object)).toEqual(expect.arrayContaining(["email", "intro"]));
  });

  it("silently drops honeypot hits without delivering", async () => {
    vi.stubEnv("ALLOW_LOCAL_SUBMISSION_SINK", "true");
    const cwd = vi.spyOn(process, "cwd").mockReturnValue("/nonexistent-should-never-be-written");
    const response = await handleApply(post({ ...creatorBody, website: "http://spam.example" }), "creator");
    expect(response.status).toBe(200);
    expect(cwd).not.toHaveBeenCalled();
  });

  it("rejects submissions made faster than a person can type", async () => {
    const response = await handleApply(post({ ...creatorBody, startedAt: Date.now() - 200 }), "creator");
    expect(response.status).toBe(429);
    expect((await json(response)).code).toBe("too_fast");
  });
});

describe("delivery", () => {
  it("never reports success when delivery is not configured", async () => {
    const response = await handleApply(post(creatorBody), "creator");
    expect(response.status).toBe(503);
    expect((await json(response)).code).toBe("not_configured");
  });

  describe("local development sink", () => {
    let dir: string;
    beforeEach(async () => {
      dir = await mkdtemp(path.join(os.tmpdir(), "apply-test-"));
      vi.spyOn(process, "cwd").mockReturnValue(dir);
      vi.stubEnv("ALLOW_LOCAL_SUBMISSION_SINK", "true");
    });
    afterEach(() => rm(dir, { recursive: true, force: true }));

    it("writes a creator application to the sink", async () => {
      const response = await handleApply(post(creatorBody), "creator");
      expect(response.status).toBe(200);
      const lines = (await readFile(path.join(dir, ".data", "submissions.jsonl"), "utf8")).trim().split("\n");
      const record = JSON.parse(lines[0]);
      expect(record.kind).toBe("creator");
      expect(record.replyTo).toBe("alex@example.com");
      expect(record.text).toContain("Main sport: Running");
    });
  });

  describe("email provider", () => {
    beforeEach(() => {
      vi.stubEnv("RESEND_API_KEY", "re_test_key");
      vi.stubEnv("SUBMISSIONS_TO_EMAIL", "inbox@site.example");
      vi.stubEnv("SUBMISSIONS_FROM_EMAIL", "forms@site.example");
    });

    it("sends the message with the right payload", async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);
      const response = await handleApply(post(brandBody), "brand");
      expect(response.status).toBe(200);
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe("https://api.resend.com/emails");
      expect((init.headers as Record<string, string>).Authorization).toBe("Bearer re_test_key");
      const payload = JSON.parse(init.body as string);
      expect(payload).toMatchObject({ to: ["inbox@site.example"], from: "forms@site.example", reply_to: "sam@brand.example", subject: "Brand enquiry: Trail Co" });
    });

    it("returns 502 when the provider rejects the message", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));
      const response = await handleApply(post(brandBody), "brand");
      expect(response.status).toBe(502);
      expect((await json(response)).code).toBe("delivery_failed");
    });

    it("returns 502 when the provider is unreachable", async () => {
      vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));
      expect((await handleApply(post(brandBody), "brand")).status).toBe(502);
    });
  });
});

describe("email composition", () => {
  it("strips header-injection characters from the subject", () => {
    expect(sanitizeHeaderValue("Alex\r\nBcc: victim@example.com")).toBe("Alex Bcc: victim@example.com");
    const message = composeMessage("creator", { ...creatorBody, name: "Alex\r\nBcc: victim@example.com" } as never);
    expect(message.subject).not.toMatch(/[\r\n]/);
  });
});
