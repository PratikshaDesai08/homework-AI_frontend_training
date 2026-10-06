# HW1 walkthrough: the Student List screen, explained from zero

This guide is for explaining your own code to a reviewer, written for someone new to React and Next.js. Read it once from top to bottom with the code open next to it. Each section ends with **"Say it like this"**: one or two sentences you can use in the review.

You already know backend development, so every new idea is compared to something you know.

---

## 1. The 30-second explanation

> "It's a Next.js page at `/students/list` that shows a table of students. It's built from small React components: a heading, a filter bar, a table, and blocks for loading, empty and error. The page keeps two pieces of state, the current filters and the current page. Whenever they change, React re-runs the component, filters the mock data again and redraws the table. Styling is SCSS, and every colour and size comes from one variables file, following the WM rules. Playwright tests check the behaviour and check that nothing scrolls sideways at the 10 WM screen widths."

If you can say that and then answer "how?" for each part, you pass the "explain your code" check. The rest of this guide is the "how".

---

## 2. Four ideas you need first

| Idea | What it means | Backend comparison | Where to see it |
|---|---|---|---|
| **Component** | A function that returns what to show on screen (JSX, which looks like HTML) | A function or class that renders a view | Every file in `src/components/` |
| **Props** | The inputs you pass to a component. Read-only: the component can't change them | Function parameters | `<PageHeading title="Students" />`: `title` is a prop |
| **State** | Data the component remembers. **When state changes, React runs the component function again and redraws the screen** | An in-memory variable that triggers a re-render when it changes | `useState` in `StudentListScreen.tsx` |
| **Hook** | A built-in React function whose name starts with `use…` (`useState`, `useMemo`). Only call it at the top of a component | An injected helper | Lines 32–42 of `StudentListScreen.tsx` |

The one sentence that explains most of React:

> **The screen is a function of the data. You don't change the screen yourself; you change the state, and React redraws.**

On the backend, you build a response from data. Here it's the same, except React builds it again automatically every time the state changes.

---

## 3. What happens when someone opens the page

Follow this path with the files open:

```
Browser opens  http://localhost:3000/
   │
   ▼
src/app/page.tsx  ──  redirect("/students/list")        (like a 307 redirect in a controller)
   │
   ▼
src/app/layout.tsx  ── the outer shell for EVERY page: <html>, <body>, font, global styles
   │
   ▼
src/app/(main)/layout.tsx  ── shell for the app pages: <AppHeader/> (top bar) + <main>
   │
   ▼
src/app/(main)/students/list/page.tsx  ── the page for this URL. It only renders:
   │        <Suspense><StudentListScreen /></Suspense>
   ▼
src/components/students/StudentListScreen.tsx  ── the real screen: state, filtering, layout
   │
   ├── <PageHeading>        "Students" title + "Add student" button
   ├── <StudentFilters>     search box + course and status dropdowns
   └── <AppDataTable>       the table (or the skeleton while loading, or an empty block)
          ├── <StudentNameCell>   avatar + name + email in each row
          └── <StudentStatusTag>  the coloured Active / Inactive / Graduated pill
```

**Say it like this:** "In Next.js the folder is the URL: `src/app/(main)/students/list/page.tsx` is `/students/list`. The layouts wrap it with the header. The page renders `StudentListScreen`, which holds the state and builds the screen from smaller components."

---

## 4. Next.js ideas used in this project

### Folder = URL (App Router)
`src/app/(main)/students/list/page.tsx` → `/students/list`. The file must be called `page.tsx`. That's like a route in a controller, decided by the folder path.

### Route group `(main)`
A folder name in brackets **doesn't appear in the URL**. `(main)` only exists to group pages that share `src/app/(main)/layout.tsx`, which adds the top bar. The URL is `/students/list`, not `/main/students/list`.

### Layouts
`layout.tsx` wraps every page under its folder, so you don't repeat the header on every page.
- `src/app/layout.tsx` (root): `<html>`, `<body>`, the Public Sans font, the PrimeReact theme and `globals.scss`.
- `src/app/(main)/layout.tsx`: `<AppHeader />` + `<main className="main-content">`.

### Server vs client components: `"use client"`
By default, Next.js components run **on the server** and send HTML. A component that uses **state, effects or click handlers** must run in the browser, so it starts with `"use client"`.

