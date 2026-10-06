# Homework plan: Students (HW1 + HW2)

Training: TL | AI Frontend Training (Notion) · My page: Pratiksha Patil (Submissions & Feedback)
Reviewer: Vaishali · Results: Excellent / Pass / Resubmit · Missing any section on my page = Resubmit

| | Scope | Due | Gate |
|---|---|---|---|
| **HW1** | Student **list** screen, mock data, all widths (Steps 1, 2, 5) | **Tue 6 Oct 2026**, end of day | — |
| **HW2** | Full CRUD on a real NestJS API, test cases, Playwright, QA report (Steps 3–8) | **Thu 8 Oct 2026**, end of day | Start only after HW1 = **Pass** |

## Decisions
- **Entity:** Student with `id, name, email, phone, course (enum), status (Active | Inactive | Graduated), enrolledOn (date), feesPaid (number)`. This covers WM date, comma-number and status-badge rules.
- **Frontend:** Next.js 15 (App Router) · React 19 · TypeScript · PrimeReact 10 · SCSS · TanStack Query · axios · Playwright, in `frontend/`.
- **Backend (HW2):** NestJS + TypeORM + SQLite · class-validator DTOs · Swagger, in `backend/`.
- **Design:** drawn in Figma through the Figma MCP (filled, empty and loading frames); the link goes on my page.
- **Deploy:** frontend on Vercel (root `frontend`), API on Render (root `backend`). Fallback: "live demo on the review call".
- **Repo:** `homework-AI_frontend_training`, branches `hw1-student-list` and `hw2-student-crud`, each merged to `main` by PR.

## Skills (project-level, in `.claude/skills/`, rules from `.claude/wm/wm-contract.md`)
| Skill | Used in |
|---|---|
| `/fe-figma-scaffold` | HW1: design check → plan → build with mock data |
| `/fe-design-tokens` | HW1 + HW2: hardcoded colour/number and naming audit |
| `/fe-responsive-qa` | HW1 + HW2: screenshots at 10 widths and sideways-scroll check |
| `/fe-api-hook` | HW2: endpoint → service → hook, forms matching the DTO |
| `/fe-qa-testcases` | HW2: written cases + Playwright (read-only and mutation) |
| `/smoke-test` | After every fix |
| `/fe-build-handoff` | HW2: gates + 10-part QA report |

> **Keep a prompt log from minute one.** The submission needs the *exact* prompts and every follow-up correction, untidied. Paste each prompt into `docs/prompt-log.md` as you go (or copy them from the Claude Code transcript at the end).

---

## HW1: today (about 6–7 h)

### 1. Setup (about 45 min) · Step 1
- [ ] Scaffold `frontend/`: `create-next-app` (TS, ESLint, App Router, `src/`), then add `primereact primeicons sass`
- [ ] `npx playwright install chromium`
- [ ] Write `CLAUDE.md` at the repo root (project, stack, commands, folders, rules, WM pointer)
- [ ] Add `.claude/settings.local.json` allowing only safe commands (`git status/diff`, `tsc`, `lint`, `build`, `playwright test`). No push, delete or deploy.
- [ ] `.env.example` committed, `.env.local` git-ignored
- [ ] Prompt: *"Read CLAUDE.md and look around the repo. Explain … Don't change any code."*

### 2. Design (about 1 h) · Step 2 Part A
- [ ] Draw the Student List in Figma: heading + "Add student" button, search box, course and status filters, table (name, email, course, status tag, enrolled on, fees), pagination. Also an **empty** frame, a **loading** (skeleton) frame and a **375 px mobile** frame.
- [ ] `/fe-figma-scaffold` Part A: run the design check and write the questions to `docs/design-check.md`

### 3. Build with mock data (about 2.5 h) · Step 2 Parts B–C
- [ ] `/fe-figma-scaffold` Part B: plan, file list, "go ahead with step 1 only"
- [ ] Shared components: `page-heading`, `state-block` (loading / empty / error), `data-table` wrapper; domain: `student-filters`, `student-status-tag`
- [ ] `_variables.scss` (`$<colour>-<code>` naming, light/dark 1:1 pairs, spacing/font tokens) and `_student-list.scss`
- [ ] Typed mock data (about 25 rows), with client-side search, filter and paging over the mock
- [ ] `?state=loading|empty|filled` switch for the three states
- [ ] WM formats: `May 1, 2016` dates and `12,500` fees through `src/utils/format.ts`
- [ ] `/fe-design-tokens` audit is clean · `npx tsc --noEmit` and `npm run lint` are clean

