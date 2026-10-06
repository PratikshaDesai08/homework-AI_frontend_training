# homework-AI_frontend_training

Student Admin: homework for **TL | AI Frontend Training** (Pratiksha Patil).

- **HW1** (branch `hw1-student-list`): Student List screen built from a Claude Design, with mock data. Covers loading, empty, error and filled states at every WM width (1920 → 375).
- **HW2**: full CRUD on a real NestJS API (to come).

## Run it

Needs Node 20+.

```bash
git clone https://github.com/PratikshaDesai08/homework-AI_frontend_training.git
cd homework-AI_frontend_training/frontend
npm install
cp .env.example .env.local      # not used by HW1, needed for HW2
npm run dev                     # http://localhost:3000 → /students/list
```

States (HW1 mock data):

| URL | Shows |
|---|---|
| `/students/list` | filled list (25 students, 10 per page) |
| `/students/list?state=loading` | loading skeleton |
| `/students/list?state=empty` | no students yet |
| `/students/list?state=error` | error message + Try again |

Search for something that doesn't exist (e.g. `zzz`) to see the "No students found" state.

## Checks

```bash
cd frontend
npx tsc --noEmit
npm run lint
npm run build
npx playwright install chromium                         # first time only
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e   # with npm run dev running
```

## Docs
- `docs/PLAN.md`: plan for HW1 + HW2
- `docs/design/` and `docs/design-check.md`: design source and design-check questions
- `docs/responsive-report.md` and `docs/screenshots/`: screenshots at all WM widths
- `docs/hw1-check-output.txt`: real output of type-check, lint, build and tests
- `docs/prompt-log.md`: exact prompts used
- `CLAUDE.md`, `.claude/skills/`, `.claude/wm/wm-contract.md`: Claude Code setup
