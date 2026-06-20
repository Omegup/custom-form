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
| `changeSectionCols.ts` | Resize column slot arrays (merge or append empty slots) |
| `updateFlatSection.ts` | Re-flattens one section with new header + column count |
| `SectionEdit.test.tsx` | Demo: `EditFormTest` + section edit dialog (`SectionEditDemo`) |

## Flow

```
User clicks "Edit" on section header (via sectionExtra)
  → open dialog with { header, cols }
  → useSectionEditDialog manages form state
  → validateSectionForm on submit
  → onSave → updateFlatSection(flatItems, id, { title, description }, cols)
```

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
