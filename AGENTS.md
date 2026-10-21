# Agent working guide

You are working inside a Softgem React + Vite frontend spawned from `softgem_react_vite_template`. Read this file end-to-end before touching code.

> **This project ("A Day With You on My Mind") is a static, backend-free site.**
> The template's API / auth / forms layers (axios, TanStack Query, Redux,
> React Hook Form, Zod, modal + sheet providers) were removed because nothing
> here talks to a server. The MVVM split still applies: every stateful
> scene is a folder-per-unit triad under `src/components/scenes/`, and
> ViewModels read copy from `src/data.ts` (the single personalisation file)
> so Views stay pure JSX. Rules below about services, forms, modals and API
> envelopes apply only if those layers are reintroduced.

## Non-negotiable conventions

1. **MVVM.** Every stateful surface is a folder-per-unit triad: `XxxForm/{index.ts, XxxForm.tsx, useXxxFormViewModel.tsx}`. Views are pure JSX. See `MVVM.md`.
2. **Layered Model.** HTTP calls live in `src/service/<domain>.service.ts`. TanStack Query hooks in `src/hooks/queries/*` wrap the services. **Query hooks do NOT call `api` directly.** Views + ViewModels only touch the hooks.
3. **Views do not import Model.** `@/service/*`, `@/hooks/queries/*`, `@/lib/api`, `@/store`, `react-hook-form`, `@tanstack/react-query` are ViewModel-only imports.
4. **No inline `<input>` / `<textarea>` / `<select>` in forms.** Every form control comes from `@/components/form-fields/*` (`InputField`, `TextareaField`, and siblings). If you need a new field type, add it there first and re-export from the barrel.
5. **No inline `<button type="submit">` in forms.** Use `<SubmitButton>` from `@/components/forms`. Cancel / secondary actions use shadcn's `<Button>` from `@/components/ui/button`.
6. **No inline `<Dialog>` or `<Sheet>` in views.** Modals + sheets are single-mount at the app root. Open them by dispatching `modal.mutation.open({ modalType, metadata })` or `sheet.mutation.setOpen({ component, metadata })`. Register new ones in `constants/ModalConstant.ts` / `constants/SheetConstant.ts` and add a `case` to the provider.
7. **Every API response uses the `{ responseCode, responseMessage }` envelope.** Surface via `toastCheckerResponse(res, label)` — it handles `00` / `0M` / error uniformly.
8. **Scrub nulls at the form boundary.** Wrap API data with `nullsToEmpty(data)` before passing to `defaultValues`. Skipping this reintroduces the "Expected string, received null" bug.

## Directory map

```
src/
├── assets/style/index.css       # Tailwind v4 + brand theme
├── config/app.config.ts          # Read Vite env, expose typed config
├── lib/
│   ├── api.ts                    # shared axios client + session-expiry hook
│   ├── checker-response.ts       # toastCheckerResponse helper
│   ├── local-store.ts            # createLocalStore<T>() — typed, cross-tab-synced state
│   └── utils.ts                  # cn, nullsToEmpty, toastError, toastResponse
├── service/
│   └── <domain>.service.ts       # plain async functions — the ONLY HTTP callers
├── store/
│   ├── index.ts                  # configureStore
│   ├── hooks.ts                  # typed useAppDispatch/useAppSelector
│   └── module/auth.ts            # example slice
├── router/
│   ├── index.tsx                 # createBrowserRouter
│   └── routes/main.route.ts      # add new routes here
├── model/
│   ├── request/<domain>/…        # outgoing DTOs
│   ├── response/<domain>/…       # incoming DTOs
│   ├── validation/<domain>/…     # Zod schemas + inferred types
│   └── frontend/…                # client-only DTOs (aggregated, draft, localStorage, generic)
├── hooks/
│   ├── queries/                  # TanStack Query hooks — one file per domain
│   └── use-mobile.tsx            # small shared hooks
├── constants/
│   ├── modal-constant.ts         # enum of every modal in the app
│   ├── sheet-constant.ts         # enum of every sheet in the app
│   └── route-constant.ts         # typed route paths
├── components/
│   ├── forms/<name>/             # folder-per-unit MVVM triads
│   │   ├── index.ts
│   │   ├── <name>.tsx            # pure View
│   │   └── use-<name>-view-model.tsx
│   ├── form-fields/              # RHF-integrated field wrappers
│   ├── modals/                   # centered dialog contents (no wrapper)
│   ├── sheets/                   # side-sheet contents (no wrapper)
│   ├── providers/                # modal-provider, sheet-provider (single-mount)
│   ├── route-guards/             # protected-route, public-only-route
│   ├── layout/                   # dashboard-layout, app-sidebar, nav-config
│   └── ui/                       # shadcn primitives (Button, Input, Label, Textarea, Dialog, Sheet, Select, Popover, DropdownMenu, Tabs)
└── view/
    └── <screen>-view.tsx         # screen-level composition
```

## When adding a new screen

1. **Backend contract first.** Define request DTOs in `model/request/<domain>/`, response DTOs in `model/response/<domain>/`, and a Zod schema in `model/validation/<domain>/`.
2. **Write the service.** `service/<domain>.service.ts` exposes one plain async function per endpoint. This is the only file that talks to `@/lib/api`.
3. **Wrap with query hooks.** `hooks/queries/use-<domain>.ts` composes TanStack Query around the service — `useXxx()` for reads, `useCreateXxx()` / `useUpdateXxx()` for mutations, plus a `xxxKeys` object.
4. **Build the folder-per-unit form(s).** ViewModel first (owns `useForm`, calls the query hooks), then a pure View that consumes it.
5. **Compose the screen view.** `src/view/<Name>View.tsx` mounts your forms + list queries.
6. **Register the route.** Add a row to `router/routes/main.route.ts`.

## When fixing a bug

- **"Expected string, received null":** confirm the incoming API data holds `null`. Wrap with `nullsToEmpty()` at the boundary. Ideally also fix the response DTO type to reflect the actual nullability.
- **ComboBox not preselecting:** the option value type is probably `number` while the form value is `string` (or vice versa). Coerce with `Number()` or `String()` at the form boundary.
- **Toast fires twice on maker-checker actions:** you're calling `toastResponse` after `toastCheckerResponse`. Pick one; the checker helper is authoritative.
- **Row click fires when clicking the row action button:** the action cell needs `onClick={(e) => e.stopPropagation()}` on its wrapper. The parent table's cell-click guard should check `event.colDef.field === "actions"`.

## Coding style

- **File names are `kebab-case.ts` / `kebab-case.tsx`.** Directories too. **Exported identifiers stay PascalCase** — types (`PagedResult`), components (`ExampleForm`), enums (`ModalConstant`) never change. Only the file on disk changes: `ExampleForm.tsx` → `example-form.tsx`, `useExampleFormViewModel.tsx` → `use-example-form-view-model.tsx`, `ModalConstant.ts` → `modal-constant.ts`.
- TypeScript strict everywhere. No `any`; prefer `unknown` at boundaries.
- Prefer named exports for hooks + utilities; default export for View files (folder-per-unit consumes the default).
- Keep View files under ~250 lines. If it's growing, split off a subcomponent (with its own MVVM triad if it has state).
- No emojis in code unless the user explicitly requests them.
- Comments explain *why*, not *what*. Well-named identifiers self-document.

## When you're unsure

Read `MVVM.md`. If the answer isn't there and the pattern is worth codifying, update `MVVM.md` in the same PR as the code.
