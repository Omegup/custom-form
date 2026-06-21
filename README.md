# slot-tree

Experimental port of the **custom-form edit stack** into a small, typed React playground.
Migrated piece-by-piece from `school/components/custom-form`.

## Quick start

```bash
npm install
npm run dev
```

Open the app and use the tabs at the top — each tab is a live demo of one module.

## Architecture

See **[src/README.md](./src/README.md)** for the full module map, dependency graph, and migration status.

### Layer overview

```
form / recursive-form          ← domain types (items, trees, branded params)
move-actions                   ← up/down/clone/remove action helpers
form-edit                      ← flat edit representation + move actions on sections/items
form-item-editor               ← single-item edit dialog (HOC factory)
side-menu                      ← library sidebar (search + add item/section)
section-edit                   ← section title/description edit dialog
```

**Canonical edit state** is the **flat list** (`FlatFormItems`): an array of `{ section }`, `{ item, n }`, and `{ end: null }` markers. The tree is rebuilt on demand via `consolidateSections`.

### Demo tabs (`main.tsx`)

| Tab | Module | What it shows |
|---|---|---|
| Form | `form/` | Viewers rendering a JSON-driven form |
| Move actions | `move-actions/` | Item list with up/down/clone/remove |
| Edit form | `form-edit/` | Section/field list with move actions only |
| Form item editor | `form-item-editor/` | Edit form + per-field edit dialog |
| Add-item side | `side-menu/` | Edit form + library sidebar to add items/sections |
| Section edit | `section-edit/` | Edit form + section edit dialog |
| Recursive form | `recursive-form/` | Nested recursive item rendering |

### Conventions (every package)

- `index.ts` — public API
- `_deps.ts` — re-exports from sibling packages (see [src/README.md](./src/README.md#import-rules))
- `*.test.tsx` — interactive demo component exported for `main.tsx` (may import anywhere)
- `*.t.ts` — type-only files

### Migration source

Original packages live under `school/components/custom-form/src/`:

| slot-tree | school source |
|---|---|
| `form/` | `ts-packages/form-model`, `react-packages/form-react` |
| `form-edit/` | `ts-packages/form-edit` |
| `form-item-editor/` | `react-packages/form-item-edit-react` |
| `side-menu/` | `react-packages/form-edit-react` (`useSide`, `MenuItemDefinition`) |
| `section-edit/` | `react-packages/form-edit-react` (`SectionEdit`, `validateSectionForm`) |

Still to migrate from `form-edit-react`: `makeUseDialogs`, `SectionHOC`, `createRenderEditFormItem`, `makeUseRenderAddItem`, …