| File | `"use client"`? | Why |
|---|---|---|
| `StudentListScreen.tsx` | **Yes** | It uses `useState`, `useMemo`, `useRouter`, `useSearchParams` and `onClick` |
| `StudentFilters.tsx` | **Yes** | It has `onChange` handlers on the inputs |
| `AppDataTable.tsx` | **Yes** | PrimeReact DataTable handles clicks (paging) |
| `PageHeading`, `StateBlock`, `StudentNameCell`, `StudentStatusTag`, `TableSkeleton`, `AppHeader` | No | They only show props, with no state or handlers |
| `page.tsx`, `layout.tsx` | No | Server: they just compose other components |

A component without `"use client"` that's **imported by** a client component also runs in the browser. That's fine: it simply doesn't need state of its own.

### Why `<Suspense>` in `page.tsx`
`StudentListScreen` reads `?state=…` from the URL with `useSearchParams()`. When Next.js builds the page ahead of time, it doesn't know the URL yet. `<Suspense>` tells it "this part waits for the URL". Without it, `npm run build` fails.

### `metadata`
`export const metadata = { title: "Students | Student Admin" }` in `page.tsx` sets the browser tab title. The Playwright test checks it.

**Say it like this:** "`page.tsx` is a server component that only sets the title and renders the screen. The screen is a client component because it uses state and event handlers, so it has `"use client"`. Suspense is needed because the screen reads the URL's query string."

---

## 5. The main file: `StudentListScreen.tsx`, line by line

This is the file a reviewer is most likely to ask about.

### Lines 17–18: constants
```ts
const ROWS_PER_PAGE = 10;
const EMPTY_FILTERS: StudentListFilters = { search: "", course: null, status: null };
```
These live outside the component, so they're created once and never change. `EMPTY_FILTERS` is the "nothing filtered" value, used at the start and by "Clear filters".

### Lines 24–28: the demo switch (HW1 only)
```ts
function readDemoState(value: string | null): DemoState {
  return value === "loading" || value === "empty" || value === "error" ? value : "filled";
}
```
HW1 has no API, so loading, empty and error can't happen naturally. This reads `?state=` from the URL so you can show each state on purpose: `/students/list?state=loading`. Anything else means "filled". **In HW2 this is replaced by the API hook**, which tells us loading, error and data for real.

### Lines 32–33: reading the URL
```ts
const router = useRouter();                                       // to change the URL (Try again)
const demoState = readDemoState(useSearchParams().get("state")); // "loading" | "empty" | "error" | "filled"
```

### Lines 36–37: the only two pieces of state
```ts
const [filters, setFilters] = useState<StudentListFilters>(EMPTY_FILTERS);
const [first, setFirst] = useState(0);
```
- `useState(initialValue)` gives back **two things**: the current value and a function to change it.
- `filters` = what the user typed or picked: `{ search, course, status }`.
- `first` = index of the first row on the current page (0 = page 1, 10 = page 2, 20 = page 3). PrimeReact's table counts pages this way.
- **Never** change state directly (`filters.search = "x"` is wrong). Always call `setFilters(...)`. That call is what tells React to redraw.

### Line 39: a value worked out from state (not state itself)
```ts
const hasFilters = filters.search.trim() !== "" || filters.course !== null || filters.status !== null;
```
This is **derived**: it can always be computed from `filters`, so it's a plain variable, not state. Rule: **if you can compute it, don't store it.**

### Lines 42–53: filtering with `useMemo`
```ts
const visibleStudents = useMemo(() => {
  const allStudents = demoState === "empty" ? [] : MOCK_STUDENTS;
  const term = filters.search.trim().toLowerCase();
  return allStudents.filter((student) => /* name/email contains term AND course matches AND status matches */);
}, [demoState, filters]);
```
- This is like a `WHERE` clause run in memory: `WHERE (name LIKE term OR email LIKE term) AND course = ? AND status = ?`. A `null` filter means "any".
- `useMemo(fn, [deps])` means "only re-run `fn` when something in `[deps]` changes, otherwise reuse the last result". It's a small cache keyed on `demoState` and `filters`.
- The deps array must list everything used inside. If it missed `filters`, typing in the search box wouldn't update the table. The linter checks this.
- In HW2 this filtering moves to the backend (`GET /students?search=…&course=…`). The screen will just show what the API returns.

