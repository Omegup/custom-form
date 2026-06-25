# flat-raw-actions

**RawActions** builders for the flat form list — the input to `makeActions` in `move-actions/`.

## RawActions vs MoveActions

```
getFlatRawActions(args, clone)
  → actions(flatSlice, index)     // per-entry builder
  → RawActions                    // { index, total, items, setItems, clone, … }
  → makeActions(RawActions, …)    // in move-actions/
  → MoveActions                   // { up, down, clone, remove, restore } — UI handlers
```

| Name | Layer | What it is |
|---|---|---|
| **`RawActions`** | `move-actions` type | Full mutation context passed to `makeActions` |
| **`getFlatRawActions`** | this folder | Factory that builds `RawActions` for one flat slice |
| **`MoveActions`** | `move-actions` type | Nullable click handlers for buttons |

## Types

- **`FlatFormItem`** — `{ section }` | `{ item, n }` | `{ end: null }`
- **`FlatFormItems`** — array of the above
- **`SectionDom`** — `{ id, deleted }` (extended at app level with `title`, `description`)
- **`GetActionsArgs`** — `{ items, setItems, ctx, sectionOfItem, setToRemove }`

## `getFlatRawActions`

Returns `{ actions, isDeleted }` where `actions(subItems, index, min?)` produces a
`RawActions` object for one flat entry (section marker, item subtree, etc.).

Used by `getFormItemMoveActions` and `getSectionMoveActions` in `../section-layout/`.