### 4. Responsive (about 1 h) · Step 5
- [ ] Table scrolls inside its own box below about 991, filters stack on mobile, buttons sized by padding
- [ ] `/fe-responsive-qa` → `docs/screenshots/**` at 1920 · 1600 · 1366 · 1280 · 1024 · 991 · 768 · 640 · 480 · 375 and `docs/responsive-report.md`

### 5. Ship and submit (about 1 h)
- [ ] Deploy `frontend/` to Vercel and check the link in a private window
- [ ] PR `hw1-student-list` → `main`
- [ ] Fill in my Notion page HW1 sections 1–7 (screen, Figma link, design questions, links, screenshots, how to run, **exact prompts and skills**, one problem + fix, real tsc/lint output, checklist)
- [ ] Set **HW1 status → Submitted**, fill in **HW1 submitted on**, and comment on the main task page: "HW1 submitted, please review" + my page link, tagging Vaishali (not on Slack)
- [ ] Self-check: can I explain every component, prop and state in the screen?

---

## HW2: Wed 7 → Thu 8 Oct (after HW1 Pass)

### Day 1 (Wed): backend + API connection
1. **API** (`backend/`, about 2.5 h): NestJS `students` module, SQLite, seed of 25 rows, Swagger at `/api/docs`, CORS for localhost and the Vercel URL.
   - `GET /api/v1/students?search=&course=&status=&page=&limit=&sortBy=&order=` → `{ items, total, page, limit }`
   - `GET /api/v1/students/:id` · `POST` · `PATCH /:id` · `DELETE /:id`
   - DTO: `name` required, 2–50 chars · `email` required, valid, unique (409) · `phone` optional, 10 digits · `course` enum · `status` enum · `enrolledOn` ISO date, not in the future · `feesPaid` int ≥ 0
   - Consistent error body `{ statusCode, message, errors? }`, plus a few e2e tests (`npm test`)
2. **Connect the list** (`/fe-api-hook`, about 2 h): save a real `curl` response to `docs/api-samples/`, add `API_ENDPOINTS`, `StudentService`, `useGetStudentsList` (search, filter, page and sort in the query key and the URL). Check loading, empty and error (backend stopped).
3. **Details page** `/students/details/[id]` with `useGetStudentDetails`.

### Day 2 (Thu): forms, tests, handover
4. **Forms** (about 2 h): `/students/create` and `/students/edit/[id]` share one `student-form`. Validation mirrors the DTO exactly, submit is disabled while saving, success → toast + invalidate + back to list, API error → server message shown and input kept. Delete uses a confirm dialog. Try every rule with bad input.
5. **Responsive + smoke** (about 45 min): `/fe-responsive-qa` on list, details and form · `/smoke-test`
6. **Tests** (about 1.5 h): `/fe-qa-testcases` → `docs/test-cases.md` (every Step 7 area; Roles = "not applicable"), `e2e/students.spec.ts` and `e2e/students.mutation.spec.ts`, both passing locally
7. **Deploy** (about 45 min): API → Render, set `NEXT_PUBLIC_API_BASE_URL` in Vercel → redeploy. On the deployed site: list, create one record, error state.
8. **Handover** (about 45 min): `/fe-build-handoff` → `docs/qa-build-report.md` (10 parts, real gate output) · PR `hw2-student-crud`
9. **Submit:** my page HW2 sections 1–9 · status → Submitted · comment tagging Vaishali

## Risks
- **HW1 is due today.** If time runs short, cut the Figma polish, not the checks. Type-check, lint and screenshots are graded.
- Render free tier sleeps (cold start of about 1 min), so say so next to the link. SQLite on Render is wiped on redeploy, so re-seed on start.
- `NEXT_PUBLIC_*` is baked in at build time, so redeploy Vercel after changing it.
- Run only one `npm run dev` at a time (blank page trap). Open the page once before Playwright (first-compile timeout).
- WM gaps: no standard error texts and no QA Template columns yet, so the backend messages and the "Verify that …" style are used. Note this on the submission.
