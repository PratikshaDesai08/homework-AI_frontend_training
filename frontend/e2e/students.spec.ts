import { expect, test } from "@playwright/test";
import { EMPTY_LIST, SEED, routeList } from "./helpers";

// Student feature: READ-ONLY tests. They never change data (create/edit/delete live in students.mutation.spec.ts).
// Runs against the real API. Needs the 25 seed students (see e2e/helpers.ts → SEED).

const rows = "tbody.p-datatable-tbody > tr:not(.p-datatable-emptymessage)";

test.describe("List: page opens", () => {
  test("shows title, heading and the first page of students", async ({ page }) => {
    await page.goto("/students/list");
    await expect(page).toHaveTitle("Students | Student Admin");
    await expect(page.getByRole("heading", { level: 1, name: "Students" })).toBeVisible();
    await expect(page.getByText(/^Showing 1–10 of \d+ students$/)).toBeVisible();
    await expect(page.locator(rows)).toHaveCount(10);
  });

  test("home page redirects to the list", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/students\/list$/);
  });

  test("dates and money follow WM formats", async ({ page }) => {
    await page.goto("/students/list?search=aarav.sharma");
    const row = page.locator(rows).first();
    await expect(row).toContainText(SEED.aarav.date);
    await expect(row).toContainText(SEED.aarav.fees);
    await page.goto("/students/list?search=vihaan");
    await expect(page.locator(rows).first()).toContainText(SEED.vihaan.fees); // comma every 3 digits, not 1,05,000
  });

  test("desktop table: fees right-aligned, dates on one line (1024px)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto("/students/list?search=aarav.sharma");
    await expect(page.locator(rows)).toHaveCount(1);
    const cells = await page.evaluate(() => {
      const row = document.querySelector("tbody.p-datatable-tbody > tr") as HTMLElement;
      const [, , , date, fees] = Array.from(row.children) as HTMLElement[];
      // Count the lines of the date text itself (the cell is as tall as the 2-line name cell)
      const range = document.createRange();
      range.selectNodeContents(date);
      const dateLines = new Set(Array.from(range.getClientRects()).map((rect) => Math.round(rect.top))).size;
      return { dateLines, feesAlign: getComputedStyle(fees).textAlign };
    });
    expect(cells.dateLines).toBe(1);
    expect(cells.feesAlign).toBe("right");
  });
});

test.describe("List: search, filter, paging", () => {
  test("next page", async ({ page }) => {
    await page.goto("/students/list");
    await page.getByRole("button", { name: "Next Page" }).click();
    await expect(page.getByText(/^Showing 11–20 of \d+ students$/)).toBeVisible();
    await expect(page).toHaveURL(/page=2/);
  });

  test("search by name and by email", async ({ page }) => {
    await page.goto("/students/list");
    const search = page.getByLabel("Search students");
    await search.fill("meera");
    await expect(page.locator(rows)).toHaveCount(1);
    await expect(page.locator(rows).first()).toContainText(SEED.meera.name);
    await search.fill(SEED.rohan.email);
    await expect(page.getByText("Showing 1–1 of 1 students")).toBeVisible();
    await expect(page.locator(rows).first()).toContainText(SEED.rohan.name);
  });

  test("filter by status, back to page 1, kept in the URL after reload", async ({ page }) => {
    await page.goto("/students/list?page=2");
    await page.locator(".p-dropdown", { has: page.locator("#student-status") }).click();
    await page.getByRole("option", { name: "Graduated" }).click();
    await expect(page).toHaveURL(/status=Graduated/);
    await expect(page).not.toHaveURL(/page=2/);
    const tags = page.locator(`${rows} .student-status-tag`);
    await expect(tags.first()).toHaveText("Graduated");
    for (const tag of await tags.all()) await expect(tag).toHaveText("Graduated");

    await page.reload();
    await expect(page.locator(".p-dropdown", { has: page.locator("#student-status") })).toContainText("Graduated");
    await expect(tags.first()).toHaveText("Graduated");
  });

  test("no results shows the empty block; Clear filters brings rows back", async ({ page }) => {
    await page.goto("/students/list");
    await page.getByLabel("Search students").fill("zzz-nobody");
    await expect(page.getByRole("heading", { name: "No students found" })).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByText(/^Showing 1–10 of \d+ students$/)).toBeVisible();
    await expect(page.getByLabel("Search students")).toHaveValue("");
  });
});

