/**
 * Minimal fixed-window rate limiter held in process memory.
 *
 * Limitation (deliberate, documented in the README): on serverless platforms
 * each instance has its own memory, so this only slows down casual abuse.
 * For real protection swap `hit` for a shared store (Upstash Redis, Vercel KV)
 * and keep the same signature.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const MAX_TRACKED_KEYS = 5000;

const hits = new Map<string, number[]>();

export function hit(key: string, now: number = Date.now()): { allowed: boolean; retryAfterSeconds: number } {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_HITS) {
    hits.set(key, recent);
    return { allowed: false, retryAfterSeconds: Math.ceil((recent[0] + WINDOW_MS - now) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Test helper. */
export function resetRateLimit(): void {
  hits.clear();
}

/**
 * Best-effort client identifier. On Vercel the platform sets x-forwarded-for,
 * so the first entry is the client. Behind other proxies, configure accordingly.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
