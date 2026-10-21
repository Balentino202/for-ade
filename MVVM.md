# MVVM convention

Every Softgem React frontend follows this MVVM split. **This doc is the single source of truth** for how the layers are organised. Do not deviate without updating the doc first.

## The three layers

### Model
The data + domain layer. **Already provided by the template** — you don't build a new one, you add to it.

- `src/service/<domain>.service.ts` — plain async functions that make the HTTP call. One file per domain. Every network call for the domain lives here, and nowhere else.
- `src/hooks/queries/*` — TanStack Query hooks (caching, invalidation, retries). Wraps the service. **Does not talk HTTP directly.**
- `src/store/module/*` — Redux slices (client/UI state — reserved for cross-cutting concerns like auth)
- `src/lib/api.ts` — the shared axios client used by services
- `src/model/request/*` — outgoing DTOs (backend request payloads)
- `src/model/response/*` — incoming DTOs (backend response payloads)
- `src/model/validation/*` — Zod schemas + inferred form types
- `src/model/frontend/*` — client-only DTOs (aggregated shapes, drafts, localStorage structs, generic wrappers). See `model/frontend/README.md`.

The data-flow through the layers is strict:

```
View → ViewModel → hooks/queries → service → lib/api → server
```

Each layer imports only from the layer directly below it. Views never see `service` or `api`. Query hooks never call `api` directly. Services never call TanStack Query. If a rule is violated, refactor first, ship second.

**Rule: the View never imports the Model layer directly.** Only a ViewModel may.

### ViewModel
A hook, one per View or stateful sub-component, named `useXxxViewModel`, co-located inside the View's folder.

It owns everything that is **not JSX**:

- `useForm` + Zod resolver
- `useQuery` / `useMutation` calls (via `hooks/queries`)
- `useAppSelector` / `useAppDispatch`
- `useParams`, `useNavigate`, `useSearchParams`
- derived state (`useMemo`)
- handlers (`onSubmit`, `onCancel`, row-click, filter-set, etc.)
- effects (`useEffect`)

The hook returns a plain object — the ViewModel's contract — that the View destructures.

### View
A `.tsx` file that:

- imports only its `useXxxViewModel` and pure-render primitives (shadcn UI, form-field wrappers, icons)
- calls `const vm = useXxxViewModel()` at the top of the component
- reads `vm.form`, `vm.onSubmit`, `vm.isSubmitting`, etc. and renders

**Never** import from `@/hooks/queries`, `@/lib/api`, `@/store`, `react-hook-form`, or `@tanstack/react-query` inside a View file. If you find yourself reaching for one, move that logic into the ViewModel.

## Folder-per-unit layout

Each stateful surface is a folder, not a file:

```
src/components/forms/ExampleForm/
├── index.ts                        // barrel — default export is the View
├── ExampleForm.tsx                 // View: pure JSX
└── useExampleFormViewModel.tsx     // ViewModel: state + handlers
```

The barrel `index.ts` re-exports the View as default. Consumers write:

```ts
import ExampleForm from "@/components/forms/ExampleForm";
```

They never see the ViewModel unless they explicitly need its types.

## Form fields

**Views never render raw `<input>` / `<textarea>` / `<select>`.** All form controls go through wrappers in `src/components/form-fields/*`:

- `InputField` — text / email / number / password
- `TextareaField` — multi-line text
- Add new field types (`SelectField`, `DateField`, `ComboBoxField`, `PhoneInputField`, …) as sibling files and re-export them from `form-fields/index.ts`

Each field wrapper:

