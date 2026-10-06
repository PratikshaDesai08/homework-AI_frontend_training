# WM (Work Manual) Contract — Rules Digest

Source: Divii Notion "WM | Work Manual" pages, fetched 2026-10-06 via Notion MCP.
Scope: only what the pages say. Quotes are verbatim. "GAP" notes mark things the
page does NOT define (do not invent them; ask or use project spec instead).

---

## HTML development guideline
Source: https://app.notion.com/p/9695262a68b7463db0d750634029da96 (last edit 2023-01-12)

### Figma review checklist (before development)
1. Container size — check all pages to confirm container size (fluid, small, medium).
2. Consistency in spacing & margin — same elements = same spacing.
   - e.g. "if a breadcrumb has 40px gap in bottom, it should be the same for every page which has a breadcrumb section."
   - "spacing between button should be same for entire site"
3. Consistency in design components — e.g. two pages with accordions: "the accordion should be identical".
4. Consistency in font — "Entire site should consist of one font family."
5. Text line break in responsive.
6. Ask designer for a font/color library — e.g. "h1 = 28px 700, h2 = 22px 700, p = 16px 400, small = 12px 400".
7. Check whether a no-image / no-data design is provided; if not, ask for it.
8. **Button width** — "button width should not be fixed by PX, we will use padding for that."
9. **Image width & height** — "it should be flexible & fit to box."
10. Browser support — check for any specific request.

### Folder structure (original HTML project)
```
project/
  dist/css/        style.css, style.map
  assets/          icons/ (svg, png), images/ (jpg, png), fonts/ (web fonts)
  scss/
    _reset.scss        reset style (if not using any CSS framework)
    _variables.scss    all variable style
    _modal.scss        all modal style
    _mixins.scss       all types of mixins (grid, text, button)
    _icon.scss         all icon style
    _font.scss         all web-fonts style
    _header.scss       header style
    _footer.scss       footer style
    _component.scss    all components style
    _form-element.scss all form-elements (input, radio, checkbox)
    _button.scss       all buttons style
    style.scss         imports all scss files + commonly used global styles
  js/app.js        all kinds of scripts
  index.html, component.html, modal.html, form-element.html
```
- Common & reusable elements -> `component.html`; all form elements -> `form-element.html`; all modals -> `modal.html`.

### Naming conventions
- Page files: `index.number.all-small-letters.html`
  - Correct: `0.0.0.login.html`, `0.0.3.forget-password.html`
  - Wrong: `0.0.3-forget_password.html`
- **SCSS colour variables: main colour name, then code**
  - Wrong: `$red-dark: #B12028;`, `$red-1: #B12028;`
  - Correct: `$red-b1: #B12028;`
- **Class/id naming: small letters and hyphen**
  - Wrong: `mainContainer`, `main_container`
  - Correct: `main-container`
- Image naming: no spaces, no block (capital) letters — always use hyphen.
- Icon naming: always start with `icon-`; include colour to disambiguate.
  - Correct: `icon-arrow-right-white`, `icon-arrow-right-grey`
  - Wrong: `right-arrow-1`, `right-arrow-2`
  - Check whether an icon already exists in the folder before adding.

### Media query breakpoints (mandatory)
`1920 → 1600 → 1366 → 1280 → 1024 → 991 → 768 → 640 → 480 → 375`

### Other rules
- Comment in HTML, JavaScript and style "for almost every block".
- All HTML work pushed to the **HTML branch** on GitHub.
- Components as small as possible — "no more than three HTML elements".
- "Create global variables for colors, repeating dimensions, etc., to make your code clean and easy to change globally."
- Always ask for both desktop and mobile designs before implementing.
- If final design not ready, code components first, then complex structures.
- "quality isn't created during the QA process, but rather during the development itself."
- VS Code Live Sass Compile settings: `"format": "expanded"`, `"extensionName": ".css"`, `"savePath": "/dist/css"`.

---

## Light/Dark Mode Color System
Source: https://app.notion.com/p/75711652f115489c9d0800aa76c44da4 (last edit 2022-08-11; written in Korean, translated here; one embedded video block not fetched)

Figma workflow: STEP 1 install the "Appearance" plugin from Figma Community; STEP 2 register colours; STEP 3 finish design with registered colours, then run the plugin.

