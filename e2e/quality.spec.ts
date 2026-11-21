import { expect, test } from "@playwright/test";
import { formatViolations, routes, runAxe, trackErrors, widths } from "./helpers";

test.describe("accessibility (axe, WCAG 2.2 AA)", () => {
  for (const [label, viewport] of [
    ["desktop", { width: 1440, height: 900 }],
    ["mobile", { width: 390, height: 844 }],
  ] as const) {
    test.describe(label, () => {
      test.use({ viewport, reducedMotion: "reduce" });
      for (const route of routes) {
        test(`${route} has no violations`, async ({ page }) => {
          await page.goto(route);
          await page.waitForLoadState("networkidle");
          const violations = await runAxe(page);
          expect(violations, formatViolations(violations)).toEqual([]);
        });
      }
    });
  }
});

test.describe("responsive layout", () => {
  test.use({ reducedMotion: "reduce" });
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${route} overflows by ${overflow}px at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe("health", () => {
  test("every route renders one h1, loads without console errors or failed requests", async ({ page }) => {
    const errors = trackErrors(page);
    for (const route of routes.filter((r) => r !== "/this-page-does-not-exist")) {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1"), route).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("out of bounds");
  });

  test("content stays visible when motion is reduced", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const hidden = await page.evaluate(() => Array.from(document.querySelectorAll(".reveal")).filter((el) => getComputedStyle(el).opacity === "0").length);
    expect(hidden).toBe(0);
    await context.close();
  });

  test("content stays visible with JavaScript disabled", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Where creativity/ })).toBeVisible();
    await context.close();
  });

  test("sitemap and robots are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBe(true);
    expect(await sitemap.text()).toContain("/sports/running");
    expect((await request.get("/robots.txt")).ok()).toBe(true);
  });

  test("pages declare a canonical URL and Open Graph tags", async ({ page }) => {
    await page.goto("/creators");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/creators$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  });
});