### Lines 56–61: event handlers
```ts
const handleFilterChange = (changed: Partial<StudentListFilters>) => {
  setFilters((current) => ({ ...current, ...changed }));  // merge only the changed field
  setFirst(0);                                             // back to page 1
};
const clearFilters = () => handleFilterChange(EMPTY_FILTERS);
```
- `Partial<StudentListFilters>` means "some of the fields" (only the one that changed, e.g. `{ search: "meera" }`).
- `{ ...current, ...changed }` copies the old filters, then overwrites the changed field. Like `Object.assign({}, current, changed)`.
- We reset to page 1 because if you're on page 3 and filter down to 2 results, page 3 would be empty.

### Lines 64–78: choosing the empty-state text
If there are filters → "No students found" + **Clear filters**. If there are no filters and still no data → "No students yet" + **Add student**. This is design question Q4.

### Lines 80–156: the JSX (what's shown)
```tsx
<PageHeading title="Students" subtitle="…" actions={<Button label="Add student" … />} />
<section className="student-list-card">
  <StudentFilters filters={filters} onChange={handleFilterChange} />
  {demoState === "error" ? <StateBlock variant="error" … /> : <AppDataTable … > …columns… </AppDataTable>}
</section>
```
- `{ … }` inside JSX means "put a JavaScript value here".
- `condition ? A : B` is **conditional rendering**: show the error block or the table.
- `<Column header="Status" body={(student) => <StudentStatusTag status={student.status} />} />`: `body` is a function the table calls **once per row**, with that row's student, to decide what goes in the cell.

**Say it like this:** "The screen has two pieces of state: filters and the current page. The visible rows are derived from them with `useMemo`, which works like an in-memory WHERE clause. When the user types, `handleFilterChange` updates the filters and resets to page 1. React re-runs the component, recomputes the rows and the table redraws."

---

## 6. One action, start to finish: the user types "meera"

1. The user types `m` in the search box (`StudentFilters.tsx`).
2. The `<InputText onChange=…>` fires → `onChange({ search: event.target.value })`.
3. That `onChange` is the **prop** that `StudentListScreen` passed in: `handleFilterChange`. **Child → parent communication works through a function passed down as a prop**, like a callback.
4. `handleFilterChange` calls `setFilters(...)` and `setFirst(0)`.
5. State changed, so React **runs `StudentListScreen()` again**.
6. `useMemo` sees `filters` changed, so it re-filters → only "Meera Joshi" matches.
7. The new `filters` goes back down to `<StudentFilters filters={filters}>`, so the box shows `meera`. The input is **controlled**: its value always comes from state.
8. `visibleStudents` (1 row) goes to `<AppDataTable value={…}>` → the table shows 1 row, "Showing 1–1 of 1 students".

That loop (**event → set state → React re-runs → new props flow down → screen updates**) is the whole of React. Every interaction on this screen follows it.

**Say it like this:** "Data flows down as props, and events flow up through callback props. The filter bar doesn't own the filter values; the parent does, and it passes them down. That's called a controlled component."

---

## 7. The components, one by one

The rule we followed is **"props in, screen out"**: most components are small and have no state of their own. They're easy to reuse and easy to test.

| Component | File | What it shows | Props (inputs) | Own state? |
|---|---|---|---|---|
| `AppHeader` | `components/layout/AppHeader.tsx` | Top bar: "SA Student Admin" + "PP" | none | No |
| `PageHeading` | `components/common/PageHeading.tsx` | Page title, subtitle, buttons on the right | `title`, `subtitle?`, `actions?` | No |
| `StudentFilters` | `components/students/StudentFilters.tsx` | Search + course + status | `filters`, `onChange` | No (the parent owns it) |
| `AppDataTable` | `components/common/AppDataTable.tsx` | The table + pagination, **or** the skeleton when loading, **or** the empty block | `value`, `dataKey`, `loading`, `emptyState`, `first`, `rows`, `onPageChange`, `recordLabel`, `ariaLabel`, `children` (the columns) | No |
| `TableSkeleton` | `components/common/TableSkeleton.tsx` | Grey pulsing placeholder rows | `rows`, `columns`, `label` | No |
| `StateBlock` | `components/common/StateBlock.tsx` | Icon + title + message + button (empty or error) | `variant` ("empty" or "error"), `title`, `message`, `action?` | No |
| `StudentNameCell` | `components/students/StudentNameCell.tsx` | Initials circle + name + email | `name`, `email` | No |
| `StudentStatusTag` | `components/students/StudentStatusTag.tsx` | Coloured pill | `status` | No |

