---
name: fe-figma-scaffold
description: Turn a Figma frame into a Next.js + PrimeReact + SCSS screen with mock data, following WM naming. Use when starting a new screen from a design (training Step 2 / Homework 1), or when the user says "build this screen", "scaffold from Figma", or "design check".
---

# fe-figma-scaffold — design → screen (mock data)

Read first: `CLAUDE.md` and `.claude/wm/wm-contract.md` (sections "HTML development guideline", "Light/Dark Mode Color System", "Design guidelines for designers"). WM wins over anything in this file.

Work in three gated parts. **Stop after each part and wait for the user's "go ahead".**

## Part A: design check (no code)
1. Get the Figma link. Load the `figma:figma-design-to-code` skill, then read the frame with `get_design_context` and `get_screenshot`. Never build from a screenshot alone.
2. Check the frame against this list and write one line per item (OK / question for the designer):
   - Page width matches other pages
   - The same element has the same spacing everywhere
   - Repeated parts (table, card, popup) look the same
   - One font family, with clear title and body sizes
   - Long-text wrapping on small screens is defined
   - **Empty**, **loading** and **no image** states are designed
   - Button width comes from padding, not a fixed px value
   - Images fit their box
3. Save the questions to `docs/design-check.md`, because the homework page asks for them.

## Part B: plan (no code)
1. Search the repo for existing components, hooks and styles that already do this (`grep`/`Glob` under `frontend/src`). List them with paths.
2. Propose the file list. Default layout:
   - `src/app/(main)/<domain>/list/page.tsx`: page (thin, composes components)
   - `src/components/common/`: shared pieces (`page-heading`, `state-block` for loading/empty/error, `data-table` wrapper)
   - `src/components/<domain>/`: domain pieces (filters bar, row badge)
   - `src/mocks/<domain>.ts`: typed mock data
   - `src/types/<domain>.ts`: types (no `any`)
   - `src/styles/pages/_<domain>-list.scss` and `src/styles/_variables.scss`
3. Number the build steps and wait.

## Part C: build, one numbered step at a time
- Reuse the components found in Part B, and use the PrimeReact parts already used in the repo (DataTable, InputText, Dropdown, Tag, Skeleton).
- Class names are lowercase-with-hyphens only (`student-list-container`). Don't use camelCase or snake_case.
- **No hardcoded colours or numbers in components or page SCSS.** Colours come from `$<colour>-<code>` variables (e.g. `$red-b1`). Spacing, radius and font sizes come from variables. Every light colour has exactly one dark pair.
- Buttons are sized by padding. Images use `max-width: 100%` / `object-fit`. Line height is in %. No `<br>` for layout.
- Add a short comment above each main JSX/SCSS block.
- Mock data must let the user switch between **loading / empty / filled**. Use a `?state=loading|empty|filled` query param or a small dev toggle, so screenshots can be taken of each state.
- After each step, run the commands below and paste the **real** output:
  ```
  cd frontend && npx tsc --noEmit && npm run lint
  ```
- Then tell the user to open the page and compare it side by side with Figma.

## Done when
- [ ] Design questions written down (or "none found")
- [ ] Looks like the Figma frame
- [ ] tsc and lint clean, with real output shown
- [ ] No duplicate component created
- [ ] Loading, empty and filled states reachable
