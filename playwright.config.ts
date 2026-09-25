import { defineConfig, devices } from "@playwright/test";

const port = 4173;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // A fresh in-memory database with demo tasks for every run.
    command: "npm run build && npm start",
    url: `http://127.0.0.1:${port}/api/health`,
    env: { PORT: String(port), DB_PATH: ":memory:", SEED: "1", SERVE_CLIENT: "1" },
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