`?` means optional. `PageHeading` without `actions` simply shows no buttons.

**Why the split into `common/` and `students/`?**
- `common/` pieces know nothing about students. `AppDataTable` and `StateBlock` work for orders, books or anything else. The training asked for "reusable components (shared heading, state blocks, table)".
- `students/` pieces are specific to this feature.

**Some details worth knowing:**
- **`AppDataTable` is generic:** `AppDataTable<T>`. `T` is the row type (`Student` here). It's like a generic `Repository<T>` on the backend, so TypeScript checks that `dataKey="id"` really is a field of `Student`.
- **`children`:** whatever you put between `<AppDataTable>` and `</AppDataTable>` (the `<Column>`s) arrives as the `children` prop.
- **Keys:** lists in React need a unique `key` per item so React can tell rows apart. The table uses `dataKey="id"` for that, and `TableSkeleton` uses the index (fine for placeholders that never reorder).
- **`StudentStatusTag`** builds the class name from the status: `student-status-tag-active`. The colour comes from SCSS, not from the component.

**Say it like this:** "Most components are presentational: they only take props and render. All the state sits in one place, `StudentListScreen`, so data flows one way and it's easy to follow."

---

## 8. The four states: how each one is decided

| State | How you see it | What decides it | What's shown |
|---|---|---|---|
| **Loading** | `/students/list?state=loading` | `loading={demoState === "loading"}`. `AppDataTable` returns `<TableSkeleton>` early | 10 grey pulsing rows + "Loading students…" |
| **Error** | `/students/list?state=error` | `demoState === "error" ? <StateBlock variant="error">` | Red icon, "Could not load students", **Try again** (reloads without `?state`) |
| **Empty (no data)** | `/students/list?state=empty` | Data is `[]` and no filters are set. The table shows `emptyMessage` | "No students yet" + **Add student** |
| **Empty (no match)** | Search `zzz` | Data exists but the filter removes everything | "No students found" + **Clear filters** |
| **Filled** | `/students/list` | Default | 10 rows, pagination "Showing 1–10 of 25 students" |

The heading and filters stay visible while loading, so the page doesn't jump when data arrives.

---

## 9. Types (TypeScript): `src/types/student.ts`

```ts
export const STUDENT_STATUSES = ["Active", "Inactive", "Graduated"] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];   // "Active" | "Inactive" | "Graduated"
export interface Student { id: number; name: string; email: string; phone: string | null; course: StudentCourse; status: StudentStatus; enrolledOn: string; feesPaid: number; }
```
- It's like a DTO class. The list of statuses is written **once**, and both the dropdown options and the type come from it, so they can't drift apart.
- **No `any` anywhere**, which the training requires. If a typo like `student.stauts` slips in, `npx tsc --noEmit` fails.
- `phone: string | null` means a phone may be missing, and TypeScript forces us to handle that.

---

## 10. Formatting (WM rules): `src/utils/format.ts`

| Function | Input → output | WM rule |
|---|---|---|
| `formatDate("2026-08-12")` | `Aug 12, 2026` | English date format `May 1, 2016` |
| `formatNumber(105000)` | `105,000` | Three-digit comma rule |
| `formatRupees(105000)` | `₹105,000` | Comma every 3 digits (not Indian `1,05,000`, design question Q7) |
| `getInitials("Aarav Sharma")` | `AS` | (for the avatar) |

The date is parsed as **UTC** on purpose. Otherwise a browser in a timezone behind UTC could show the day before.

---

## 11. Styling: SCSS and the WM rules

