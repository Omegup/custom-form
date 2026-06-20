# section-edit

**Section edit dialog** — edit section title, description, and column count with validation.

Migrated from `school/components/custom-form` → `react-packages/form-edit-react`
(`SectionEdit.ts`, `validateSectionForm`; hook pattern from `UseSectionEditDialog`).

## Files

| File | Role |
|---|---|
| `types.ts` | `SectionEditForm`, `SectionEditDialogProps`, `UseSectionEditDialog` |
| `validateSectionForm.ts` | Returns `Errors` when title or description is blank |
| `useSectionEditDialog.ts` | Form state hook: `{ section, setValue, onSubmit, isValid }` |
| `updateFlatSection.ts` | Patches `{ section }` markers in flat list by id |
| `SectionEdit.test.tsx` | Demo: `EditFormTest` + section edit dialog (`SectionEditDemo`) |

## Flow

```
User clicks "Edit" on section header (via sectionExtra)
  → open dialog with { header, cols }
  → useSectionEditDialog manages form state
  → validateSectionForm on submit
  → onSave → updateFlatSection(flatItems, id, { title, description })
```

**Note:** `cols` is in `SectionEditForm` but the demo only persists title/description
to flat sections. Column layout changes would need `flatten().section` + `changeCols`
(from school `useDialog`) — not yet migrated.

## Section shape

`EditFormSection` (in `form-edit/EditForm.test.tsx`):

```typescript
{ id: string; deleted: boolean; title: string; description: string }
```

## Demo wiring

```tsx
<EditFormTest
  sectionExtra={(section) => [{ label: "Edit", onClick: () => open(section) }]}
  renderLayout={({ sections, setFlatItems, ... }) => (
    <>
      {editing && <SectionEditDialog onSave={...} />}
      {sections}
    </>
  )}
/>
```
