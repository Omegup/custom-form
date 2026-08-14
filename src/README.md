# Source layout

```
src/
├── main.tsx                 Legacy Vite entry (points to Storybook)
├── form/                    View layer (read-only form rendering)
├── response/                Form response values + viewer validate/update contract
├── recursive-form/          Tree types with meta
├── move-actions/            Generic move/clone/remove actions
├── drag-drop-tree/          School drag-drop-tree port (ops + headless React; HTML in demo/)
├── form-edit/               Edit orchestration (flat state + section/item actions)
├── form-item-editor/        Single-item edit dialog factory
├── side-menu/               Library catalog (Side + AddFormItem slots)
├── section-edit/            Section edit types + flat save
├── section-view/            SectionHOC + ColumnsEdit (section list rendering, no DnD)
├── flat-dnd/                SectionNodes ↔ drag-drop-tree (lib); demo wires headless DnD + HTML
├── form-dialogs/            Dialog orchestrator (makeUseDialogs)
├── section-responder/       Section fill shell (SectionResponderHOC)
├── form-responder/          Multi-section fill shell (CustomFormResponderHOC)
├── section-review/          Section review shell (SectionReviewHOC)
├── form-review/             Multi-section review shell (CustomFormReviewHOC)
└── form-response/           FormResponse document + Send / Save / feedback
```

Each module owns its **Storybook story** (`*.stories.tsx` with args/controls) and a **playground component** (`*Playground.tsx`). Vitest tests live in `*.test.ts`.

## Dependency graph

```
form ◀── response (types only; form owns getUseImpRefViewProps)
form / recursive-form / form-edit / response ──▶ section-responder ──▶ form-responder
form / recursive-form / form-edit / response ──▶ section-review ──▶ form-review
section-review / form-edit / recursive-form / response ──▶ form-response
form ─────────────────────────────────────────┐
recursive-form ───────────────────────────────┤
move-actions ─────────────────────────────────┤
                                              ▼
                                         form-edit
                        ┌───────────────┬──────┴────────┬───────────────┐
                        ▼               ▼               ▼               ▼
                form-item-editor   side-menu      section-edit    section-view
                        │               │               │
                        └───────────────┴───────────────┘
                                        │
                                  form-dialogs

drag-drop-tree (standalone leaf, no _deps) ──▶ flat-dnd (+ form-edit)
```

**Rule:** upper layers import lower layers, never the reverse.
`form-edit` does not import `form-item-editor`, `side-menu`, `section-edit`, or `section-view`.
`response` is a leaf (types + `emptyResponse`). `form` imports it for
`getUseImpRefViewProps`. `section-responder` composes form + response +
`SectionWithItems` (form-edit) into a fillable section shell; `form-responder`
stacks sections via `CustomFormResponderHOC`. `section-review` composes the
same layers into a read-only teacher/admin review shell (per-item `status` +
comment/follow-up-form-item overlays mutating `AdditionalChanges`); `form-review`
stacks sections via `CustomFormReviewHOC`. `section-review`/`form-review` do
**not** depend on `section-responder`/`form-responder` (siblings, not a
stack) — a host may share one `viewers` bag between fill and review since
`ResponderExtra` and `ReviewExtra` have the same shape. `form-response` is the
persisted FormResponse document (Send / Save additional questions / feedback);
it depends on `section-review` (`AdditionalChanges`) and does **not** import
the fill/review HOCs. `drag-drop-tree` is a
leaf (no `_deps`). `flat-dnd` imports its **pure ops** only; `flat-dnd/demo`
wires the headless React engine (`DnDTreeCore`, `RecursiveTreeNode`) and owns
HTML chrome — see `demo/WebRecursiveEdit.tsx`. Stock school widgets also live
under `drag-drop-tree/demo/`.

Module demos compose features via props. `form-dialogs/demo/FormDialogsDemo.tsx`
wires `SectionFormItemHOC` + `WebRecursiveEdit` + `makeUseDialogs`.
`form-response/demo/FormResponseDemo.tsx` wires fill/review HOCs with
Send / Save / feedback hooks. The form-dialogs demo injects
`side-menu`'s `makeUseRenderAddItem` into `section-view`, same as school.

