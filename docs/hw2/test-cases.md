# HW2 test cases: Student management (list, create, details, edit, delete)

Format: WM QA Template. The WM page defines no columns yet (see `.claude/wm/wm-contract.md`, "QA Template" gap), so scenarios use its "Verify that …" wording, with the columns below.
**Type:** P = positive (expected use), N = negative (wrong input or failure).
**Auto:** the Playwright test that covers the case (`R` = `e2e/students.spec.ts`, read-only; `M` = `e2e/students.mutation.spec.ts`, mutation; `RS` = `e2e/responsive.spec.ts`). `—` = manual only.

**Environment:** demo https://homework-ai-frontend-training.vercel.app (API on Render, free plan: the first request after ~15 minutes idle takes up to about a minute). No login.
**Data:** the API starts with 25 seed students. Please don't edit or delete these, because the read-only tests use them: Aarav Sharma, Vihaan Reddy, Meera Joshi, Rohan Mehta. Create your own students for create, edit and delete.

## 1. Page opens

| ID | Type | Scenario | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| STU-OPEN-01 | P | Verify that the list page opens with the right title and first page | API has data | Open `/students/list` | Tab title "Students \| Student Admin"; heading "Students"; 10 rows; "Showing 1–10 of N students" | R |
| STU-OPEN-02 | P | Verify that the home page goes to the list | — | Open `/` | Redirects to `/students/list` | R |
| STU-OPEN-03 | P | Verify that dates and money use WM formats | Seed data | Search "aarav.sharma" | Enrolled on "August 12, 2026"; fees "₹45,000". Vihaan Reddy shows "₹105,000" (comma every 3 digits) | R |

## 2. List: search, filter, sort, paging

| ID | Type | Scenario | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| STU-LIST-01 | P | Verify that search by name finds the student | Seed data | Type "meera" in Search | Only Meera Joshi; results update without pressing Enter | R |
| STU-LIST-02 | P | Verify that search by email works | Seed data | Type "rohan.mehta@example.com" | 1 result, "Showing 1–1 of 1 students" | R |
| STU-LIST-03 | P | Verify that search ignores letter case | Seed data | Type "MEERA" | Meera Joshi is found | — |
| STU-LIST-04 | P | Verify that the Status filter shows only that status and goes back to page 1 | On page 2 | Status → Graduated | Every tag says Graduated; URL has `status=Graduated`, no `page=2` | R |
| STU-LIST-05 | P | Verify that the Course filter works together with Status | Seed data | Course → Data Science, Status → Graduated | Only Priya Venkatesh | — |
| STU-LIST-06 | P | Verify that filters survive a page reload | Filter set | Reload the page | Same filter selected, same results | R |
| STU-LIST-07 | P | Verify that Next page shows rows 11–20 | 25+ students | Click › | "Showing 11–20 of N"; URL has `page=2` | R |
| STU-LIST-08 | P | Verify that the newest student appears first | — | Add a student, go to the list | New student is the first row | M |
| STU-LIST-09 | N | Verify that a search with no match shows the empty block | — | Search "zzz-nobody" | "No students found" + Clear filters | R |
| STU-LIST-10 | P | Verify that Clear filters resets the search and filters | STU-LIST-09 | Click Clear filters | Search box empty; list back to page 1 | R |
| STU-LIST-11 | P | Verify that clicking a name or the eye icon opens the details | — | Click a name | Details page of that student | R |
| STU-LIST-12 | N | Verify that a wrong page number in the URL doesn't break the page | — | Open `/students/list?page=abc` | Page 1 is shown | — |

Sorting: the API supports `sortBy` and `order`, but the screen shows newest first and has no sort control (design Q10). Not tested from the UI.

## 3. List: loading, empty, error

| ID | Type | Scenario | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| STU-STATE-01 | P | Verify that a slow API shows skeleton rows | Slow network (DevTools → Network → Slow 3G) | Open the list | 10 grey rows + "Loading students…"; heading and filters already visible | R |
| STU-STATE-02 | P | Verify that an empty database shows "No students yet" | No students | Open the list | "No students yet" + Add student | R (simulated) |
| STU-STATE-03 | N | Verify that an API error shows the API's message and Try again | API down or returns 500 | Open the list | Red block "Could not load students" with the message; Try again reloads | R (simulated) |
| STU-STATE-04 | N | Verify that a stopped API shows a connection message | Stop the API | Open the list | "Could not reach the server. Check your connection and try again." | — |
| STU-STATE-05 | P | Verify that changing page keeps the old rows (dimmed) until the new ones arrive | Slow network | Click › | Rows dim, then update; no skeleton flash | — |

## 4. Create

