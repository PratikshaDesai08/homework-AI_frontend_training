---
name: fe-qa-testcases
description: Write QA test cases (WM QA Template style) and Playwright e2e tests for a feature — a read-only spec plus a separate *.mutation.spec.ts for create/edit/delete. Use for training Step 7 or when the user says "write test cases", "Playwright test", or "e2e".
---

# fe-qa-testcases: written cases + Playwright

## Part A: written test cases → `docs/test-cases.md`
The WM QA Template page defines no columns yet (see `.claude/wm/wm-contract.md` "QA Template" GAP). Its only example writes scenarios as **"Verify that …"**, so use that phrasing and these columns:

| ID | Area | Scenario ("Verify that …") | Precondition | Steps | Expected result | Width |

IDs look like `STU-LIST-001`. You must cover every area:
- **Page opens**: the title is right and the list shows rows
- **Main flow**: create → it shows in the list → edit → the change shows → delete (with confirm) → it's gone
- **Validation**: an empty required field, too long, wrong format, and an error returned by the server
- **List**: search, filter, sort, next page, no results
- **Roles**: write a single row saying "Not applicable — app has no login"
- **States**: loading, empty, error (backend stopped)
- **Screen sizes**: 1920 / 1366 / 768 / 375

## Part B: Playwright
- `e2e/<feature>.spec.ts` covers read-only behaviour: page opens (check **visible title text** and the page `<title>`, not only the URL), search, filter, paging, the empty result, and client-side validation messages.
- `e2e/<feature>.mutation.spec.ts` covers create → edit → delete. Use a unique name such as `E2E Test <timestamp>` and clean up in `afterAll`. It must **not run by default**: exclude `*.mutation.spec.ts` with `testIgnore` in the default project and add an npm script `test:e2e:mutation`.
- Prefer `getByRole` / `getByLabel` / `getByText` over CSS selectors.
- Run against local code with the backend up:
  ```bash
  cd frontend && PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
  PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e:mutation
  ```
  Open the page once first, because the first compile can time out. Paste the **real** output.
