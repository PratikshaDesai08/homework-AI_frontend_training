// Design review material for Bhagyashree (HW2 page, section 10):
//   1. docs/design/png/<Frame>.png  — a PNG of every Claude Design frame (no login needed to view)
//   2. docs/design-review/<screen>-<width>.png — design on the left, built screen on the right, at 1440 / 768 / 375
//
// Usage (from frontend/, with the API and the app running):
//   DC_RUNTIME=/path/to/dc-runtime.js BUILD_URL=http://localhost:3001 API_URL=http://localhost:4000/api/v1 \
//     node scripts/design-review.mjs
// DC_RUNTIME is the Claude Design runtime (artifact-type/dc-runtime.js of the design artifact); it renders
// the .dc.html frames in docs/design/ exactly like the design canvas does.

import { chromium } from "@playwright/test";
import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "..");
const DESIGN_DIR = path.join(ROOT, "docs", "design");
const PNG_DIR = path.join(DESIGN_DIR, "png");
const REVIEW_DIR = path.join(ROOT, "docs", "design-review");
const RUNTIME = process.env.DC_RUNTIME;
const BUILD_URL = process.env.BUILD_URL ?? "http://localhost:3000";
const API_URL = process.env.API_URL ?? "http://localhost:4000/api/v1";
if (!RUNTIME) throw new Error("Set DC_RUNTIME to the Claude Design runtime file (dc-runtime.js)");

const canvas = JSON.parse(readFileSync(path.join(DESIGN_DIR, "canvas.json"), "utf8"));
const LIST_REQUEST = /\/api\/v1\/students\?/;

// Screen × width → design frame + how to open the same state in the build
const COMPARISONS = [
  { screen: "list", width: 1440, frame: "Main", url: () => "/students/list" },
  { screen: "list", width: 768, frame: "ListTablet", url: () => "/students/list" },
  { screen: "list", width: 375, frame: "Mobile", url: () => "/students/list" },
  { screen: "list-loading", width: 1440, frame: "Loading", url: () => "/students/list", hangList: true },
  { screen: "list-no-results", width: 1440, frame: "Empty", url: () => "/students/list?search=zzz" },
  { screen: "details", width: 1440, frame: "Details", url: (id) => `/students/details/${id}` },
  { screen: "details", width: 768, frame: "DetailsTablet", url: (id) => `/students/details/${id}` },
  { screen: "details", width: 375, frame: "DetailsMobile", url: (id) => `/students/details/${id}` },
  { screen: "create", width: 1440, frame: "Create", url: () => "/students/create" },
  { screen: "create", width: 768, frame: "CreateTablet", url: () => "/students/create" },
  { screen: "create", width: 375, frame: "CreateMobile", url: () => "/students/create" },
  { screen: "create-errors", width: 1440, frame: "CreateErrors", url: () => "/students/create", fillErrors: true },
  { screen: "create-errors", width: 375, frame: "CreateErrorsMobile", url: () => "/students/create", fillErrors: true },
  { screen: "edit", width: 1440, frame: "Edit", url: (id) => `/students/edit/${id}` },
  { screen: "edit", width: 768, frame: "EditTablet", url: (id) => `/students/edit/${id}` },
  { screen: "edit", width: 375, frame: "EditMobile", url: (id) => `/students/edit/${id}` },
  { screen: "delete-confirm", width: 1440, frame: "DeleteConfirm", url: (id) => `/students/details/${id}`, openDelete: true },
  { screen: "delete-confirm", width: 375, frame: "DeleteConfirmMobile", url: (id) => `/students/details/${id}`, openDelete: true },
];

/** Serve docs/design/*.dc.html + the runtime from a fake origin (no web server needed) */
async function routeDesign(page) {
  await page.route("http://design.local/**", (route) => {
    const name = decodeURIComponent(new URL(route.request().url()).pathname.slice(1));
    if (name === "support.js") return route.fulfill({ path: RUNTIME, contentType: "text/javascript" });
    return route.fulfill({ path: path.join(DESIGN_DIR, name), contentType: "text/html" });
  });
}