test.describe("List: loading, empty, error states", () => {
  test("loading shows skeleton rows", async ({ page }) => {
    await routeList(page, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await route.continue();
    });
    await page.goto("/students/list");
    await expect(page.getByText("Loading students…")).toBeVisible();
    await expect(page.locator(".table-skeleton-row")).toHaveCount(10);
  });

  test("empty database shows 'No students yet' with Add student", async ({ page }) => {
    await routeList(page, (route) => route.fulfill({ json: EMPTY_LIST }));
    await page.goto("/students/list");
    await expect(page.getByRole("heading", { name: "No students yet" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Add student" })).toHaveCount(2);
  });

  test("API error shows the API's message; Try again recovers", async ({ page }) => {
    let fail = true;
    await routeList(page, (route) =>
      fail
        ? route.fulfill({ status: 500, json: { statusCode: 500, message: "Database is not available." } })
        : route.continue(),
    );
    await page.goto("/students/list");
    const alert = page.getByRole("alert").filter({ hasText: "Could not load students" });
    await expect(alert).toBeVisible({ timeout: 15_000 }); // the hook retries once before showing the error
    await expect(alert).toContainText("Database is not available.");
    fail = false;
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(page.getByText(/^Showing 1–10 of \d+ students$/)).toBeVisible();
  });
});

test.describe("Details", () => {
  test("opens from the list and shows every field", async ({ page }) => {
    await page.goto("/students/list?search=aarav.sharma");
    await page.getByRole("link", { name: /Aarav Sharma/ }).first().click();
    await expect(page).toHaveURL(/\/students\/details\/\d+$/);
    await expect(page).toHaveTitle("Student details | Student Admin");
    await expect(page.getByRole("heading", { level: 1, name: SEED.aarav.name })).toBeVisible();
    const card = page.getByRole("region", { name: "Student details" });
    for (const text of [SEED.aarav.email, "Full Stack Web", SEED.aarav.date, SEED.aarav.fees]) {
      await expect(card).toContainText(text);
    }
  });

  test("unknown id shows 'Student not found'", async ({ page }) => {
    await page.goto("/students/details/999999");
    await expect(page.getByRole("heading", { name: "Student not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to students" }).first()).toBeVisible();
  });

  test("Delete → Cancel keeps the student", async ({ page }) => {
    await page.goto("/students/list?search=aarav.sharma");
    await page.getByRole("button", { name: `Delete ${SEED.aarav.name}` }).click();
    const dialog = page.getByRole("dialog", { name: "Delete student?" });
    await expect(dialog).toContainText(`${SEED.aarav.name} will be removed permanently.`);
    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator(rows)).toHaveCount(1);
  });
});

test.describe("Form validation (nothing is saved)", () => {
  test("empty submit shows every required message", async ({ page }) => {
    await page.goto("/students/create");
    await expect(page).toHaveTitle("Add student | Student Admin");
    await page.getByRole("button", { name: "Add student" }).click();
    await expect(page.getByText("Please fix the highlighted fields.")).toBeVisible();
    for (const message of [
      "Name is required.",
      "Email is required.",
      "Course is required.",
      "Enrolled on is required.",
      "Fees paid is required.",
    ]) {
      await expect(page.getByText(message)).toBeVisible();
    }
    await expect(page).toHaveURL(/\/students\/create$/);
  });

  test("wrong formats show the backend's messages", async ({ page }) => {
    await page.goto("/students/create");
    await page.getByLabel("Full name").fill("A");
    await page.getByLabel("Email").fill("aarav@");
    await page.getByLabel("Phone").fill("12345");
    await page.getByRole("button", { name: "Add student" }).click();
    await expect(page.getByText("Name must be 2 to 50 characters.")).toBeVisible();
    await expect(page.getByText("Enter a valid email address, like name@example.com.")).toBeVisible();
    await expect(page.getByText("Phone must be exactly 10 digits.")).toBeVisible();

    await page.getByLabel("Full name").fill("Robert 123");
    await expect(page.getByText("Name can only contain letters, spaces, dots (.), apostrophes (') and hyphens (-).")).toBeVisible();
  });

  test("server error (duplicate email) is shown and the typed values are kept", async ({ page }) => {
    await page.goto("/students/create");
    await page.getByLabel("Full name").fill("Duplicate Person");
    await page.getByLabel("Email").fill(SEED.aarav.email);
    await page.locator(".p-dropdown", { has: page.locator("#student-course") }).click();
    await page.getByRole("option", { name: "Data Science" }).click();
    await page.getByLabel("Enrolled on").fill("January 5, 2026");
    await page.getByLabel("Enrolled on").press("Escape");
    await page.getByLabel("Fees paid (₹)").fill("1000");
    await page.getByRole("button", { name: "Add student" }).click();

    await expect(page.locator(".student-form-banner")).toHaveText("A student with this email already exists.");
    await expect(page.locator("#student-email-note")).toHaveText("A student with this email already exists.");
    await expect(page.getByLabel("Full name")).toHaveValue("Duplicate Person");
    await expect(page).toHaveURL(/\/students\/create$/);
  });

  test("edit form is filled with the current values", async ({ page }) => {
    await page.goto("/students/list?search=aarav.sharma");
    await page.getByRole("link", { name: `Edit ${SEED.aarav.name}` }).click();
    await expect(page).toHaveTitle("Edit student | Student Admin");
    await expect(page.getByLabel("Full name")).toHaveValue(SEED.aarav.name);
    await expect(page.getByLabel("Email")).toHaveValue(SEED.aarav.email);
    await expect(page.getByLabel("Enrolled on")).toHaveValue(SEED.aarav.date);
    await expect(page.getByLabel("Fees paid (₹)")).toHaveValue("45,000");
  });
});
