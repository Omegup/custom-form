# section-layout

Section-aware move actions and **tree ↔ flat** conversion.

## Key exports

| Export | Role |
|---|---|
| `flatten()` | Recursive item → flat markers (`{ item, n }`, `{ end }`) |
| `getFormItemMoveActions` | `MoveActions` for one consolidated field |
| `getSectionMoveActions` | `MoveActions` for one section header |
| `getSectionEdit` | `RecursiveEditManager` for in-section tree editing |
| `columnFlatInsertIndex` | Flat splice index for a section column add slot |
| `SectionEditArgs` | Args bag passed to `SectionHOC` via `SectionProps.edit` |
| `SectionWithItems` | `{ meta, header, items: RecursiveFormItem[][] }` |

## flatten vs consolidateSections

```
flat  ──consolidateSections──►  tree (SectionWithItems[])
tree  ──flatten().formItem──►  flat slice (for one item)
tree  ──flatten().section───►  flat slice (for one section)
```

These are inverses for round-tripping edit state.
