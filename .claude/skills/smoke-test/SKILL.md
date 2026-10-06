---
name: smoke-test
description: After a fix or change, check that the fix works and nothing nearby broke; reports PASS/FAIL/skipped per check with evidence. Use after any bug fix, before committing, or when the user says "smoke test" or "did I break anything".
---

# smoke-test

1. **Blast radius:** run `git diff --stat` (and `git diff` on the changed files). For each changed file, grep for the components and pages that import it, then list the screens affected.
2. **Static checks** (from `frontend/`): run `npx tsc --noEmit` and `npm run lint`. Paste the real output.
3. **Run:** make sure exactly **one** dev server is running (`lsof -i :3000`), plus the backend if the feature uses the API (`lsof -i :<api-port>`). If the page is blank with only the menu showing, stop all node processes, `rm -rf frontend/.next`, and start one server.
4. **Fixed page:** confirm the fix works. Then confirm that list, search, filter and paging still work and the browser console has no red errors. Use Claude in Chrome or Playwright to read the console.
5. **Nearby screens:** open every affected screen from step 1 quickly.
6. **Report** as a table: check | PASS / FAIL / skipped | evidence (output line or screenshot path). Anything you didn't actually run is **"skipped"**, never "PASS".

Keep fixes minimal. If a fix touches more than ~3 files for a small bug, stop and explain why before going on.
