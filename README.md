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

Each module has a colocated `*.stories.tsx`. Story titles match folder names, e.g. `form-edit/Edit form`, `form-dialogs/All-in`.

| Story | Module | What it shows |
|---|---|---|
| **form-dialogs/All-in** | `form-dialogs/` | Full composed editor (`SectionFormItemHOC` + `WebRecursiveEdit` DnD + every dialog flow) |
| form/Form | `form/` | Viewers rendering a JSON-driven form |
| response/Response | `response/` | Fill-path foundation (`ResponseSetter` + `getUseImpRefViewProps` validate) |
| section-responder/Section responder | `section-responder/` | One section of fillable fields + section-level validate |
| form-responder/Form responder | `form-responder/` | Multi-section fill shell + form-level validate |
| section-review/Section review | `section-review/` | Design → Response → Follow for one section + JSON per phase |
| form-review/Form review | `form-review/` | Multi-section review lifecycle + JSON for design/response/follow |
| move-actions/Move actions | `move-actions/` | Item list with up/down/clone/remove |
| form-edit/Edit form | `form-edit/` | Section/field list with move actions only |
| form-item-editor/Form item editor | `form-item-editor/` | Edit form + per-field edit dialog |
| side-menu/Side menu | `side-menu/` | Library sidebar + in-slot add (section & nested panels) |
| section-edit/Section edit | `section-edit/` | Edit form + section edit dialog |
| section-view/Section view | `section-view/` | `SectionHOC` + `ColumnsEdit` composing viewers + nested panels + add slots (no DnD) |
| flat-dnd/Flat dnd | `flat-dnd/` | `SectionFormItemHOC` with HTML5 drag-and-drop reorder (`WebRecursiveEdit`, web-only) swapped in for `ColumnsEdit` |
| recursive-form/Recursive form | `recursive-form/` | Nested recursive item rendering |

Shared edit-form fixtures: `form-edit/demo/fixtures.ts` (single-type list) and `form-item-editor/demo/fixtures.ts` (multi-type list, reused by the side-menu and All-in stories).

> Storybook requires **Node 20+**. Use `nvm use 22` if `pnpm storybook` fails on Node 18.

## Architecture

See **[src/README.md](./src/README.md)** for the full module map, dependency graph, and migration status.

### Layer overview

```
form / recursive-form / response  ← domain types (items, trees, branded params, answers)
move-actions                   ← up/down/clone/remove action helpers
drag-drop-tree                 ← school's drag-drop-tree package (ops + React DnD engine)
form-edit                      ← flat edit representation + move actions on sections/items
form-item-editor               ← single-item edit dialog (HOC factory)
side-menu                      ← library catalog: Side sidebar + AddFormItem slots
section-edit                   ← section title/description edit dialog
section-view                   ← SectionHOC + ColumnsEdit (section list rendering, no DnD)
flat-dnd                       ← SectionNodes ↔ drag-drop-tree conversion (lib); demo wires React DnD
form-dialogs                   ← dialog orchestration (makeUseDialogs) + All-in demo
section-responder              ← section fill shell (SectionResponderHOC)
form-responder                 ← multi-section fill shell (CustomFormResponderHOC)
section-review                 ← section review shell (SectionReviewHOC)
form-review                    ← multi-section review shell (CustomFormReviewHOC)
```

**Canonical edit state** is the **flat list** (`FlatFormItems`): an array of `{ section }`, `{ item, n }`, and `{ end: null }` markers. The tree is rebuilt on demand via `consolidateSections`.

### Conventions (every package)

- `index.ts` — public API
- `_deps.ts` — re-exports from sibling packages (see [src/README.md](./src/README.md#import-rules))
- `*.stories.tsx` — Storybook entry (args, controls, docs)
- `*Playground.tsx` — interactive demo component wired to story args
- `*.test.ts` / `*.test.tsx` — Vitest tests only
- `*.t.ts` — type-only files

### Migration source

Original packages live under `school/components/custom-form/src/`:

| slot-tree | school source |
|---|---|
| `form/` | `ts-packages/form-model`, `react-packages/form-react` (`FormItemHOC`, `getUseImpRefViewProps`) |
| `response/` | `types/response`, `types/form-response-react` (`ViewerMethods`) |
| `section-responder/` | `ui-packages/section-responder-ui` (`SectionResponderHOC`) |
| `form-responder/` | `ui-packages/form-responder-ui` (`CustomFormResponderHOC`) |
| `section-review/` | `ui-packages/section-review-ui` (`SectionReviewHOC`) |
| `form-review/` | `ui-packages/form-response-ui` (`CustomFormResponsesHOC`) |
| `form-edit/` | `ts-packages/form-edit` |
| `form-item-editor/` | `react-packages/form-item-edit-react` |
| `side-menu/` | `react-packages/form-edit-react` (`useSide`, `MenuItemDefinition`, `makeUseRenderAddItem`) + `section-edit-ui` (`FormMenuItem`, `AddFormItem`) |
| `section-edit/` | `react-packages/form-edit-react` (`SectionEdit`; required-field validation stays **host-owned** — see section-edit/README.md) |
| `section-view/` | `react-packages/form-edit-react` (`Section.tsx` `SectionHOC`, `renderEditFormItem.tsx`) + `ts-packages/form-edit` (`section.data.ts` `getSectionEdit`, ported into `form-edit/flat-move-actions`) |
| `drag-drop-tree/` | `components/drag-drop-tree` (ops + headless React engine; HTML chrome in `demo/`) |
| `flat-dnd/` | `recursive-edit-ui/FlatDnd.tsx` pure half (`toDndTree`/`cleanNodes`); demo wires `drag-drop-tree` React API via `WebRecursiveEdit` |
| `form-dialogs/` | `form-edit-react` (`makeUseDialogs`; the pure `setEditFormItemX` part lives in `form-edit/applyFlatFormItem`) |