| ID | Type | Scenario | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| STU-CRE-01 | P | Verify that a student can be added with all fields | — | Add student → fill all fields → Add student | Toast "&lt;name&gt; was added."; back on the list; new row first, with "₹" amount and full-month date | M |
| STU-CRE-02 | P | Verify that phone is optional | — | Add without phone | Saved; details show "Not provided" | — |
| STU-CRE-03 | N | Verify that an empty form shows every required message | — | Click Add student | Banner "Please fix the highlighted fields."; Name / Email / Course / Enrolled on / Fees paid "… is required." | R |
| STU-CRE-04 | N | Verify that a 1-letter name is rejected | — | Name "A" → submit | "Name must be 2 to 50 characters." | R |
| STU-CRE-05 | N | Verify that a name longer than 50 characters is rejected | — | 51 letters → submit | "Name must be 2 to 50 characters." | — (API: backend e2e) |
| STU-CRE-06 | N | Verify that digits in the name are rejected | — | "Robert 123" → submit | "Name can only contain letters, spaces, dots (.), apostrophes (') and hyphens (-)." | R |
| STU-CRE-07 | N | Verify that a wrong email is rejected | — | "aarav@" → submit | "Enter a valid email address, like name@example.com." | R |
| STU-CRE-08 | N | Verify that a duplicate email shows the server's message and keeps the input | Seed data | Email aarav.sharma@example.com + valid fields → submit | Banner + field "A student with this email already exists."; typed values kept; not saved | R |
| STU-CRE-09 | N | Verify that a phone that isn't 10 digits is rejected | — | "12345" → submit | "Phone must be exactly 10 digits." | R |
| STU-CRE-10 | N | Verify that letters can't be typed in Phone | — | Type "abc" in Phone | Nothing typed | — |
| STU-CRE-11 | N | Verify that a future enrolment date can't be chosen | — | Open the date picker | Days after today are disabled. (API also rejects: "Enrolled on must be a valid date that is not in the future.") | — (API: backend e2e) |
| STU-CRE-12 | N | Verify that fees can't be negative or a decimal | — | Type "-5", then "10.5" in Fees paid | The minus sign and decimal point can't be typed ("-5" → 5, "10.5" → 105). The API also rejects them: "Fees paid cannot be negative." / "Fees paid must be a whole number." | — (API: backend e2e) |
| STU-CRE-13 | N | Verify that fees over 10,000,000 are rejected | — | 10000001 → submit | "Fees paid cannot be more than 10,000,000." | — |
| STU-CRE-14 | P | Verify that the submit button can't be clicked twice | Slow network | Click Add student twice quickly | Button shows "Saving…" and is disabled; only one student created | — |
| STU-CRE-15 | P | Verify that Cancel goes back without saving | Some fields typed | Click Cancel | Back to the list; nothing added | — |
| STU-CRE-16 | P | Verify that errors update while typing after the first submit | STU-CRE-03 | Type a valid name | "Name is required." disappears | — |

## 5. Details

| ID | Type | Scenario | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| STU-DET-01 | P | Verify that the details page shows every field | Seed data | Open Aarav Sharma | Name, status tag, email, phone, course, status, "August 12, 2026", "₹45,000", Added on, Last updated | R |
| STU-DET-02 | N | Verify that an unknown id shows "Student not found" | — | Open `/students/details/999999` | "Student not found" + Back to students | R |
| STU-DET-03 | N | Verify that a non-number id shows "Student not found" | — | Open `/students/details/abc` | "Student not found" | — |
| STU-DET-04 | P | Verify that Back to students returns to the list | — | Click Back to students | List page | — |

## 6. Edit

| ID | Type | Scenario | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| STU-EDIT-01 | P | Verify that the edit form is filled with current values | Seed data | Edit Aarav Sharma | Every field filled; fees "45,000"; date "August 12, 2026" | R |
| STU-EDIT-02 | P | Verify that saved changes show on the list and details | Own student | Change status + fees → Save changes | Toast "Changes to &lt;name&gt; were saved."; list and details show the new values | M |
| STU-EDIT-03 | N | Verify that clearing a required field blocks saving | — | Clear Name → Save | "Name is required."; not saved | — |
| STU-EDIT-04 | N | Verify that changing the email to another student's email is rejected | Two students | Use the other's email → Save | "A student with this email already exists." | — (API: backend e2e) |
| STU-EDIT-05 | P | Verify that Cancel returns to details without saving | — | Change a field → Cancel | Details page with old values | — |
| STU-EDIT-06 | N | Verify that editing an unknown id shows "Student not found" | — | Open `/students/edit/999999` | "Student not found" | — |

## 7. Delete

| ID | Type | Scenario | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| STU-DEL-01 | P | Verify that Delete asks for confirmation | — | Click the trash icon | Dialog "Delete student?" with the name; Cancel is focused | R |
| STU-DEL-02 | P | Verify that Cancel keeps the student | STU-DEL-01 | Click Cancel | Dialog closes; student still listed | R |
| STU-DEL-03 | P | Verify that deleting from the details page removes the student | Own student | Details → Delete → Delete | Toast "&lt;name&gt; was deleted."; back on the list; searching finds nothing | M |
| STU-DEL-04 | P | Verify that deleting from the list removes the row | Own student | Trash icon → Delete | Toast; row gone; total down by 1 | — |
| STU-DEL-05 | N | Verify that opening a deleted student shows "Student not found" | STU-DEL-03 | Open its old details URL | "Student not found" | — |

## 8. Roles

| ID | Type | Scenario | Expected result | Auto |
|---|---|---|---|---|
| STU-ROLE-01 | — | Not applicable: the app has no login or roles | — | — |

## 9. Screen sizes (1440 · 768 · 375, plus all 10 WM widths)

| ID | Type | Scenario | Steps | Expected result | Auto |
|---|---|---|---|---|---|
| STU-RES-01 | P | Verify that no page scrolls sideways at any WM width | Open list, details, add, edit at 1920 → 375 | No sideways scroll; nothing cut off or overlapping | RS (90 checks) |
| STU-RES-02 | P | Verify that the list shows cards at 768 and below | 768 / 375 | One card per student: name + status, Course / Enrolled on / Fees paid, icons at the bottom | RS |
| STU-RES-03 | P | Verify that the form is one column on phones | 375 | Fields stacked; buttons wrap; error banner full width | RS |
| STU-RES-04 | P | Verify that the delete dialog fits a phone | 375 | Dialog inside the screen, buttons tappable (≥ 44px) | — |
