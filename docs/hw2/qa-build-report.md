# QA build report: Student management (HW2)

**Title:** Student Admin, students CRUD on a real API, build for QA
**Introduction:** HW2 of the AI Frontend Training. Turns the HW1 student list (mock data) into a complete feature on a real backend: list, add, details, edit and delete.
**Summary:** Deployed and green. 111 / 111 Playwright tests pass against the deployed demo; 29 / 29 API tests pass; lint, type-check and build are clean. No open bugs; a few known limits are listed in part 8.

## Content

### 1. Build
| | |
|---|---|
| Demo (frontend) | https://homework-ai-frontend-training.vercel.app (Vercel, production, from `main`) |
| API | https://student-admin-api.onrender.com/api/v1 · Swagger: https://student-admin-api.onrender.com/api/docs (Render free plan) |
| Branch | `hw2-student-crud`, merged to `main` (merge commit `e20ddef`; app code at `2d7cdc7`) |
| Repo | https://github.com/PratikshaDesai08/homework-AI_frontend_training |
| Date | October 8, 2026 |

### 2. TL tasks covered
- TL | AI Frontend Training: Building Frontend with Claude Code (for Backend Developers), Homework 2 (Steps 3–8)
- Submission page: Pratiksha Patil (Submissions & Feedback)

### 3. What changed, in plain words
- The student list now shows real data from the server. You can search by name or email, filter by course and status, and move between pages; the filters stay in the address bar, so refresh and Back keep them.
- New pages: **Add student**, **Student details**, **Edit student**. Delete asks "Delete student?" first, from the list or the details page.
- The form checks the same rules as the server, with the same messages. If the server still says no (e.g. duplicate email), its message appears under the field and what you typed stays.
- Success and error messages appear as a toast (top right).
- Loading (grey rows), empty ("No students yet" / "No students found"), error ("Could not load students" + Try again) and "Student not found" states.
- Phones and small tablets (≤ 768px) show the list as cards.

### 4. Fixed issues
| Issue | What changed |
|---|---|
| HW1 review: dates showed short months (`Aug 12, 2026`) | Full month name, WM format: `August 12, 2026` |
| Desktop table: fees and actions not right-aligned, long dates wrapping at 1024px | Lost table styles restored; a test now checks them at 1024px |
| Delete from the details page didn't return to the list (development mode only) | Delete waits for the server's answer directly; see the Notion page, section 8 |

### 5. Test accounts / roles
Not applicable: the app has no login or roles. Anyone with the link can use it.

### 6. Data QA must prepare first
- Nothing. The API starts with **25 demo students**.
- **Please don't edit or delete:** Aarav Sharma, Vihaan Reddy, Meera Joshi, Rohan Mehta (the read-only Playwright tests use them). Create your own students for edit and delete.
- Render's free plan has no permanent disk: after a redeploy or restart (it also sleeps after ~15 minutes idle) the data goes back to the 25 demo students. The first request after sleeping can take up to about a minute.

### 7. What to test, numbered
Full list with steps and expected results: [`docs/hw2/test-cases.md`](test-cases.md) (56 cases: 34 positive, 21 negative, 1 not applicable).
1. List opens with 10 rows and "Showing 1–10 of N students" (STU-OPEN-01)
2. Search by name and by email; no-results block and Clear filters (STU-LIST-01, 02, 09, 10)
3. Course and status filters, page 2, reload keeps filters (STU-LIST-04 … 07)
4. Add a student with all fields, then without phone (STU-CRE-01, 02)
5. Every validation message, incl. duplicate email from the server (STU-CRE-03 … 13)
6. Double-click Add student on a slow network: only one record (STU-CRE-14)
7. Details page, unknown id (STU-DET-01 … 03)
8. Edit: pre-filled values, save, cancel, duplicate email (STU-EDIT-01 … 06)
9. Delete: confirm, cancel, from list and from details (STU-DEL-01 … 05)
10. Loading, empty and error states (STU-STATE-01 … 05)
11. 1440, 768, 375 (and any WM width): no sideways scroll, cards on phones (STU-RES-01 … 04)

### 8. Known issues and what is not covered
- **First load can be slow (up to ~1 minute)** when the free Render API has been idle. Not a bug in the app; the list shows its loading state, then the data.
- **Data resets** on API restart / redeploy (free plan, no permanent disk).
- **No sort control** on the list (the API supports `sortBy` / `order`; the design has no sort UI, design question Q10). The list is newest first.
- **No login / roles**; anyone with the link can change data.
- **Browsers:** tested in Chromium (Playwright) only. Safari and Firefox were not checked.
- **Dark mode:** colour tokens exist (light + dark pairs) but there is no switch in the UI; only light is shown.

### 9. Results of lint, type-check, build and tests
```
backend   npm run lint        → no warnings, no errors (oxlint)
backend   npm run typecheck   → exit 0
backend   npm run build       → exit 0
backend   npm test            → Test Files 1 passed (1) · Tests 29 passed (29)

frontend  npm run lint        → no warnings, no errors (eslint)
frontend  npx tsc --noEmit    → exit 0
frontend  npm run build       → Compiled successfully · /students/list, /create, /details/[id], /edit/[id]

Playwright against the DEPLOYED demo (October 8, 2026, 18:24 IST):
$ PLAYWRIGHT_BASE_URL=https://homework-ai-frontend-training.vercel.app \
  PLAYWRIGHT_API_URL=https://student-admin-api.onrender.com/api/v1 \
  npx playwright test --project=default --project=mutation --reporter=list,html
  111 passed (1.6m)      18 read-only · 90 responsive · 3 mutation (cleaned up: 0 test students left)

Playwright against a local production build: 111 passed (51.7s)
```
HTML reports: [`docs/hw2/playwright-report/`](playwright-report/) (deployed run) and [`docs/hw2/playwright-report-local/`](playwright-report-local/). Download the folder and open `index.html`.

### 10. Screen sizes and browsers checked
- **Automatic:** every screen and state (list filled / empty / loading / error, details, not found, add, add with errors, edit) at all 10 WM widths: 1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375. No sideways scroll, nothing sticking out. Screenshots: [`docs/screenshots/hw2/`](../screenshots/hw2/).
- **By eye:** 1440, 1024, 768 and 375 for list, details, add (with errors) and edit; design vs build side by side at 1440 / 768 / 375 in [`docs/design-review/`](../design-review/).
- **Browser:** Chromium (Playwright, desktop Chrome profile).

**References:** Notion submission page (Pratiksha Patil) · test cases [`test-cases.md`](test-cases.md) · design PNGs [`docs/design/png/`](../design/png/) · API samples [`docs/api-samples/`](../api-samples/)