### Where styles live
```
src/styles/
  _variables.scss   ← the ONLY place with real colours and sizes (#2453d6, 1rem, 1360px…)
  _functions.scss   ← c("blue-b1") → var(--blue-b1)
  _theme.scss       ← turns the colour lists into CSS variables for light and dark
  _mixins.scss      ← below("md") { … } = "on screens 768px and narrower"
  globals.scss      ← imports everything + base reset
  components/_page-heading.scss, _state-block.scss, …   ← one file per component
  pages/_student-list.scss
```

### The colour system (light and dark)
1. `_variables.scss` has two lists with **the same names**: `$colors-day` (light) and `$colors-night` (dark). For example `"blue-b1": #2453d6` (day) and `"blue-b1": #6d8ff0` (night). WM rule: every light colour has exactly one dark colour with the same name.
2. `_theme.scss` turns them into CSS variables: `--blue-b1`. It uses the day values normally, and the night values when `<html data-theme="dark">`.
3. Components write `color: c("blue-b1");`, which becomes `color: var(--blue-b1);`. **Switching the theme changes one attribute; no component changes.**

### WM naming
- Class names: **lowercase-with-hyphens** (`student-list-card`, never `studentListCard` or `student_list_card`).
- Colour names: **colour + code** (`blue-b1`, `red-r1`, `gray-g7`), never `dark-blue`.
- **No hardcoded colours or numbers** in component styles. Everything is a variable (`$space-4`, `$radius-md`, `$control-height`). We checked this with a search (the `/fe-design-tokens` audit): zero hits.
- Buttons get their size from **padding**, not a fixed width, so longer text never overflows.

### Responsive (all screen sizes)
- `@include below("md") { … }` = `@media (max-width: 768px) { … }`. The names map to the WM widths 1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480 and 375.
- **Phones and small tablets (≤ 768px): every row becomes a card.** The header row is hidden. Each cell sits on its own line with its column name as a label ("Course", "Enrolled on", "Fees paid"). The status pill sits in the top-right corner and the action icons along the bottom. PrimeReact renders those labels because `AppDataTable` sets `responsiveLayout="stack"`. The card look itself is our SCSS (`_app-data-table.scss`, the `below("md")` block).
- **Tablets (769–1024px):** the table needs about 960px, so it gets `min-width: 960px` inside a box with `overflow-x: auto`. The **table** scrolls inside its box, and a small hint says "Swipe the table sideways". **The page itself never scrolls sideways.** That's the WM rule.
- On phones the filters also stack (search on its own row, the two dropdowns share the next one), the "Add student" button wraps under the title, and the pagination wraps onto two lines.

**Say it like this:** "All raw values live in `_variables.scss`. Components only use variables. Colours are CSS variables with a day and a night value of the same name, so dark mode is one switch. On phones each row becomes a card, and on tablets the table scrolls inside its own box, so the page never scrolls sideways."

---

## 12. PrimeReact: the ready-made parts

We didn't build the table, dropdowns or search box from scratch. PrimeReact provides `DataTable`, `Column`, `Dropdown`, `InputText`, `IconField`/`InputIcon` and `Button`. We **restyle** them in SCSS to match the design (`_app-data-table.scss`, `_student-filters.scss`, `_buttons.scss`) and point PrimeReact's font variable at ours.

`AppDataTable` is our wrapper around PrimeReact's DataTable. It adds the loading skeleton, the empty block and the "Showing 1–10 of 25 students" text in one place, so every future list gets them for free.

---

## 13. Tests: how we proved it works

Run with `PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:e2e` while `npm run dev` is running. Playwright opens a real Chrome and clicks like a user.

**`e2e/students-list.spec.ts` (9 tests):**
1. The page opens with the right tab title and heading, and shows 10 rows.
2. WM formats: `Aug 12, 2026`, `₹45,000`, `₹105,000`.
3. Next page shows "Showing 11–20 of 25".
4. Search by name and by email.
5. The status filter shows only "Graduated" and goes back to page 1.
6. No results shows "No students found", and Clear filters brings the 25 back.
7–9. The loading, empty and error states.

**`e2e/responsive.spec.ts` (40 tests):** 4 states × 10 widths. Each one saves a screenshot to `docs/screenshots/` and **fails if the page scrolls sideways** or anything sticks out past the right edge.

**And we looked at the screenshots by eye.** The tests passed while the dropdowns at 375px still showed "All cour…". A test only checks what you told it to check. (This is the "one problem I solved" on your Notion page.)

---