## Import rules

Each package under `src/` (except leaf packages like `form/`) has a `_deps.ts` that
re-exports everything it needs from **sibling packages**.

| Rule | Detail |
|---|---|
| **Package source files** (`*.ts`, not tests) | Import siblings only via `./_deps`. Same-package imports (`./types`, …) are fine. |
| **`index.ts`** | Re-export public API from local files only — no sibling imports. |
| **`*.stories.tsx`** | Storybook demos — may import across packages to compose features. |
| **`*.test.ts` / `*.test.tsx`** | Vitest only — no duplicate demo components. |
| **Subfolders** (e.g. `form-edit/section-layout/`) | Same rule: use that folder's `_deps.ts`, which may re-export from parent `_deps` or sibling subfolders. |

Example (`section-edit/updateSectionInFlat.ts`):

```typescript
import type { FlatFormItems, ParamsDom, SectionDom } from "./_deps";
import { consolidateSections, flatten, resizeColumns } from "./_deps";
```

Not:

```typescript
import { flatten } from "../form-edit";  // ❌ bypasses _deps
import { useState } from "../side-menu/_deps";  // ❌ cross-package via another package's _deps
```

## Flat edit format

The edit pipeline stores forms as a **flat array**, not a nested tree.

```typescript
[
  { section: { id, title, description, deleted } },
  { item: { id, type, params, deleted }, n: 0 },   // n = number of child slots
  { item: { ... }, n: 2 },
  { end: null },                                    // closes first child slot
  { end: null },                                    // closes second child slot
  { section: { ... } },
  ...
]
```

- `consolidateSections(flat)` → nested `SectionWithItems[]` for UI
- `flatten().formItem(recursive)` → flat slice for one item (used when inserting)

## EditFormTest — shared demo host

`form-edit/EditFormHost.tsx` exports `EditFormTest`, the reusable edit-form UI used by
side-menu, form-item-editor, and section-edit demos.

**Injection props** (keeps feature logic out of form-edit):

| Prop | Purpose |
|---|---|
| `extra(item)` | Extra buttons on each field row (e.g. "Edit") |
| `sectionExtra(section)` | Extra buttons on each section header (e.g. "Edit") |
| `renderAddItem({ index, sIndex })` | "+ Add" control at the end of each list slot (section + nested panel columns) |
| `renderLayout({ sections, alert, details, setFlatItems, focus })` | Full page layout (e.g. place a sidebar) |

**Exported helpers:** `container(title, children)`, `EditFormTest`, types `EditFormSection`, `EditFormCtx`, …

## Branded types

Several types use `Branded<T, Tag>` (`form/branded.ts`) for nominal typing:

- `ParamsDom`, `ContextDom`, `DialogArgsDom`, `ItemEditExtraDom`, …

Use `branded({ ... })` to construct values; do not cast.

## Per-module docs

- [form/README.md](./form/README.md)
- [response/README.md](./response/README.md)
- [section-responder/README.md](./section-responder/README.md)
- [form-responder/README.md](./form-responder/README.md)
- [section-review/README.md](./section-review/README.md)
- [form-review/README.md](./form-review/README.md)
- [form-response/README.md](./form-response/README.md)
- [recursive-form/README.md](./recursive-form/README.md)
- [move-actions/README.md](./move-actions/README.md)
- [form-edit/README.md](./form-edit/README.md) — also [flat-raw-actions](./form-edit/flat-raw-actions/README.md), [section-layout](./form-edit/section-layout/README.md)
- [form-item-editor/README.md](./form-item-editor/README.md)
- [side-menu/README.md](./side-menu/README.md)
- [section-edit/README.md](./section-edit/README.md)
- [section-view/README.md](./section-view/README.md)
- [drag-drop-tree/README.md](./drag-drop-tree/README.md)
- [flat-dnd/README.md](./flat-dnd/README.md)
- [form-dialogs/README.md](./form-dialogs/README.md)
