# slot-tree

Experimental port of the **custom-form edit stack** into a small, typed React playground.
Migrated piece-by-piece from `school/components/custom-form`.

## Quick start

```bash
pnpm install
pnpm storybook
```

Open **http://localhost:6006** — Storybook hosts every module demo plus the **All-in editor** composition.

Legacy Vite entry (`pnpm dev`) redirects to Storybook — demos are not duplicated in `main.tsx`.

Run tests: `pnpm test`.

## Demos (Storybook)

Each module has a colocated `*.stories.tsx`. Story titles match folder names, e.g. `form-edit/Edit form`, `editor/All-in`.

| Story | Module | What it shows |
|---|---|---|
| **editor/All-in** | `editor/` | Full composed editor |
| form/Form | `form/` | Viewers rendering a JSON-driven form |
| move-actions/Move actions | `move-actions/` | Item list with up/down/clone/remove |
| form-edit/Edit form | `form-edit/` | Section/field list with move actions only |
| form-item-editor/Form item editor | `form-item-editor/` | Edit form + per-field edit dialog |
| side-menu/Side menu | `side-menu/` | Edit form + library sidebar |
| section-edit/Section edit | `section-edit/` | Edit form + section edit dialog |
| edit-section/Edit section | `edit-section/` | SectionFormItemHOC + viewers demo |
| recursive-form/Recursive form | `recursive-form/` | Nested recursive item rendering |

Shared edit-form fixtures for tests and the all-in demo: `form-edit/fixtures.ts`.

> Storybook requires **Node 20+**. Use `nvm use 22` if `pnpm storybook` fails on Node 18.

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
edit-section                   ← SectionHOC + viewers + column add-item slots
editor                         ← Composed shell + all-in Storybook demo
```

**Canonical edit state** is the **flat list** (`FlatFormItems`): an array of `{ section }`, `{ item, n }`, and `{ end: null }` markers. The tree is rebuilt on demand via `consolidateSections`.

### Conventions (every package)

- `index.ts` — public API
- `_deps.ts` — re-exports from sibling packages (see [src/README.md](./src/README.md#import-rules))
- `*.stories.tsx` — Storybook entry (args, controls, docs)
- `*Playground.tsx` — interactive demo component wired to story args
- `*.test.ts` / `*.test.tsx` — Vitest tests only (`editor/AllInEditor.test.tsx` is integration)
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
| `edit-section/` | `react-packages/form-edit-react` (`SectionHOC`, `SectionFormItemHOC`, `createRenderEditFormItem`, `makeUseRenderAddItem`) |
| `editor/` | `form-edit-react` (`makeUseDialogs`, `applyFlatFormItem`, `setEditFormItemX`) |

Still to migrate from `form-edit-react`: `recursive-edit-ui` (RecursiveEdit + FlatDnd), …
