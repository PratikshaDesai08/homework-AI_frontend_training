# Student Admin — Frontend (AI Frontend Training homework)

Admin screen for managing students in a training institute: list, search and filter students, add, view, edit and delete them. Used by office staff on desktop, tablet and phone. Built by Pratiksha Patil (a backend developer) as homework for "TL | AI Frontend Training" (Notion). HW1 = the list screen with mock data. HW2 = full CRUD on the real API in `backend/` (NestJS, see backend/README.md).

Stack: Next.js 15 (App Router) · React 19 · TypeScript · PrimeReact 10 · SCSS · TanStack Query 5 · axios · Playwright
Backend API: NestJS 12 + TypeORM + SQLite in `backend/` (run: `cd backend && npm run start:dev`, port 4000, Swagger /api/docs).
Frontend reads it from `NEXT_PUBLIC_API_BASE_URL` (see `frontend/.env.example`). Deploy: Vercel (frontend/) + Render (render.yaml).

## Commands (run from `frontend/`)
npm run dev                 # start the app on localhost:3000 — only ONE dev server at a time
npx tsc --noEmit            # type-check — run after every change
npm run lint
npm run build
npm run test:e2e            # Playwright, read-only + responsive (project "default"), API must be running
npm run test:e2e:mutation   # create/edit/delete tests (project "mutation"), opt-in only
npm run test:e2e:all        # both, one HTML report (playwright-report/)
npm run test:e2e:ui         # visual runner
Test local code with: PLAYWRIGHT_BASE_URL=http://localhost:3000

## Folders (`frontend/`)
src/app/(main)/students/...  pages: list / create / details/[id] / edit/[id]
src/components/common/       shared UI: PageHeading, StateBlock (empty/error), TableSkeleton (loading), AppDataTable (PrimeReact DataTable wrapper)
src/components/layout/       AppHeader (top bar, used by src/app/(main)/layout.tsx)
src/components/common/       + BackLink, DetailList, DetailSkeleton, FormField, ToastProvider (useAppToast)
src/components/students/     StudentListScreen, StudentFilters, StudentNameCell, StudentStatusTag,
                             StudentDetailsScreen, StudentForm (create + edit), StudentCreateScreen, StudentEditScreen
src/app/providers.tsx        QueryClientProvider + ToastProvider + global ConfirmDialog
src/api-services/            http.ts (axios instance, toApiError), StudentService.ts
src/hooks/API/students/      useGetStudentsList, useGetStudentDetails, useCreateStudent, useUpdateStudent, useDeleteStudent
src/hooks/                   useStudentListParams (filters + page in the URL), useDebouncedValue, useConfirmDeleteStudent
src/utils/                   api-integration.ts (API_ENDPOINTS, QUERIES), format.ts (WM date/number),
                             student-rules.ts (form validation = backend DTO rules and messages), breakpoints.ts
src/types/                   TypeScript types — no `any`
src/styles/                  _variables.scss (ALL raw values + day/night colour maps), _functions.scss (c("blue-b1") → var(--blue-b1)),
                             _theme.scss (CSS vars per theme), _mixins.scss (below("md")), components/, pages/
e2e/                         Playwright: <feature>.spec.ts, <feature>.mutation.spec.ts
docs/ (repo root)            PLAN.md, design-check.md, prompt-log.md, screenshots/, reports

## Data flow (HW2)
Screen → hook (src/hooks/API/students) → StudentService → axios `http` → API. Mutations invalidate the `students` query key so lists refresh.
List filters/page live in the URL (useStudentListParams). Form rules live in src/utils/student-rules.ts and must match
backend/src/students/dto/create-student.dto.ts (rules AND messages). Change both together.
Tests: e2e/students.spec.ts (read-only, uses seed students), students.mutation.spec.ts, responsive.spec.ts; helpers in e2e/helpers.ts.

## Rules
- Plan first, then one step at a time. Run type-check and lint after each step and show the real output.
- Follow the style of the file you are editing. Reuse existing components before making new ones.
- Class names lowercase-with-hyphens (`student-list-container`). No camelCase or snake_case.
- No hardcoded colours or numbers in components or page SCSS. Use `src/styles/_variables.scss`.
  Colours: add the name to BOTH $colors-day and $colors-night, then use c("name"). Names are colour + code (`red-r1`).
- Buttons are sized by padding (no fixed width). Images fit their box. Line height is in %.
- No sideways scroll at any WM width: 1920 1600 1366 1280 1024 991 768 640 480 375.
- Every list shows loading, empty and error states.
- API calls only through service + hook. Never call axios in a component.
- Dates: `May 1, 2016` or `YYYY-MM-DD`. Numbers: a comma every 3 digits. Use `src/utils/format.ts`.
- `"use client"` only on components that use state, effects or event handlers.
- Never commit `.env.local`. Never push, deploy or delete without asking.
- Company rules: `.claude/wm/wm-contract.md` (digest of the WM Notion pages). If it conflicts with this file, WM wins.
- Project skills: `/fe-figma-scaffold`, `/fe-design-tokens`, `/fe-responsive-qa`, `/fe-api-hook`, `/fe-qa-testcases`, `/smoke-test`, `/fe-build-handoff`.
