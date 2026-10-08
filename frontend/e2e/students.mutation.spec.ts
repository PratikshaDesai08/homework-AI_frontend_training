import { expect, test } from "@playwright/test";
import { API_URL } from "./helpers";

// Student feature: MUTATION tests (create → edit → delete). They change data, so they don't run by default:
//   npm run test:e2e:mutation
// Each run uses its own unique email and removes anything it created, even if a step fails.

const stamp = Date.now();
const student = {
  name: "Playwright Test Student",
  email: `e2e.test.${stamp}@example.com`,
  course: "Cloud & DevOps",
  enrolledOn: "March 3, 2026",
  fees: "12345",
};
const rows = "tbody.p-datatable-tbody > tr:not(.p-datatable-emptymessage)";

test.describe.configure({ mode: "serial" });

test.afterAll(async ({ request }) => {
  // Clean up: delete every student this run created
  const res = await request.get(`${API_URL}/students`, { params: { search: `e2e.test.${stamp}`, limit: 100 } });
  const { items } = (await res.json()) as { items: { id: number }[] };
  for (const item of items) await request.delete(`${API_URL}/students/${item.id}`);
});

test("create: the new student appears at the top of the list", async ({ page }) => {
  await page.goto("/students/list");
  await page.getByRole("link", { name: "Add student" }).first().click();
  await expect(page).toHaveURL(/\/students\/create$/);

  await page.getByLabel("Full name").fill(student.name);
  await page.getByLabel("Email").fill(student.email);
  await page.locator(".p-dropdown", { has: page.locator("#student-course") }).click();
  await page.getByRole("option", { name: student.course }).click();
  await page.getByLabel("Enrolled on").fill(student.enrolledOn);
  await page.getByLabel("Enrolled on").press("Escape");
  await page.getByLabel("Fees paid (₹)").fill(student.fees);
  await page.getByRole("button", { name: "Add student" }).click();

  await expect(page.getByText(`${student.name} was added.`)).toBeVisible();
  await expect(page).toHaveURL(/\/students\/list$/);
  const first = page.locator(rows).first();
  await expect(first).toContainText(student.email);
  await expect(first).toContainText("₹12,345");
  await expect(first).toContainText("March 3, 2026");
});

test("edit: changes show on the list and the details page", async ({ page }) => {
  await page.goto(`/students/list?search=${encodeURIComponent(student.email)}`);
  await page.getByRole("link", { name: `Edit ${student.name}` }).click();
  await expect(page.getByLabel("Email")).toHaveValue(student.email);

  await page.locator(".p-dropdown", { has: page.locator("#student-status") }).click();
  await page.getByRole("option", { name: "Graduated" }).click();
  await page.getByLabel("Fees paid (₹)").fill("54321");
  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByText(`Changes to ${student.name} were saved.`)).toBeVisible();
  await page.goto(`/students/list?search=${encodeURIComponent(student.email)}`);
  const row = page.locator(rows).first();
  await expect(row.locator(".student-status-tag")).toHaveText("Graduated");
  await expect(row).toContainText("₹54,321");

  await row.getByRole("link", { name: `View ${student.name}` }).click();
  await expect(page.getByRole("region", { name: "Student details" })).toContainText("₹54,321");
});

test("delete from the details page: confirm, toast, gone from the list", async ({ page }) => {
  await page.goto(`/students/list?search=${encodeURIComponent(student.email)}`);
  await page.getByRole("link", { name: `View ${student.name}` }).click();
  // Wait until the details are on screen, like a user reading the page before deleting
  await expect(page.getByRole("region", { name: "Student details" })).toContainText(student.email);
  await page.getByRole("button", { name: "Delete" }).click();
  await page.getByRole("dialog", { name: "Delete student?" }).getByRole("button", { name: "Delete" }).click();

  await expect(page.getByText(`${student.name} was deleted.`)).toBeVisible();
  await expect(page).toHaveURL(/\/students\/list$/);
  await page.goto(`/students/list?search=${encodeURIComponent(student.email)}`);
  await expect(page.getByRole("heading", { name: "No students found" })).toBeVisible();
});
