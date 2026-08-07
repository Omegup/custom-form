# edit-section (MVP)

**Column-slot add dropdown** — a "+ Add item" control at the end of each
section column that opens the form-item-editor dialog with an insert session
at that slot's flat index.

Migrated (MVP slice) from `school/components/custom-form` →
`react-packages/form-edit-react` (`makeUseRenderAddItem`) + `section-edit-ui`
(`AddFormItem`; `FormMenuItem` lives in `side-menu`).

## Library scope (this package)

| File | Role |
|---|---|
| `AddFormItem.tsx` | Dropdown of `FormMenuItem` rows; picking a type calls `setAddItem(openFormItemInsertSession(newItem, span))` — school `AddFormItem` minus `BareSelect` / theme |
| `makeUseRenderAddItem.ts` | **`makeUseRenderAddItem(renderAddItem, useMenuItems, random)(setAddItem)`** → `(span) => ReactNode` — school factory minus ctx/theme threading |

The slot span comes from the host:

```ts
{
  index: getFlatInsertionIndex(section.meta.index, section.items, colIndex), // form-edit
  sIndex, // section ordinal
}
```

then dialog Save runs `applyFlatFormItem(items, session, item, n)` — a pure
insert (`total: 0`) at the end of the clicked column.

## Deferred — full SectionHOC

This package will eventually own the section rendering HOCs; only the add
dropdown is migrated here.

| Concern | School reference |
|---|---|
| `SectionHOC` / `SectionFormItemHOC` viewers | `form-edit-react`, `section-edit-ui` |
| Drag & drop between slots | `recursive-edit-ui/FlatDnd` |
| Nested panel add-item (beyond section columns) | `createRenderEditFormItem` |
| Section picker / `setFormItemSection` | `editors/selectSection.tsx` |

## Demo

`edit-section/Edit section` story: the multi-type list shell
(`FormItemEditorFormTest`, form-item-editor demo) with `renderAddItem` wired to
`makeUseRenderAddItem`; the catalog is shared with the side-menu demo
(`side-menu/demo/fixtures`), and Save reuses the form-item-editor demo editor
stack.

## Dependency rule

Imports from: `form`, `recursive-form`, `form-edit`, `side-menu` (via `_deps`).

Does **not** import: `form-item-editor`, `section-edit`. The demo composes
those packages for Storybook only.
