const ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Extract a YouTube video id from watch, shorts, embed or youtu.be links.
 * Returns null for anything else, so only known-good ids reach an iframe src.
 */
export function getYouTubeId(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  let candidate: string | null = null;
  if (host === "youtu.be") {
    candidate = url.pathname.slice(1).split("/")[0] ?? null;
  } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      candidate = url.searchParams.get("v");
    } else {
      const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/);
      candidate = match?.[1] ?? null;
    }
  }
  return candidate && ID.test(candidate) ? candidate : null;
}