**Must-follow rules (STEP 2, "꼭 지켜주세요"):**
1. Colours are swapped **1:1**. Mapping two different colours A, B to one colour C is not allowed — every colour must have a 1:1 counterpart.
2. For grey colours, do not use Divii's library greys; define separate colours and register them in the library.
3. Not only colours, but styles such as Opacity can be registered and converted.
4. **Paired colours in each mode must have identical names except for the `[day]` / `[night]` suffix.**
5. Importance levels (Primary / Secondary, etc.) may be named freely.

Three colour groups:
1. Light-mode colours — append `[day]`: e.g. `A [day]`, `B [day]`, `C [day]`
2. Dark-mode colours — append `[night]`: e.g. `A [night]`, `B [night]`, `C [night]`
3. Mode-independent colours — put in a separate group as **Constant**.

Frontend implication (direct reading of rules 1/4): every themed token needs exactly one light and one dark value under the same base name; mode-independent tokens are constants.

---

## Design guidelines for designers
Source: https://app.notion.com/p/3d66aa4c0ef1487c87abd45f16f280cb (last edit 2023-05-15)

- Consistent spacing for same elements — "if page heading has 20px gap from content section, it will be 20px for all the pages."
- **No fixed width for cards and buttons** — "Please make flexible width for cards, buttons."
- **Line break** — "using <br> tag is not a good practice. Line break is meant to be flexible with screen size."
- Font: maintain a base font size and derive h1–h6, p from it; global font weight for same elements.
- **"Line height should be in percentage (%)"**
- Use Google Fonts for font family (web-font conversion bloats size / loading time).
- Icons: use SVG icons, Font Awesome, Fontastic (not images; image icons need two images for hover). Links: fontastic.me, fontawesome.com, heroicons.dev (Figma compatible).
- Container width same for all pages, per CSS framework (Bootstrap, Materialize, Tailwind).
- "UI design for web and mobile should be same. If you use normal cards in web it cannot be convert into carousel in mobile."
- Recommended: use a CSS framework grid (Bootstrap 5, Materialize, Tailwind; Flowbite for Tailwind components, forms, modal UI).

---

## Figma Setting Rules
Source: https://app.notion.com/p/2fdb2ebedc3742ba9ea38a9cd8ddc40e (last edit 2025-07-24; Korean, translated)

- Figma setup is done by the Korean design team where possible.
- Project name: `XP_000`; permission "Everyone at Divii can view" (developers/TCW view-only).
- File name: `Project name_000` (rename if project name changes). File types:
  - `Project name_Wireframe`, `Project name_Design`, `Project name_Admin`, `Project name_Client share`, `Project name_by the client`, `Project name_Feature list`
- Design file pages: `1. Design` (final design only, empty during project), `• Design Work (Ko)` / `(In)`, `• Phase1 Design Work (Ko)`, `2. Reference`, `3. Components` (do not edit/delete arbitrarily — changes propagate), `4. E-mail` (only if needed), `5. Prototype` (only if needed).
- Client Share page name: **`YYYY.MM.DD 간단한설명`** (date + short description); newest date at top.
- Libraries: Divii Design System (grid, login, signup formats), Divii Guide (grey colour set), ★Heroicons / ★Heroicons V2 (main icons; Iconscout if needed). Do not publish project libraries.

---

## Date format
Source: https://app.notion.com/p/c9e5a7fdd2f541a1a6bf127e3e92cc27 (title "WM | Development - Date format Manual", last edit 2023-01-20)

- **Korean date format:** `YYYY년 MM월 DD일` — but no leading zero:
  - `2021년 5월 7일` (Correct)
  - `2021년 4월 19일` (Correct)
  - `2021년 05월 07일` (Wrong - 0 should not be used as prefix)
- **Korean time format:** "The "오전" and "오후" will be before the number" (e.g. 오후 3:00 — position rule only; exact time pattern shown only in a screenshot).
- **English date format:** `May 1, 2016` OR `YYYY-MM-DD`
- **English time format:** "The "AM" and "PM" will be after the number. (Most acceptable format)"
- GAP: no exact hour/minute pattern given in text (screenshots only).

---

## Three digit comma rule
Source: https://app.notion.com/p/3ba0ef434e254bb4a20d10cb17f57655 (title "Three digit coma rule for number formatting", last edit 2023-04-17)

- Decimal point between integer and fraction; **"a comma between every three digits"** — "IT SHOULD BE FOLLOWED IN ANY CASE."
- Examples:
  - `100000 → 100,000`
  - `2000000 → 2,000,000`
  - `50000000 → 50,000,000`
  - `12345 + 1/2 → 12,345.5`