async function renderFrame(browser, frame, width) {
  const board = canvas.boards[`${frame}.dc.html`];
  const page = await browser.newPage({ viewport: { width, height: board?.h ?? 900 } });
  await routeDesign(page);
  await page.goto(`http://design.local/${frame}.dc.html`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1500); // fonts + runtime render
  const png = await page.screenshot({ fullPage: true });
  await page.close();
  return png;
}

async function renderBuild(browser, item, studentId) {
  const page = await browser.newPage({ viewport: { width: item.width, height: 900 } });
  if (item.hangList) await page.route(LIST_REQUEST, () => new Promise(() => {}));
  await page.goto(BUILD_URL + item.url(studentId));
  await page.waitForLoadState("networkidle").catch(() => {});
  if (item.fillErrors) {
    // Same invalid values as the design frame
    await page.getByLabel("Email").fill("aarav@");
    await page.getByLabel("Phone").fill("12345");
    await page.getByLabel("Fees paid (₹)").fill("45000");
    await page.getByRole("button", { name: "Add student" }).click();
    await page.getByText("Please fix the highlighted fields.").waitFor();
  }
  if (item.openDelete) {
    await page.getByRole("region", { name: "Student details" }).waitFor();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("dialog", { name: "Delete student?" }).waitFor();
  }
  await page.waitForTimeout(800);
  const png = await page.screenshot({ fullPage: !item.openDelete });
  await page.close();
  return png;
}

/** Two screenshots next to each other with captions, saved as one PNG */
async function sideBySide(browser, item, designPng, buildPng, file) {
  const page = await browser.newPage({ viewport: { width: item.width * 2 + 72, height: 600 } });
  const img = (png) => `data:image/png;base64,${png.toString("base64")}`;
  await page.setContent(`<!doctype html><html><body style="margin:0;background:#e5e7eb;font:600 18px system-ui,sans-serif;color:#111827">
    <div style="display:flex;gap:24px;padding:24px;align-items:flex-start">
      <figure style="margin:0;width:${item.width}px"><figcaption style="padding:0 0 12px">Design · ${item.frame}.dc.html · ${item.width}px</figcaption>
        <img src="${img(designPng)}" style="display:block;width:${item.width}px;box-shadow:0 0 0 1px #9ca3af"></figure>
      <figure style="margin:0;width:${item.width}px"><figcaption style="padding:0 0 12px">Build · ${item.url("{id}")} · ${item.width}px</figcaption>
        <img src="${img(buildPng)}" style="display:block;width:${item.width}px;box-shadow:0 0 0 1px #9ca3af"></figure>
    </div></body></html>`);
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
}

const browser = await chromium.launch();
mkdirSync(PNG_DIR, { recursive: true });
mkdirSync(REVIEW_DIR, { recursive: true });

// 1. PNG of every design frame, at its own width
for (const file of readdirSync(DESIGN_DIR).filter((name) => name.endsWith(".dc.html"))) {
  const frame = file.replace(".dc.html", "");
  const board = canvas.boards[file];
  if (!board) continue;
  const png = await renderFrame(browser, frame, board.w);
  const out = path.join(PNG_DIR, `${frame}.png`);
  await import("node:fs").then((fs) => fs.writeFileSync(out, png));
  console.log("frame", out.replace(ROOT + "/", ""));
}

// 2. Side by side
const res = await fetch(`${API_URL}/students?search=aarav.sharma@example.com`);
const studentId = (await res.json()).items[0]?.id;
if (!studentId) throw new Error("Seed student Aarav Sharma not found");
for (const item of COMPARISONS) {
  const designPng = await renderFrame(browser, item.frame, item.width);
  const buildPng = await renderBuild(browser, item, studentId);
  const out = path.join(REVIEW_DIR, `${item.screen}-${item.width}.png`);
  await sideBySide(browser, item, designPng, buildPng, out);
  console.log("compare", out.replace(ROOT + "/", ""));
}

await browser.close();
