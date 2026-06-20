# Source layout

```
src/
├── main.tsx                 App shell — tabbed demo launcher
├── form/                    View layer (read-only form rendering)
├── recursive-form/          Tree types with meta
├── move-actions/            Generic move/clone/remove actions
├── form-edit/               Edit orchestration (flat state + section/item actions)
├── form-item-editor/        Single-item edit dialog factory
├── side-menu/               Add-item library sidebar
├── section-edit/            Section edit dialog + validation
└── response/                Form response value helpers
```

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
```

**Rule:** upper layers import lower layers, never the reverse.
`form-edit` does not import `form-item-editor`, `side-menu`, or `section-edit`.
Demos compose them via props (`extra`, `sectionExtra`, `renderLayout`).

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

`form-edit/EditForm.test.tsx` exports `EditFormTest`, the reusable edit-form UI used by
side-menu, form-item-editor, and section-edit demos.

**Injection props** (keeps feature logic out of form-edit):

| Prop | Purpose |
|---|---|
| `extra(item)` | Extra buttons on each field row (e.g. "Edit") |
| `sectionExtra(section, { cols })` | Extra buttons on each section header (e.g. "Edit") |
| `renderLayout({ sections, alert, details, ctx, setFlatItems, setFocused })` | Full page layout |

**Exported helpers:** `container(title, children)`, `BareEditFormTest`, types `EditFormSection`, `EditFormCtx`, …

## Branded types

Several types use `Branded<T, Tag>` (`form/branded.ts`) for nominal typing:

- `ParamsDom`, `ContextDom`, `DialogArgsDom`, `ItemEditExtraDom`, …

Use `branded({ ... })` to construct values; do not cast.

## Per-module docs

- [form/README.md](./form/README.md)
- [recursive-form/README.md](./recursive-form/README.md)
- [move-actions/README.md](./move-actions/README.md)
- [form-edit/README.md](./form-edit/README.md) — also [flat-item-raw-actions](./form-edit/flat-item-raw-actions/README.md), [section-actions](./form-edit/section-actions/README.md)
- [form-item-editor/README.md](./form-item-editor/README.md)
- [side-menu/README.md](./side-menu/README.md)
- [section-edit/README.md](./section-edit/README.md)
- [response/README.md](./response/README.md)
