import { test, expect } from "@playwright/test";
import path from "node:path";

// WM screen widths, largest to smallest
const WIDTHS = [1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375];

// Each page/state to check. slug = screenshot folder name.
const PAGES = [
  { slug: "student-list-filled", url: "/students/list", ready: "Showing 1–10 of 25 students" },
  { slug: "student-list-empty", url: "/students/list?state=empty", ready: "No students yet" },
  { slug: "student-list-loading", url: "/students/list?state=loading", ready: "Loading students…" },
  { slug: "student-list-error", url: "/students/list?state=error", ready: "Could not load students" },
];

const SCREENSHOT_DIR = path.join(__dirname, "..", "..", "docs", "screenshots");

for (const page of PAGES) {
  for (const width of WIDTHS) {
    test(`${page.slug} @ ${width}px: no sideways scroll`, async ({ page: browserPage }) => {
      await browserPage.setViewportSize({ width, height: 900 });
      await browserPage.goto(page.url);
      await expect(browserPage.getByText(page.ready)).toBeVisible();

      await browserPage.screenshot({
        path: path.join(SCREENSHOT_DIR, page.slug, `${width}.png`),
        fullPage: true,
      });

      // Elements sticking out past the right edge, ignoring anything inside a scroll box
      const offenders = await browserPage.evaluate(() => {
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
          .slice(0, 10)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ").join(".")}`);
      });

      const scroll = await browserPage.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));

      expect(offenders, `elements overflowing at ${width}px`).toEqual([]);
      expect(scroll.scrollWidth, `page scrolls sideways at ${width}px`).toBeLessThanOrEqual(scroll.clientWidth);
    });
  }
}