- KRW (원): no decimal point by default (unless informed from the start). Examples: `9,900원`, `182,000,000원`, `123,456,789원`.

---

## Error Message List
Source: https://app.notion.com/p/f0a07346bd2349e28bc76abe2fe135ac (title "WM | Error Message List (working on it)", last edit 2022-05-03)

- Objective: a template of error messages per scenario on login / personal-info management pages, applied to every new project.
- Table columns: `Page | Scenario | EN | KO`
- Only row: `Login | When ID does not match | (empty) | (empty)`
- **GAP: the page is unfinished — NO standard error message texts are defined (EN and KO cells are empty).** Do not cite any WM-standard error string; take texts from the project spec.

---

## Password Format
Source: https://app.notion.com/p/6b6da9b04c134821b0d7d5e2ee3ad7d3 (last edit 2021-07-29)

- **"Use 8 or more characters with a mix of letters, numbers & symbols"**
- "Please follow this for all projects until there is special request from the client for password validation."

---

## QA Template
Source: https://app.notion.com/p/89e8efe5cbf746a29882ae011be5446e (last edit 2023-01-04)

- Toggle sections (all EMPTY except image upload): QA template for Login, Signup, User verification using phone, login using SNS, push notification, uploading images, uploading videos, chat window and soon.
- **GAP: the page defines NO column/field layout and NO example row** (the image-upload section contains only a screenshot plus the list below).
- Image-upload test scenarios (verbatim):
  - "Verify that by uploading image with valid file size ,file type and image size. (As per requirement _Positive Scenario)."
  - "Verify that by uploading image with invalid file size (more than required file size)."
  - "Verify that by uploading image with invalid file type (other than required file type)."
  - "Verify that by uploading image with invalid image size (other than required image size)."
  - "Verify that by without uploading image (If field is mandatory)."
- Pattern to reuse: test cases phrased "Verify that ..." covering one positive scenario then each invalid/missing-input case.

---

## QA Process
Source: https://app.notion.com/p/bab0d0977e6c4c48943c1c6476dd6e95 (title "Work Manual for QA Process", last edit 2023-02-15)

1. Developer → share the build as per the QA plan **with the detail report**.
2. QA Team → test and report issues with status: **Issue found in QA** / **Need clarification**.
3. Developer → fix issues; change status to **Ready for QA** and **must add a comment**; issues stay assigned to the developer until the new build with fixes is shared.
4. Developer → share build/deliverables with fixes; assign "Ready for QA" issues to QA team (QA won't test them until assigned).
5. QA team → set status to: **Fixed** / **Not an issue** / **Reopen** / **Need clarification**.

Status set: `Issue found in QA`, `Need clarification`, `Ready for QA`, `Fixed`, `Not an issue`, `Reopen`.
Rule: **"Only the QA team or PM can change the status of an issue to Fixed or Not an issue. Developers are not allowed to do so."**

---

## Report
Source: https://app.notion.com/p/09990cac269f41ccabd31deb069512bf (last edit 2022-05-09; one alias block not fetched)

- Report = progress, process or results of technical research; may include recommendations and conclusions; clear and well-structured.
- Must be: accurate and specific, well organized, grammatically correct, verified information and valid proofs, clear, free from errors and duplication.
- **Structure sections (in order):**
  1. Title
  2. Introduction
  3. Summary
  4. Content
  5. References link
  6. Findings
  7. Conclusions
- Created in Notion under "1. Projects > Project Operation > RP | Report Master" via "New". "DO NOT MODIFY OR EDIT ANY PROPERTY ELEMENT WITHOUT PRIOR APPROVAL FROM THE PROJECT MANAGER."
- "Make sure that the report should be clear, concise, and complete."

---

## Build sharing plan
Source: https://app.notion.com/p/cb95b97f449e417995c449e08aba4f1f (last edit 2022-11-04)

- From 2022-11-04: builds shared **by 2 PM IST**; "No build will be shared after this time."
- 3 servers per project: **Development server** (Indian team, internal QA — build can be shared any time), **UAT server**, **Live server** (Korean team & clients — builds by 2:00 PM IST).
- If the Korean team needs a build after 2:00 PM IST they inform the Indian team; shared "at their own risk".
- Server team sets up the 3 servers.
