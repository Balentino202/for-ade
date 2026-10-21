# `model/frontend/` — client-only DTOs

Types the frontend composes, derives, or persists internally. **They never travel over an HTTP wire**, so they don't belong in `request/` or `response/`.

Use this folder for:

- **Aggregated / derived shapes** that stitch together multiple response DTOs into one UI-shaped object (e.g. a "loan-with-guarantors" merged read).
- **Draft / staging shapes** used while a form is being edited but before it hits the API (multi-step wizard state, tranche plan builder).
- **localStorage-persisted structures** (saved views, recently-viewed rows, tag maps, session logs).
- **UI-only enums / union types** that describe FE state (view mode, bucket kind, tab id).
- **Generic wrappers** shared across domains (`PagedResult<T>`, `AsyncStatus`).

Do NOT put here:

- Anything with the shape `{ responseCode, responseMessage, data }` — that's a `response/` DTO.
- Form types inferred from a Zod schema — those already live in `model/validation/`.
- Types that mirror a backend endpoint's payload — keep those in `request/` / `response/`.

## Naming

One file per concept, `kebab-case.ts`, no `.frontend.` suffix — the folder scopes it. Barrel exports through `index.ts` when the folder grows past a few files. The exported types stay PascalCase (`PagedResult<T>`, `SortState`, …) — only the file name is kebab-case.

## Example

`paged-result.ts` — generic wrapper used when a screen merges paginated
data from several endpoints into a single list. Not a backend shape,
so it doesn't belong in `response/`.
