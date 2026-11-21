import { beforeEach, describe, expect, it } from "vitest";
import { clientKey, hit, resetRateLimit } from "./rate-limit";

beforeEach(() => resetRateLimit());

describe("hit", () => {
  it("allows five requests then blocks the sixth", () => {
    const now = 1_000_000;
    for (let i = 0; i < 5; i++) expect(hit("ip", now + i).allowed).toBe(true);
    const sixth = hit("ip", now + 5);
    expect(sixth.allowed).toBe(false);
    expect(sixth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("tracks keys independently", () => {
    for (let i = 0; i < 5; i++) hit("a", 1000 + i);
    expect(hit("a", 1100).allowed).toBe(false);
    expect(hit("b", 1100).allowed).toBe(true);
  });

  it("frees capacity after the window passes", () => {
    for (let i = 0; i < 5; i++) hit("ip", i);
    expect(hit("ip", 100).allowed).toBe(false);
    expect(hit("ip", 10 * 60 * 1000 + 10).allowed).toBe(true);
  });
});

describe("clientKey", () => {
  it("prefers the first x-forwarded-for entry", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
  });
  it("falls back to x-real-ip then unknown", () => {
    expect(clientKey(new Headers({ "x-real-ip": "9.9.9.9" }))).toBe("9.9.9.9");
    expect(clientKey(new Headers())).toBe("unknown");
  });
});
