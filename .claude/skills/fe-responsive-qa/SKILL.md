---
name: fe-responsive-qa
description: Screenshot a page at all 10 WM widths (1920→375) with Playwright, detect sideways scroll and overflowing elements, and write a report. Use for training Step 5, before submitting, or when the user says "check responsive", "screenshots at all widths", or "mobile/tablet check".
---

# fe-responsive-qa: all WM widths

WM widths: `1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375`.

## 1. Make sure the script exists
If `frontend/e2e/responsive.spec.ts` is missing, create it. The spec must:
- Read the target paths from a `PAGES` array (e.g. `['/students/list?state=filled', '/students/list?state=empty', '/students/list?state=loading']`).
- For each path × width, set the viewport to `{ width, height: 900 }`, go to the page, wait for `networkidle`, and save a full-page screenshot to `docs/screenshots/<page-slug>/<width>.png`.
- Assert **no sideways scroll**: `document.documentElement.scrollWidth <= window.innerWidth`.
- Collect offenders: elements whose `getBoundingClientRect().right > window.innerWidth`. Ignore elements inside a container with `overflow-x: auto|scroll` (tables are allowed to scroll inside their own box). Print their tag and class.

## 2. Run it against local code
Start **one** dev server only (two servers cause a blank page). Open the page once so Next compiles it, then run:
```bash
cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test e2e/responsive.spec.ts --reporter=list
```
Paste the real output.

## 3. Look at the screenshots
Open the images with the Read tool (at least 1920, 1366, 768 and 375 for every state) and check each for:
- sideways scroll
- overlapping or cut-off parts
- badly wrapped text
- images not fitting
- fixed-width buttons
- a table pushing the page wider
- tap targets under ~40px on phone

## 4. Report
Write `docs/responsive-report.md` with a table: width | state | result (PASS / FAIL / skipped) | issue | screenshot path. If the design doesn't define a size, list it as **"question for designer"**, not as a bug. Never write PASS for a width you didn't look at.
