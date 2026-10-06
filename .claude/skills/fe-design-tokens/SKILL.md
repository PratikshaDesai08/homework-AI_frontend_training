---
name: fe-design-tokens
description: Find hardcoded colours/numbers and WM naming violations in SCSS/TSX and move them to light/dark SCSS variables. Use before submitting a screen, when the user asks to "check tokens", "remove hardcoded colours", or set up light/dark variables.
---

# fe-design-tokens: audit and fix hardcoded values

Read `.claude/wm/wm-contract.md` sections "HTML development guideline" and "Light/Dark Mode Color System" first.

## 1. Audit (report only, no edits)
Run from `frontend/`, then show the hits grouped by file:
```bash
# hex / rgb / hsl colours outside the variables file
grep -rnE "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(" src --include=*.scss --include=*.tsx --include=*.ts | grep -v "_variables.scss"
# raw px/rem numbers in page/component SCSS (variables file excluded)
grep -rnE "[0-9]+(px|rem)" src/styles src/components --include=*.scss | grep -v "_variables.scss"
# inline style objects in TSX
grep -rn "style={{" src --include=*.tsx
# camelCase / snake_case class names
grep -rnoE "className=\"[^\"]*\"" src --include=*.tsx | grep -E "[A-Z_]"
grep -rnE "^\s*\.[a-z0-9-]*[A-Z_]" src --include=*.scss
# fixed widths on buttons
grep -rnB3 "width:" src --include=*.scss | grep -i "btn\|button"
```
`0`, `100%`, `1px` borders and breakpoint values used inside the breakpoint mixin are acceptable. Say which ones you are leaving and why.

## 2. Fix (after the user agrees)
- Colour variables follow `$<colour>-<code>` (`$red-b1: #B12028;`). Names like `$red-dark` or `$red-1` are not allowed.
- Light/dark: keep each colour as a **1:1 pair** with the same base name, exposed as CSS custom properties under `[data-theme="light"]` / `[data-theme="dark"]` (or `prefers-color-scheme`). Colours that don't change by mode go in a "constant" group.
- Spacing, radius, font size and z-index come from named variables in `_variables.scss`.
- Icons are named `icon-<name>-<colour>`, and you check whether one already exists first.

## 3. Verify
Re-run the audit and paste the before/after counts, then `npx tsc --noEmit && npm run lint` with real output.
