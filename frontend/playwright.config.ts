import { defineConfig, devices } from "@playwright/test";

// Local code: PLAYWRIGHT_BASE_URL=http://localhost:3000 (default)
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    // Read-only tests. `npm run test:e2e` runs only this project.
    {
      name: "default",
      testIgnore: /.*\.mutation\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    // Create / edit / delete tests. Opt-in only: `npm run test:e2e:mutation`.
    {
      name: "mutation",
      testMatch: /.*\.mutation\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