- takes `form` + `name` and wires `react-hook-form` via `Controller` (never `register` — Controller keeps `null`/`undefined` values from breaking React's controlled contract)
- coerces `field.value ?? ""` so API `null` values never surface as controlled↔uncontrolled warnings
- renders its own label, description, and error message consistently
- is dependency-free by default so the template compiles; swap the raw HTML for shadcn primitives once you `npx shadcn add input label form`

**Rule: if a form file imports `react-hook-form` for anything other than the `useForm<Def>()` inside its ViewModel, that's a smell.** The `Controller`, `register`, `watch`, `setValue` calls belong inside a field wrapper or the ViewModel — never in a View.

### Submit button

Forms never render `<button type="submit">` inline. Use `<SubmitButton>` from `@/components/forms`. It:

- forwards to shadcn's `<Button>` (so `variant` / `size` props behave normally)
- disables itself while `isLoading`
- shows a spinner + configurable `loadingLabel` during flight

If a form needs a Cancel or secondary action, use plain `<Button>` from `@/components/ui/button` for those — but the submit affordance is always `<SubmitButton>`.

## Screen-level views

Screen-level views live in `src/view/*` (singular — matches Finlake convention). They compose reusable components. A screen view MAY own its own list-query directly (e.g. `useExamples()`), but any form / stateful child it renders should already be wrapped in the MVVM triad above.

## Query-key convention

TanStack Query keys are structured `[<domain>, <collection|resource>, <params?>]`. Every query hook exports a `xxxKeys` object with `all`, `lists`, `list(params)`, `detail(id)`. See `hooks/queries/use-examples.ts` for the reference.

## Naming

- Query hooks: `useXxx()`, `useXxxs()`, `useCreateXxx()`, `useUpdateXxx()`, `useDeleteXxx()`
- Mutations always return the response object; the caller handles the toast via `toastCheckerResponse()`
- ViewModel hooks: `useXxxFormViewModel`, `useXxxTableViewModel`, `useXxxSheetViewModel`
- Zod schemas: `CreateXxxFormSchema` + `type CreateXxxDef = z.infer<...>`
- Redux slices: default export is a plain object `{ reducer, mutation }` — never named exports of individual actions

## Modals and sheets

Both are **single-mount** at the app root via `ModalProvider` / `SheetProvider`. Nothing else in the app renders `<Dialog>` or `<Sheet>` directly.

- **Modals** — centered, blocking. For short confirms, spinners, quick create flows. Registry: `constants/ModalConstant.ts`.
- **Sheets** — slide-in side panels. For detail views, drill-downs, long forms. Registry: `constants/SheetConstant.ts`.

### Opening

```ts
// Modal
dispatch(
  modal.mutation.open({
    modalType: ModalConstant.exampleModal,
    metadata: { /* arbitrary payload the component reads */ },
    disableCloseOnBlur: false,
  })
);

// Sheet
dispatch(
  sheet.mutation.setOpen({
    component: SheetConstant.exampleDetailSheet,
    metadata: { id: 42 },
  })
);
```

### Closing

```ts
dispatch(modal.mutation.close());
dispatch(sheet.mutation.onClose());
```

### Authoring a modal or sheet

Individual components live in `components/modals/*` or `components/sheets/*`. They:

- do NOT wrap themselves in `<Dialog>` / `<Sheet>` — the provider owns that
- start with `<DialogHeader>` / `<SheetHeader>` for title + description
- read their inputs from `useAppSelector((s) => s.modal.modalOptions.metadata)` (or the sheet equivalent)
- dispatch `modal.mutation.close()` / `sheet.mutation.onClose()` themselves when their business is done

### Adding a new modal or sheet

1. Add the enum value to `constants/ModalConstant.ts` (or `SheetConstant.ts`).
2. Create the component under `components/modals/` (or `components/sheets/`) and export it from the barrel.
3. Add the `case` in `providers/ModalProvider.tsx` (or `SheetProvider.tsx`).
4. Trigger it from anywhere via `dispatch(modal.mutation.open({ … }))`.

## Common gotchas (and their template-provided fixes)

- **"Expected string, received null"** on Zod re-validation when a sibling field holds `null` from the API → wrap incoming API data with `nullsToEmpty(data)` before passing to `defaultValues`. Helper lives in `lib/utils.ts`.
- **Controlled ↔ uncontrolled** input warning → the shared `InputField` (once added via shadcn) should coerce `field.value ?? ""` internally. Any custom input follows the same pattern.
- **String-vs-number ID mismatch** in ComboBoxes → the API sometimes stringifies numeric IDs. Coerce with `Number(id)` at the form boundary so the option's strict-equal match works.
- **Maker-checker responses** → always surface via `toastCheckerResponse(res, "Xxx created")` — never a bare `toast.success`. It handles `00` (applied), `0M` (queued), and error paths uniformly.

## Migration rule of thumb

When touching an existing component that lives as a single `.tsx` file with `useForm` / `useQuery` inline:

1. Create the folder-per-unit layout.
2. Move all state + handlers into a new `useXxxViewModel.tsx`.
3. Reduce the `.tsx` to a pure `const vm = useXxxViewModel(); return <JSX>`.
4. Add the barrel `index.ts`.
5. Delete the old file only after the folder is verified working.

New components are always built to this shape from day one.
