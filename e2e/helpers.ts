import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";

export const routes = [
  "/",
  "/creators",
  "/brands",
  "/collaborations",
  "/resources",
  "/about",
  "/apply",
  "/partner",
  "/privacy",
  "/sports/running",
  "/sports/surfing",
  "/this-page-does-not-exist",
] as const;

export const widths = [360, 375, 390, 430, 768, 1024, 1280, 1440, 1920] as const;

const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

interface AxeViolation {
  id: string;
  impact?: string | null;
  help: string;
  nodes: { target: unknown[]; html: string }[];
}

export async function runAxe(page: Page): Promise<AxeViolation[]> {
  await page.evaluate(axeSource);
  return page.evaluate(async () => {
    const axe = (window as unknown as { axe: { run: (ctx: Document, opts: object) => Promise<{ violations: AxeViolation[] }> } }).axe;
    const result = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } });
    return result.violations;
  });
}

export function formatViolations(violations: AxeViolation[]): string {
  return violations
    .map((v) => `${v.id} (${v.impact}): ${v.help}\n${v.nodes.slice(0, 3).map((n) => `   ${JSON.stringify(n.target)}\n   ${n.html.slice(0, 140)}`).join("\n")}`)
    .join("\n");
}

/** Collects console errors and uncaught exceptions so tests can assert none occurred. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("this-page-does-not-exist")) errors.push(`${r.status()} ${r.url()}`);
  });
  return errors;
}

/** Navigates and waits for hydration, so clicks are not lost on not-yet-interactive controls. */
export async function gotoReady(page: Page, url: string): Promise<void> {
  await page.goto(url);
  await page.locator("html[data-hydrated='true']").waitFor({ state: "attached" });
}
