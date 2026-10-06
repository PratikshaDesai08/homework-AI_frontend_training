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
| 1024 | PASS | PASS | PASS | PASS | Table slightly wider than the card, so it scrolls inside its box and the "swipe" hint shows |
| 991 | PASS | PASS | PASS | PASS | |
| 768 | PASS | PASS | PASS | PASS | Gutter 16px. Rows shown as cards (labels left, values right, status top-right, actions at the bottom) |
| 640 | PASS | PASS | PASS | PASS | Cards. Filters: search on its own row, dropdowns share the next |
| 480 | PASS | PASS | PASS | PASS | |
| 375 | PASS | PASS | PASS | PASS | Cards. Every field visible without swiping. Matches the updated mobile frame. Button wraps under the title, pagination wraps |

Browser: Chromium (Playwright, Desktop Chrome profile). Not checked: Safari and Firefox.

## Fixed during the check
- 375: dropdown placeholders were cut off ("All cour…"). Fixed with a narrower chevron area on phones.
- 768: dates wrapped onto two lines. Fixed with `white-space: nowrap` on the date column.
- **Phones showed only the name and half the course** (found in review). Everything else needed a sideways swipe inside the table. Fixed by turning each row into a card at ≤ 768px. PrimeReact's `responsiveLayout="stack"` renders a label in each cell, but its runtime CSS injection didn't apply in Next.js, so the card layout is our own SCSS in `_app-data-table.scss`.
- "Swipe the table sideways" hint: shows only from 769 to 1024px, where the table still scrolls inside its box.
- The empty-state icon was smaller than in the design. primeicons sets its own size, so it's overridden.

## Differences from the design / open questions
- The swipe hint renders below the pagination (PrimeReact puts the table footer there), while the design has it above.
- Q9 in `design-check.md` is resolved: cards on mobile, with the action icons at the bottom of each card.
