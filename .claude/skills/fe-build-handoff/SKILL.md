---
name: fe-build-handoff
description: Run all gates (lint, type-check, build, Playwright) and write the 10-part QA build report from real results. Use for training Step 8, Homework 2 submission, or when the user says "hand over to QA", "build report", or "release notes for QA".
---

# fe-build-handoff

Read `.claude/wm/wm-contract.md` sections "QA Process", "Report" and "Build sharing plan".

## 1. Gates: all must be green. If one fails, stop and fix it first.
```bash
cd frontend
npm run lint
npx tsc --noEmit
npm run build
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
cd ../backend && npm run lint && npm run build && npm test
```
Capture the real tail of each output, never a paraphrase.

## 2. Write `docs/qa-build-report.md` with all 10 parts
1. **Build:** branch, commit (`git rev-parse --short HEAD`), demo link (frontend + API), date (WM English format)
2. **TL tasks covered:** links
3. **What changed:** plain words a QA person understands, with no file names
4. **Fixed issues:** each one and what changed (write "none" if this is the first build)
5. **Test accounts / roles:** "Not applicable — no login" (never real passwords)
6. **Data QA must prepare first:** e.g. seed command, or "API seeds 25 students on start"
7. **What to test, numbered:** link to `docs/test-cases.md` IDs
8. **Known issues / not covered:** be honest (e.g. Render cold start of about 1 min, no auth, Safari not checked)
9. **Results:** lint, type-check, build, tests, pasted from step 1
10. **Screen sizes and browsers checked:** from `docs/responsive-report.md`

Wrap it in the WM Report frame: Title → Introduction → Summary → Content (the 10 parts) → References link.

## 3. Process reminders for the user
- Comment on the TL task **before** changing any status.
- Fixed issues go to **Ready for QA** and are assigned to QA. A developer never sets *Fixed* or *Not an issue*.
