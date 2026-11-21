import { describe, expect, it } from "vitest";
import { getYouTubeId } from "./youtube";

const ID = "dQw4w9WgXcQ";

describe("getYouTubeId", () => {
  it.each([
    [`https://www.youtube.com/watch?v=${ID}`],
    [`https://youtube.com/watch?v=${ID}&t=10s`],
    [`https://m.youtube.com/watch?v=${ID}`],
    [`https://youtu.be/${ID}`],
    [`https://youtu.be/${ID}?si=abc`],
    [`https://www.youtube.com/shorts/${ID}`],
    [`https://www.youtube.com/embed/${ID}`],
    [`https://www.youtube-nocookie.com/embed/${ID}`],
    [`https://www.youtube.com/live/${ID}?feature=share`],
  ])("extracts the id from %s", (url) => {
    expect(getYouTubeId(url)).toBe(ID);
  });

  it.each([
    ["not a url"],
    [""],
    ["https://example.com/watch?v=dQw4w9WgXcQ"],
    ["https://evil.com/?https://youtube.com/watch?v=dQw4w9WgXcQ"],
    ["https://www.youtube.com/watch?v=short"],
    ['https://www.youtube.com/watch?v="><script>alert(1)</script>'],
    ["https://www.youtube.com/watch"],
    ["javascript:alert(1)"],
    ["https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ"],
  ])("rejects %s", (url) => {
    expect(getYouTubeId(url)).toBeNull();
  });
});
