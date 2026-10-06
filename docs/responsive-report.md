# Responsive report: Student List (HW1)

Run on 2026-10-06 with `/fe-responsive-qa` against local code (`npm run dev`, one server):
```
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e
```
`e2e/responsive.spec.ts` loads each state at every WM width, saves a full-page screenshot, and fails if the page scrolls sideways or any element sticks out past the right edge. Elements inside a scroll box, like the table, are ignored.

Result: **40 / 40 passed**. No sideways scroll on the page at any width from 1920 to 375. Screenshots were also checked by eye at 1920, 1366, 1024, 768 and 375.

Screenshots: `docs/screenshots/<state>/<width>.png`

| Width | Filled | Empty | Loading | Error | Notes (checked by eye) |
|---|---|---|---|---|---|
| 1920 | PASS | PASS | PASS | PASS | Content centred at 1360px max width, matches the design |
| 1600 | PASS | PASS | PASS | PASS | |
| 1366 | PASS | PASS | PASS | PASS | Matches the desktop frame |
| 1280 | PASS | PASS | PASS | PASS | |
| 1024 | PASS | PASS | PASS | PASS | Table slightly wider than the card, so it scrolls inside its box and the hint shows |
| 991 | PASS | PASS | PASS | PASS | |
| 768 | PASS | PASS | PASS | PASS | Gutter 16px. Table scrolls inside its box. Dates stay on one line |
| 640 | PASS | PASS | PASS | PASS | Filters: search on its own row, dropdowns share the next |
| 480 | PASS | PASS | PASS | PASS | |
| 375 | PASS | PASS | PASS | PASS | Matches the mobile frame: button wraps under the title, pagination wraps |

Browser: Chromium (Playwright, Desktop Chrome profile). Not checked: Safari and Firefox.

## Fixed during the check
- 375: dropdown placeholders were cut off ("All cour…"). Fixed with a narrower chevron area on phones.
- 768: dates wrapped onto two lines. Fixed with `white-space: nowrap` on the date column.
- The "Swipe the table sideways" hint from the mobile design was missing. Added; it shows at ≤ 1024.
- The empty-state icon was smaller than in the design. primeicons sets its own size, so it's overridden.

## Differences from the design / open questions
- The swipe hint renders below the pagination (PrimeReact puts the table footer there), while the design has it above.
- Q9 in `design-check.md`: the design has no Actions column on mobile. The build keeps the action icons in the scrolling table so they stay reachable.
