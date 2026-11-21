import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./helpers";

/** The server rejects submissions faster than 2.5s after the form appears. */
const humanPause = (page: Page) => page.waitForTimeout(2700);

async function fillCreator(page: Page) {
  await page.getByLabel("Full name").fill("Alex Rivera");
  await page.getByLabel("Email").fill("alex@example.com");
  await page.getByLabel("Main sport").selectOption("running");
  await page.getByLabel("Content type").selectOption("vlog");
  await page.getByLabel("Instagram").fill("@alexruns");
  await page.getByLabel("Tell us about your content").fill("I film long trail runs and write up what I learn about pacing and gear.");
  await page.getByLabel(/I have read the/).check();
}

async function fillBrand(page: Page) {
  await page.getByLabel("Your name").fill("Sam Lee");
  await page.getByLabel("Work email").fill("sam@brand.example");
  await page.getByLabel("Company").fill("Trail Co");
  await page.getByLabel("Collaboration type").selectOption("campaign");
  await page.getByLabel("Tell us about the campaign").fill("A spring campaign for a new trail shoe aimed at first-time trail runners.");
  await page.getByLabel(/I have read the/).check();
}

test.describe("creator application", () => {
  test("shows accessible validation errors and focuses the first problem", async ({ page }) => {
    await gotoReady(page, "/apply");
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.getByText("Name must be at least 2 characters.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Choose your main sport.")).toBeVisible();
    await expect(page.getByText("Please confirm you have read the privacy notice.")).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeFocused();
    await expect(page.getByLabel("Full name")).toHaveAttribute("aria-invalid", "true");
    const describedBy = await page.getByLabel("Full name").getAttribute("aria-describedby");
    expect(describedBy).toBe("c-name-error");
  });

  test("requires at least one link to the creator's work", async ({ page }) => {
    await gotoReady(page, "/apply");
    await fillCreator(page);
    await page.getByLabel("Instagram").fill("");
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.locator("#c-portfolio-error")).toContainText("Add at least one link to your work");
  });

  test("submits successfully through the real route handler", async ({ page }) => {
    await gotoReady(page, "/apply");
    await fillCreator(page);
    await humanPause(page);
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/apply/creator")),
      page.getByRole("button", { name: "Send application" }).click(),
    ]);
    expect(response.status()).toBe(200);
    await expect(page.getByRole("status")).toContainText("Application received");
    await expect(page.getByRole("status")).toBeFocused();
  });

  test("shows the server's message when delivery fails and keeps the data", async ({ page }) => {
    await page.route("**/api/apply/creator", (route) =>
      route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false, code: "not_configured", message: "We can't accept submissions right now. Please try again later." }) }),
    );
    await gotoReady(page, "/apply");
    await fillCreator(page);
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.getByRole("form", { name: "Creator application" }).getByRole("alert")).toContainText("can't accept submissions");
    await expect(page.getByLabel("Full name")).toHaveValue("Alex Rivera");
    await expect(page.getByRole("button", { name: "Send application" })).toBeEnabled();
  });

  test("maps server-side field errors onto the form", async ({ page }) => {
    await page.route("**/api/apply/creator", (route) =>
      route.fulfill({ status: 422, contentType: "application/json", body: JSON.stringify({ ok: false, code: "validation", message: "Please check the highlighted fields.", fieldErrors: { email: "This email domain is not accepted." } }) }),
    );
    await gotoReady(page, "/apply");
    await fillCreator(page);
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.getByText("This email domain is not accepted.")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeFocused();
  });

  test("handles a network failure without losing input", async ({ page }) => {
    await page.route("**/api/apply/creator", (route) => route.abort("failed"));
    await gotoReady(page, "/apply");
    await fillCreator(page);
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.getByRole("form", { name: "Creator application" }).getByRole("alert")).toContainText("couldn't reach the server");
    await expect(page.getByLabel("Full name")).toHaveValue("Alex Rivera");
  });

  test("disables the button while sending to prevent double submits", async ({ page }) => {
    let calls = 0;
    await page.route("**/api/apply/creator", async (route) => {
      calls++;
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await gotoReady(page, "/apply");
    await fillCreator(page);
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.getByRole("button", { name: "Sending…" })).toBeDisabled();
    await expect(page.getByRole("status")).toBeVisible();
    expect(calls).toBe(1);
  });

  test("honeypot value typed by a bot is sent to the server", async ({ page }) => {
    let body: Record<string, unknown> = {};
    await page.route("**/api/apply/creator", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ ok: true }) });
    });
    await gotoReady(page, "/apply");
    await fillCreator(page);
    await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
    await page.getByRole("button", { name: "Send application" }).click();
    await expect(page.getByRole("status")).toBeVisible();
    expect(body.website).toBe("http://spam.example");
  });

  test("honeypot is invisible and unreachable for people", async ({ page }) => {
    await gotoReady(page, "/apply");
    const honeypot = page.locator('input[name="website"]');
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    await expect(honeypot.locator("xpath=ancestor::div[@aria-hidden='true']")).toHaveCount(1);
  });
});

test.describe("brand enquiry", () => {
  test("validates required fields", async ({ page }) => {
    await gotoReady(page, "/partner");
    await page.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Choose a collaboration type.")).toBeVisible();
    await expect(page.getByText("Company must be at least 2 characters.")).toBeVisible();
  });

  test("submits successfully through the real route handler", async ({ page }) => {
    await gotoReady(page, "/partner");
    await fillBrand(page);
    await page.getByLabel("Budget range").selectOption("5k-20k");
    await humanPause(page);
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().endsWith("/api/apply/brand")),
      page.getByRole("button", { name: "Send enquiry" }).click(),
    ]);
    expect(response.status()).toBe(200);
    await expect(page.getByRole("status")).toContainText("Enquiry received");
  });

  test("is usable at 360px with no overflow", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await gotoReady(page, "/partner");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const box = await page.getByLabel("Your name").boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(270);
    expect(await page.getByLabel("Your name").evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
  });
});

test.describe("API surface", () => {
  test("rejects a cross-origin POST", async ({ request }) => {
    const response = await request.post("/api/apply/creator", { headers: { origin: "https://evil.example", "content-type": "application/json" }, data: {} });
    expect(response.status()).toBe(403);
  });

  test("rejects GET", async ({ request }) => {
    expect((await request.get("/api/apply/creator")).status()).toBe(405);
  });
});
