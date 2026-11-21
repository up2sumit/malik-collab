import { defineConfig } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  // Tracing records every action and costs a lot of CPU. Turn on with --trace on when debugging.
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: {
    // Demo content is enabled so the sample stories and tiles render. The local
    // submission sink lets the form tests exercise the real route handler.
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_SHOW_DEMO_CONTENT: "true",
      NEXT_PUBLIC_SITE_URL: `http://localhost:${PORT}`,
      ALLOW_LOCAL_SUBMISSION_SINK: "true",
    },
  },
});
