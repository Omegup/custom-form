# side-menu

**Add-item library sidebar** — search menu items, pick a type to insert, or add a blank section.

Migrated from `school/components/custom-form` → `react-packages/form-edit-react`
(`useSide`, `MenuItemDefinition`, insert logic from `useDialog`).

## Files

| File | Role |
|---|---|
| `MenuItemDefinition.t.ts` | Catalogue entry: `{ icon, title, n?, header: { type, params } }` |
| `useSide.ts` | Hook: search state, filtered menu, `renderMenuItems`, `addSection` |
| `insertFlatFormItem.ts` | **`insertFlatFormItem`**, **`appendFlatSection`** — flat-list mutations |
| `SideMenu.test.tsx` | Demo: `EditFormTest` + side panel (`SideMenuTest`) |

## useSide

```typescript
const { search, setSearch, renderMenuItems, addSection } = useSide({
  menuItems,          // catalogue of addable item types
  setAddFormItem,     // callback when user picks an item type
  setAddSection,      // callback when user clicks "Add section"
  random,             // id generator
  makeSection,        // (id) => SectionWithItems — blank section template
});
```

**Search** — accent-insensitive, multi-token (`"attach field"` matches "Attachment field").

## Insert logic (`insertFlatFormItem.ts`)

1. `flatten().formItem(recursive)` → flat markers for the new item
2. Find target section (first non-deleted, or `sIndex`)
3. Splice after last content in that section

`appendFlatSection` appends `{ section }` at end of flat list.

## Demo wiring

```tsx
<EditFormTest
  renderLayout={({ setFlatItems, setFocused, sections, ... }) => (
    <div style={{ display: "flex" }}>
      <SidePanel
        setFlatItems={setFlatItems}
        focus={(id) => setFocused({ id, focused: true })}
      />
      {sections}
    </div>
  )}
/>
```

Side panel calls `insertFlatFormItem` / `appendFlatSection` inside `setAddFormItem` / `setAddSection`.
