---
name: fe-api-hook
description: Connect a screen to a real API using the 3-layer pattern (API_ENDPOINTS → <Domain>Service with axios → TanStack Query hook). Use for training Step 3/4 (Homework 2) when replacing mock data, adding create/edit/delete calls, or when the user says "connect the API".
---

# fe-api-hook: endpoint → service → hook

Requires a **real response**. Ask the user for one actual JSON response per endpoint (from curl or Swagger "Try it out"). Don't work from a schema description. Save each one to `docs/api-samples/<endpoint>.json`.

## Layers (never call axios inside a component)
1. `src/utils/api-integration.ts`: add the paths to `API_ENDPOINTS` and the query keys to `QUERIES`.
2. `src/api-services/<Domain>Service.ts`: one axios method per endpoint, typed request and response (no `any`). Use the shared axios instance with `baseURL = process.env.NEXT_PUBLIC_API_BASE_URL`. Check how many times the response is wrapped, so you never read `data.data.data`.
3. `src/hooks/API/<domain>/`:
   - `useGet<Domain>List({ search, filters, page, pageSize })`: `useQuery`, with every param in the query key
   - `useGet<Domain>Details(id)`
   - `useCreate<Domain>`, `useUpdate<Domain>`, `useDelete<Domain>`: `useMutation`. `onSuccess` invalidates the list and details keys so the list refreshes by itself.

## Screen rules
- 4 states: **loading**, **has data**, **empty**, **error**. The error state shows the API's `message`, not a generic string.
- Search, filter and page go through the hook (keep them in URL search params so a refresh keeps them).
- Forms (create/edit) mirror the backend DTO rules **exactly** (required, max length, format, enum). Show the rules side by side with the DTO file before coding.
  - Disable submit while pending (no double submit).
  - On success: toast, invalidate the list, go back to the list.
  - On API error: show the server's field/general messages and keep what the user typed.
  - Edit mode pre-fills from the details hook.
- Dates use WM English format (`May 1, 2016` or `YYYY-MM-DD`, with AM/PM after the time). Numbers get a comma every three digits. Put these formatters in `src/utils/format.ts` and reuse them.
- WM has no standard error texts yet (see wm-contract "Error Message List" GAP), so use the backend's messages.

## Verify
`npx tsc --noEmit` and `npm run lint` (real output). Then check by hand: stop the backend → the error state shows; filter to nothing → the empty state shows; throttle the network → the loading state shows.
