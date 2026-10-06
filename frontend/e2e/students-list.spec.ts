import { test, expect } from "@playwright/test";

// Student list (HW1, mock data): read-only behaviour.

test.describe("Student list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/students/list");
  });

  test("opens with title, heading and the first 10 rows", async ({ page }) => {
    await expect(page).toHaveTitle("Students | Student Admin");
    await expect(page.getByRole("heading", { level: 1, name: "Students" })).toBeVisible();
    await expect(page.getByText("Showing 1–10 of 25 students")).toBeVisible();
    await expect(page.locator(".p-datatable-tbody > tr")).toHaveCount(10);
  });

  test("shows WM date and number formats", async ({ page }) => {
    const firstRow = page.locator(".p-datatable-tbody > tr").first();
    await expect(firstRow).toContainText("Aarav Sharma");
    await expect(firstRow).toContainText("Aug 12, 2026");
    await expect(firstRow).toContainText("₹45,000");
    // 7th row: a 6-digit amount uses a comma every 3 digits, not Indian grouping
    await expect(page.locator(".p-datatable-tbody > tr").nth(6)).toContainText("₹105,000");
  });

  test("goes to the next page", async ({ page }) => {
    await page.getByRole("button", { name: "Next Page" }).click();
    await expect(page.getByText("Showing 11–20 of 25 students")).toBeVisible();
    await expect(page.locator(".p-datatable-tbody > tr").first()).toContainText("Nikhil Bhosale");
  });

  test("searches by name and by email", async ({ page }) => {
    const search = page.getByLabel("Search students");
    await search.fill("meera");
    await expect(page.locator(".p-datatable-tbody > tr")).toHaveCount(1);
    await expect(page.getByText("Meera Joshi")).toBeVisible();

    await search.fill("rohan.mehta@");
    await expect(page.getByText("Showing 1–1 of 1 students")).toBeVisible();
    await expect(page.getByText("Rohan Mehta")).toBeVisible();
  });

  test("filters by status and resets to page 1", async ({ page }) => {
    await page.getByRole("button", { name: "Next Page" }).click();
    await page.locator(".p-dropdown", { has: page.locator("#student-status") }).click();
    await page.getByRole("option", { name: "Graduated" }).click();
    await expect(page.getByText("Showing 1–5 of 5 students")).toBeVisible();
    const statuses = page.locator(".p-datatable-tbody .student-status-tag");
    await expect(statuses).toHaveCount(5);
    await expect(statuses).toHaveText(Array(5).fill("Graduated"));
  });

  test("no results shows the empty block, and Clear filters brings rows back", async ({ page }) => {
    await page.getByLabel("Search students").fill("zzz-nobody");
    await expect(page.getByRole("heading", { name: "No students found" })).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByText("Showing 1–10 of 25 students")).toBeVisible();
    await expect(page.getByLabel("Search students")).toHaveValue("");
  });
});

test.describe("Student list states", () => {
  test("loading shows skeleton rows", async ({ page }) => {
    await page.goto("/students/list?state=loading");
    await expect(page.getByText("Loading students…")).toBeVisible();
    await expect(page.locator(".table-skeleton-row")).toHaveCount(10);
  });

  test("empty shows 'No students yet' with an Add student button", async ({ page }) => {
    await page.goto("/students/list?state=empty");
    await expect(page.getByRole("heading", { name: "No students yet" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add student" })).toHaveCount(2);
  });

  test("error shows the message and Try again", async ({ page }) => {
    await page.goto("/students/list?state=error");
    // Filter by text: Next.js adds its own hidden role="alert" route announcer
    await expect(page.getByRole("alert").filter({ hasText: "Could not load students" })).toBeVisible();
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page).toHaveURL(/\/students\/list$/);
    await expect(page.getByText("Showing 1–10 of 25 students")).toBeVisible();
  });
});
