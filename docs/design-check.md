# Design check: Student List (HW1)

Design: Claude Design canvas "Student List — HW1 Design" (https://claude.ai/artifact/6aoviCMyXxbLHgLPu5XyCL)
Frames: desktop filled (1440) · empty / no results (1440) · loading skeleton (1440) · mobile filled (375)
Source copy in repo: `docs/design/*.dc.html`

Checked against training Step 2 Part A and `.claude/wm/wm-contract.md` (HTML development guideline, Design guidelines for designers).

## Checklist

| # | Check | Result |
|---|---|---|
| 1 | Page width the same as other pages | OK: 1360px max content width, the same in every desktop frame |
| 2 | Same element spaced the same way everywhere | OK on desktop (40px gutter) and mobile (16px gutter). **Q1** |
| 3 | Repeated parts look the same | OK: top bar, heading, list card and filters are identical across frames |
| 4 | One font, clear sizes | OK: Public Sans. Title 28 / 22 (mobile), body 14, caption 12–13. **Q2** |
| 5 | Long-text wrapping on small screens defined | **Not defined: Q3** |
| 6 | Empty, loading and no-image states designed | Loading and no-results are designed. **Q4** (first-run empty), **Q5** (error). No-image: N/A, avatars are initials |
| 7 | Buttons sized by padding | OK: "Add student" and "Clear filters" use padding. Pagination and icon buttons have a min size for tap targets only |
| 8 | Images fit their box | N/A: no images on this screen |

## Questions for the designer

1. **Gutter between 1440 and 375:** only desktop (40px) and mobile (16px) are drawn. At which WM width does the gutter switch? My assumption is ≤ 768px → 16px.
2. **Smallest text:** table headers and status tags are 12px. Is that the minimum allowed on mobile?
3. **Long names, emails and course names:** should they wrap onto two lines or be cut off with "…"? My assumption is that the name wraps and the email gets "…".
4. **No students at all (first use, no filters):** only "no results for this search" is drawn. Should first use show different text and an "Add student" button instead of "Clear filters"?
5. **Error state** (list fails to load) is not drawn. My assumption is the same block as empty, with an error icon, the API message and a "Try again" button. It's needed in HW2.
6. **Date format:** WM allows `May 1, 2016` or `YYYY-MM-DD`. The design uses a short month (`Aug 12, 2026`). Is the 3-letter month acceptable, or should it be the full month name?
7. **Fees:** the WM three-digit comma rule gives `₹105,000`, not Indian grouping `₹1,05,000`. Please confirm.
8. **Tablet (768–1024):** not drawn. My assumption is the table scrolls inside its box once the card is narrower than the table (about 960px), and the filters wrap.
9. **Mobile actions:** the Actions column is left out at 375. How does a phone user view, edit or delete? Tap the row, or keep the action icons in a sticky last column?
10. **Sorting:** columns show no sort indicator. Which columns can be sorted? (HW2 test cases cover sort.)
11. **Rows per page:** fixed at 10, or should there be a selector?
12. **Dark mode:** only light is drawn. WM needs a 1:1 dark colour for every light colour. Should the dark palette be drawn, or will developers derive it?

## Assumptions I'm building with (until answered)
- Q1: 16px gutter at ≤ 768. Q3: name wraps, email gets "…". Q4: the empty block changes its text and button. Q5: the error block mirrors the empty block. Q6: short month. Q7: `₹105,000`. Q8: scroll inside the box. Q9: action icons stay in the scrolling table on mobile. Q10: sorting deferred to HW2. Q11: fixed at 10. Q12: dark tokens defined in SCSS, light theme only shown.
