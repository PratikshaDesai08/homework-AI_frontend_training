import type { Page, Route } from "@playwright/test";

/** Backend base URL, for test setup/cleanup calls (not used by the app itself) */
export const API_URL = process.env.PLAYWRIGHT_API_URL ?? "http://localhost:4000/api/v1";

/** Matches the app's list call: GET …/api/v1/students?page=…&limit=… */
export const LIST_REQUEST = /\/api\/v1\/students\?/;

export const EMPTY_LIST = { items: [], total: 0, page: 1, limit: 10 };

/** Run `handler` for list requests only (details/create calls go through untouched) */
export async function routeList(page: Page, handler: (route: Route) => Promise<void> | void) {
  await page.route(LIST_REQUEST, (route) => (route.request().method() === "GET" ? handler(route) : route.continue()));
}

/** Seed students the read-only tests rely on. QA: please don't edit or delete these. */
export const SEED = {
  aarav: { name: "Aarav Sharma", email: "aarav.sharma@example.com", date: "August 12, 2026", fees: "₹45,000" },
  vihaan: { name: "Vihaan Reddy", fees: "₹105,000" },
  meera: { name: "Meera Joshi" },
  rohan: { name: "Rohan Mehta", email: "rohan.mehta@example.com" },
} as const;
