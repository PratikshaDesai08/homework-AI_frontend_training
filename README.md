# homework-AI_frontend_training

Student Admin, homework for **TL | AI Frontend Training** (Pratiksha Patil).

- **HW1** (branch `hw1-student-list`): Student List screen built from a Claude Design, with mock data.
- **HW2** (branch `hw2-student-crud`): full feature on a real API. List (search, filters, paging), add, details, edit and delete, with test cases, Playwright tests and a QA hand-over report.

| | |
|---|---|
| Demo | https://homework-ai-frontend-training.vercel.app |
| API (Render, free) | see `docs/hw2/qa-build-report.md`. The first call after ~15 min idle takes up to a minute. |
| Design | Claude Design "Student Admin — HW1 & HW2 Design" · PNGs in `docs/design/png/` |

## Run it locally (two terminals, Node 20+)

```bash
git clone https://github.com/PratikshaDesai08/homework-AI_frontend_training.git
cd homework-AI_frontend_training
git checkout hw2-student-crud
```

**1. API**: NestJS + SQLite on http://localhost:4000 (Swagger at http://localhost:4000/api/docs)
```bash
cd backend
npm install
npm run start:dev          # creates data/students.sqlite and adds 25 demo students on first start
```

**2. Frontend**: Next.js on http://localhost:3000
```bash
cd frontend
npm install
cp .env.example .env.local # NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
npm run dev                # open http://localhost:3000 → /students/list
```

To start again with only the 25 demo students: stop the API, delete `backend/data/`, start it again.

## Checks

```bash
# backend
cd backend && npm run lint && npm run typecheck && npm run build && npm test     # 29 API tests (in-memory DB)

# frontend (API running)
cd frontend && npm run lint && npx tsc --noEmit && npm run build
npx playwright install chromium                                                  # first time only
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e                       # read-only + responsive (108)
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e:mutation              # create → edit → delete (3)
npm run test:e2e:report                                                          # open the HTML report
```

## Docs
- `docs/hw2/test-cases.md`: QA test cases (WM QA Template style, positive + negative)
- `docs/hw2/qa-build-report.md`: QA hand-over report (10 parts)
- `docs/hw2/playwright-report/`: Playwright HTML report (open `index.html`)
- `docs/design/` (frames + `png/`), `docs/design-review/`: design vs build side by side at 1440 / 768 / 375
- `docs/screenshots/hw2/`: every screen and state at all 10 WM widths
- `docs/api-samples/`: real API responses
- `docs/PLAN.md`, `docs/prompt-log.md`, `CLAUDE.md`, `.claude/skills/`
