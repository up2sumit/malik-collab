import { expect, test } from "@playwright/test";
import { gotoReady } from "./helpers";

test.describe("desktop navigation", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("primary links reach their pages", async ({ page }) => {
    await gotoReady(page, "/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [name, url, heading] of [
      ["For Creators", /\/creators$/, /take their sport/],
      ["For Brands", /\/brands$/, /Partner with creators/],
      ["Collaborations", /\/collaborations$/, /Every sport/],
      ["Resources", /\/resources$/, /Practical tools/],
      ["About", /\/about$/, /Sport is better/],
    ] as const) {
      await nav.getByRole("link", { name }).click();
      await expect(page).toHaveURL(url);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(heading);
    }
  });

  test("header CTA and hero buttons go to the application forms", async ({ page }) => {
    await gotoReady(page, "/");
    await page.getByRole("banner").getByRole("link", { name: "Apply as a Creator" }).click();
    await expect(page).toHaveURL(/\/apply$/);
    await gotoReady(page, "/");
    await page.getByRole("link", { name: "Partner With Us" }).first().click();
    await expect(page).toHaveURL(/\/partner$/);
  });

  test("header gains a solid background on scroll", async ({ page }) => {
    await gotoReady(page, "/");
    const header = page.getByRole("banner");
    await expect(header).not.toHaveClass(/border-line/);
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(header).toHaveClass(/border-line/);
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await gotoReady(page, "/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("opens, traps focus, closes with Escape and restores focus", async ({ page }) => {
    await gotoReady(page, "/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeHidden();

    await toggle.click();
    await expect(dialog).toBeVisible();
    // Regression: a backdrop-filter on an ancestor once collapsed this to zero height.
    const box = await dialog.boundingBox();
    expect(box?.height).toBeGreaterThan(400);
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await expect(dialog.getByRole("link", { name: "For Creators" })).toBeFocused();

    // Tab order must stay inside the toggle + drawer
    const inside = dialog.locator("a");
    const count = await inside.count();
    for (let i = 0; i < count + 3; i++) {
      await page.keyboard.press("Tab");
      const owned = await page.evaluate(() => {
        const el = document.activeElement;
        return Boolean(el && (el.closest("#mobile-menu") || el.getAttribute("aria-controls") === "mobile-menu"));
      });
      expect(owned, `focus escaped the menu on Tab ${i + 1}`).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("locks page scroll while open and navigates then closes", async ({ page }) => {
    await gotoReady(page, "/");
    await page.getByRole("button", { name: "Open menu" }).click();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "For Brands" }).click();
    await expect(page).toHaveURL(/\/brands$/);
    await expect(page.getByRole("dialog", { name: "Menu" })).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  });

  test("tap targets in the header are at least 44px", async ({ page }) => {
    await gotoReady(page, "/");
    const box = await page.getByRole("button", { name: "Open menu" }).boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe("sport categories", () => {
  test("a category tile opens its page with relevant content", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoReady(page, "/");
    await page.getByRole("link", { name: "Cycling" }).first().click();
    await expect(page).toHaveURL(/\/sports\/cycling$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Cycling");
    await expect(page.getByRole("heading", { name: /gravel route breakdown/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /morning long-run vlog/ })).toHaveCount(0);
  });

  test("every sport page exists", async ({ page, request }) => {
    for (const slug of ["running", "cycling", "fitness", "basketball", "surfing", "outdoor", "cricket", "football"]) {
      const response = await request.get(`/sports/${slug}`);
      expect(response.status(), slug).toBe(200);
    }
    await gotoReady(page, "/sports/nope");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("out of bounds");
  });

  test("category row scrolls horizontally on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/");
    const scroller = page.locator("ul", { has: page.getByRole("link", { name: "View all sports" }) });
    const metrics = await scroller.evaluate((el) => ({ sw: el.scrollWidth, cw: el.clientWidth }));
    expect(metrics.sw).toBeGreaterThan(metrics.cw);
  });
});

test.describe("stories carousel", () => {
  test("buttons and keyboard move through the stories", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoReady(page, "/");
    const region = page.locator('[aria-roledescription="carousel"]');
    await region.scrollIntoViewIfNeeded();
    const counter = page.getByText(/^\s*01\s*\/\s*04\s*$/);
    await expect(counter).toBeVisible();

    const prev = page.getByRole("button", { name: "Previous story" });
    const next = page.getByRole("button", { name: "Next story" });
    await expect(prev).toBeDisabled();

    await next.click();
    await expect(page.getByText(/^\s*02\s*\/\s*04\s*$/)).toBeVisible();
    await expect(prev).toBeEnabled();

    const list = region.getByRole("group", { name: /^Slides/ });
    await list.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByText(/^\s*03\s*\/\s*04\s*$/)).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByText(/^\s*02\s*\/\s*04\s*$/)).toBeVisible();
  });

  test("does not autoplay", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await gotoReady(page, "/");
    await page.locator('[aria-roledescription="carousel"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000);
    await expect(page.getByText(/^\s*01\s*\/\s*04\s*$/)).toBeVisible();
  });

  test("is swipeable on touch screens (native scroll-snap)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, "/");
    const list = page.locator('[aria-roledescription="carousel"]').getByRole("group", { name: /^Slides/ });
    await list.scrollIntoViewIfNeeded();
    const scrollable = await list.evaluate((el) => el.scrollWidth > el.clientWidth && getComputedStyle(el).scrollSnapType !== "none");
    expect(scrollable).toBe(true);
  });
});

test.describe("sample content", () => {
  test("is clearly labelled", async ({ page }) => {
    await gotoReady(page, "/");
    await expect(page.getByText("Sample story · replace before launch").first()).toBeAttached();
    await expect(page.getByText("Sample", { exact: true }).first()).toBeAttached();
  });
});
