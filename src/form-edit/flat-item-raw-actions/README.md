# flat-item-raw-actions

Raw mutations on the **flat item array** before section-level guards are applied.

## Types

- **`FlatFormItem`** — `{ section }` | `{ item, n }` | `{ end: null }`
- **`FlatFormItems`** — array of the above
- **`SectionDom`** — `{ id, deleted }` (extended at app level with `title`, `description`)
- **`GetActionsArgs`** — `{ items, setItems, ctx, sectionOfItem, setToRemove }`

## `getFlatItemsRawActions`

Returns `(flatEntry, index) => RawActions` where each action is `{ fn, newItems, ctx } | null`.

Handles up/down/clone/remove/restore on individual flat entries, including subtree spans
for items with `n > 0` children.

Used by `getFormItemMoveActions` and `getSectionMoveActions` in `../section-actions/`.
