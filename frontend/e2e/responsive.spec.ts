import { test, expect, type Page } from "@playwright/test";
import path from "node:path";
import { API_URL, EMPTY_LIST, SEED, routeList } from "./helpers";

// No sideways scroll at any WM width, for every screen and state. Saves a screenshot of each.
// Read-only: states are simulated by intercepting the list request, nothing is changed.

const WIDTHS = [1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375];
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR ?? path.join(__dirname, "..", "..", "docs", "screenshots", "hw2");

type Screen = {
  slug: string;
  /** `id` = a seed student's id (Aarav Sharma) */
  url: (id: number) => string;
  ready: string;
  /** Optional setup before opening the page (e.g. fake an API state) */
  setup?: (page: Page) => Promise<void>;
  /** Optional action after the page is ready (e.g. submit an empty form) */
  act?: (page: Page) => Promise<void>;
};

const SCREENS: Screen[] = [
  { slug: "list-filled", url: () => "/students/list", ready: "Showing 1–10 of" },
  {
    slug: "list-empty",
    url: () => "/students/list",
    ready: "No students yet",
    setup: (page) => routeList(page, (route) => route.fulfill({ json: EMPTY_LIST })),
  },
  {
    slug: "list-loading",
    url: () => "/students/list",
    ready: "Loading students…",
    setup: (page) => routeList(page, () => new Promise(() => {})), // never answers
  },
  {
    slug: "list-error",
    url: () => "/students/list",
    ready: "Could not load students",
    setup: (page) =>
      routeList(page, (route) =>
        route.fulfill({ status: 500, json: { statusCode: 500, message: "Something went wrong. Please try again." } }),
      ),
  },
  { slug: "details", url: (id) => `/students/details/${id}`, ready: "Student details" },
  { slug: "details-not-found", url: () => "/students/details/999999", ready: "Student not found" },
  { slug: "create", url: () => "/students/create", ready: "Fields marked" },
  {
    slug: "create-errors",
    url: () => "/students/create",
    ready: "Fields marked",
    act: async (page) => {
      await page.getByRole("button", { name: "Add student" }).click();
      await expect(page.getByText("Please fix the highlighted fields.")).toBeVisible();
    },
  },
  { slug: "edit", url: (id) => `/students/edit/${id}`, ready: "Save changes" },
];

let seedId = 0;

test.beforeAll(async ({ request }) => {
  const res = await request.get(`${API_URL}/students`, { params: { search: SEED.aarav.email } });
  seedId = ((await res.json()) as { items: { id: number }[] }).items[0]?.id ?? 0;
  expect(seedId, "seed student Aarav Sharma must exist").toBeGreaterThan(0);
});

for (const screen of SCREENS) {
  for (const width of WIDTHS) {
    test(`${screen.slug} @ ${width}px: no sideways scroll`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await screen.setup?.(page);
      await page.goto(screen.url(seedId));
      await expect(page.getByText(screen.ready).first()).toBeVisible({ timeout: 15_000 });
      await screen.act?.(page);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, screen.slug, `${width}.png`), fullPage: true });

      // Elements sticking out past the right edge, ignoring anything inside a scroll box
      const offenders = await page.evaluate(() => {
        const viewport = document.documentElement.clientWidth;
        const insideScrollBox = (el: Element) => {
          for (let node = el.parentElement; node; node = node.parentElement) {
            const overflowX = getComputedStyle(node).overflowX;
            if (overflowX === "auto" || overflowX === "scroll") return true;
          }
          return false;
        };
        return Array.from(document.body.querySelectorAll("*"))
          .filter((el) => el.getBoundingClientRect().right > viewport + 1 && !insideScrollBox(el))
          .filter((el) => getComputedStyle(el).position !== "fixed") // toasts / dialogs sit outside the page flow
          .slice(0, 10)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").join(".")}`);
      });

      const scroll = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(offenders, `elements overflowing at ${width}px`).toEqual([]);
      expect(scroll.scrollWidth, `page scrolls sideways at ${width}px`).toBeLessThanOrEqual(scroll.clientWidth);
    });
  }
}
