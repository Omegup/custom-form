# edit-section

**Editable section rendering** — HOC stack for edit-mode sections with viewers, column add-item slots, and move actions.

Ported from school `form-edit-react` (`SectionHOC`, `SectionFormItemHOC`, `createRenderEditFormItem`, `makeUseRenderAddItem`).

Distinct from **`section-edit`** (section title/description dialog).

## Files

| File | Role |
|---|---|
| `types.ts` | `SectionProps`, `RenderFormItem`, `RecursiveEditProps`, `AddFormItemProps`, `EditExtra` |
| `createRenderEditFormItem.tsx` | Renders one item through `FormItemHOC` + edit extras |
| `makeUseRenderAddItem.ts` | Hook factory for per-column add-item UI |
| `SectionHOC.tsx` | Wires `getSectionEdit` + title + add slots + item renderers |
| `SectionWithMenuItems.tsx` | `SectionHOC` + menu-driven add flow |
| `SectionFormItem.tsx` | Full factory: viewers + menu + card chrome |
| `EditSection.test.tsx` | Demo (`EditSectionDemo`) |

## Dependencies

- `form` — `FormItemHOC`, `RenderCard`, viewers types
- `form-edit` — `getSectionEdit`, `SectionEditArgs`, `SectionWithItems`
- `side-menu` — `MenuItemDefinition` type (add-item catalogue)
- `recursive-form` — `RecursiveFormItem`, `MetaDom`

Host supplies **`renderEdit`** (school: `RecursiveEdit` UI with DnD). This repo demo uses a minimal column layout stand-in.

## Stack

```
SectionFormItemHOC
  └─ SectionWithMenuItemsHOC
       └─ SectionHOC
            ├─ getSectionEdit (form-edit)
            ├─ createRenderEditFormItem → FormItemHOC
            └─ makeUseRenderAddItem
```

## Demo

Use the **Edit section** tab — two sections with field viewers, column add-item buttons, section move actions, and live flat JSON.