## 14. Practice questions: the reviewer might ask these

Try to answer each one aloud before reading the answer.

1. **What's the difference between props and state?**
   Props come from the parent and are read-only. State belongs to the component and changes over time; changing it re-renders. In our screen, `filters` is **state** in `StudentListScreen` and a **prop** in `StudentFilters`.

2. **Where is the state in your screen?**
   Only in `StudentListScreen`: `filters` (search, course, status) and `first` (which page). Everything else is derived or passed down as props.

3. **Why is `visibleStudents` not state?**
   It can always be computed from `filters` and the data. Storing it would mean keeping two things in sync, which is a common source of bugs.

4. **What does `useMemo` do here? What if you removed it?**
   It caches the filtered list and only recomputes it when `filters` or `demoState` change. Without it the result is the same; it just re-filters on every render. With 25 rows that's harmless, with thousands it would matter.

5. **Why does `StudentListScreen` need `"use client"`?**
   It uses `useState`, `useMemo`, `useSearchParams` and click handlers, which only work in the browser. `PageHeading` doesn't need it because it only shows props.

6. **What is `(main)` in the folder path?**
   A route group. It groups pages that share a layout (the header) without adding `/main` to the URL.

7. **Which file renders `/students/list`?**
   `src/app/(main)/students/list/page.tsx`, which renders `StudentListScreen`.

8. **How does the filter bar tell the page that the user typed something?**
   The page passes a function as the `onChange` prop. The filter bar calls it with `{ search: "…" }`, and the page updates its state. Data goes down, events come up.

9. **Why reset to page 1 when filters change?**
   The current page might not exist any more. Being on page 3 with 2 results would show an empty table.

10. **How do you show loading, empty and error with mock data?**
    The `?state=` query parameter (`readDemoState`). In HW2 the real API hook gives us `isLoading`, `error` and `data` instead.

11. **What is the `key` / `dataKey` for?**
    React needs a stable unique id per row to know which row is which when the list changes. We use the student's `id`.

12. **How do you avoid hardcoded colours?**
    All colours are in `_variables.scss` as WM-named day/night pairs. Components use `c("name")`, which becomes a CSS variable. A grep audit found zero hex colours outside that file.

13. **How did you make sure there's no sideways scroll on phones?**
    At ≤ 768px every row becomes a card, so nothing is wider than the screen. On tablets the table scrolls inside its own `overflow-x: auto` box. The filters and buttons wrap. A Playwright test checks `scrollWidth <= clientWidth` at all 10 WM widths for every state, and I checked the screenshots by eye.

13b. **Why cards on mobile instead of a scrolling table?**
    The first version scrolled the table sideways on phones. You only saw the name and half the course, and status, dates, fees and the action buttons were hidden behind a swipe. Cards show every field at once. The design's mobile frame was updated to match.

14. **Why is the date shown as `Aug 12, 2026` and not `12/08/2026`?**
    The WM date format for English is `May 1, 2016` or `YYYY-MM-DD`. `formatDate` does it in one place.

15. **What would change in HW2?**
    `MOCK_STUDENTS` and the `?state=` switch go away. A `useGetStudentsList` hook (TanStack Query) calls the API through `StudentService`, with search, filter and page sent to the backend, and gives back loading, error and data. The components stay the same, because they only take props.

---

## 15. Try it yourself (10 minutes, best way to really learn it)

Make each change, look at the browser, then undo it with `git checkout .`:

1. Change `ROWS_PER_PAGE` to `5` in `StudentListScreen.tsx` → there are now 5 pages.
2. In `_variables.scss` change `"blue-b1": #2453d6` to a green like `#1d6b3f` → every blue button and the pagination turn green, and no component changes.
3. In `src/app/layout.tsx` change `data-theme="light"` to `data-theme="dark"` → the night colours apply.
4. Remove `filters` from the `useMemo` deps `[demoState, filters]` → run `npm run lint` and watch it warn. Then search: the table no longer updates. That's why the deps matter.
5. Delete `"use client"` from `StudentListScreen.tsx` → the page shows an error saying `useState` only works in Client Components.
6. Open `/students/list?state=loading`, `?state=empty` and `?state=error` and connect each one to section 8.

If you can predict what happens **before** you look, you understand the code.
