# Source layout

```
src/
├── main.tsx                 Legacy Vite entry (points to Storybook)
├── form/                    View layer (read-only form rendering)
├── recursive-form/          Tree types with meta
├── move-actions/            Generic move/clone/remove actions
├── form-edit/               Edit orchestration (flat state + section/item actions)
├── form-item-editor/        Single-item edit dialog factory
├── side-menu/               Add-item library sidebar
├── section-edit/            Section edit types + validation + flat save
├── edit-section/            SectionHOC + item viewers + add-item slots
├── editor/                  Composed shell + all-in Storybook demo
└── response/                Form response value helpers
```

Each module owns its **Storybook story** (`*.stories.tsx` with args/controls) and a **playground component** (`*Playground.tsx`). Vitest tests live in `*.test.ts` (`editor/` also has `AllInEditor.test.tsx`).

## Dependency graph

```
form ─────────────────────────────────────────┐
recursive-form ───────────────────────────────┤
move-actions ─────────────────────────────────┤
                                              ▼
                                         form-edit
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                      form-item-editor   side-menu      section-edit
                              │               │               │
                              └───────────────┴───────────────┘
                                              │
                                         edit-section
                                              │
                                         editor
```

**Rule:** upper layers import lower layers, never the reverse.
`form-edit` does not import `form-item-editor`, `side-menu`, or `section-edit`.
Module demos compose features via props or, for the all-in editor, in `editor/AllInEditor.tsx`.

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
| `sectionExtra(section, { cols })` | Extra buttons on each section header (e.g. "Edit") |
| `renderLayout({ sections, alert, details, ctx, setFlatItems, setFocused })` | Full page layout |

**Exported helpers:** `container(title, children)`, `EditFormTest`, types `EditFormSection`, `EditFormCtx`, …

## Branded types

Several types use `Branded<T, Tag>` (`form/branded.ts`) for nominal typing:

- `ParamsDom`, `ContextDom`, `DialogArgsDom`, `ItemEditExtraDom`, …

Use `branded({ ... })` to construct values; do not cast.

## Per-module docs

- [form/README.md](./form/README.md)
- [recursive-form/README.md](./recursive-form/README.md)
- [move-actions/README.md](./move-actions/README.md)
- [form-edit/README.md](./form-edit/README.md) — also [flat-raw-actions](./form-edit/flat-raw-actions/README.md), [section-layout](./form-edit/section-layout/README.md)
- [form-item-editor/README.md](./form-item-editor/README.md)
- [side-menu/README.md](./side-menu/README.md)
- [section-edit/README.md](./section-edit/README.md)
- [edit-section/README.md](./edit-section/README.md)
- [editor/README.md](./editor/README.md)
- [response/README.md](./response/README.md)
