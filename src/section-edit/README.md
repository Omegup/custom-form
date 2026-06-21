# section-edit

**Section edit types and validation** — migrated from school `form-edit-react/SectionEdit.ts`.

The original package exports types + `validateSectionForm` only. The dialog hook
(`UseSectionEditDialog`) is a **type** for the host to implement; see `SectionEdit.test.tsx`
for a demo hook.

Also includes `updateSectionInFlat` — flat-list save logic extracted from
school `useDialog` section `onSave`.

## Files

| File | Role |
|---|---|
| `types.ts` | `SectionEditForm`, `SectionEditDialogProps`, `UseSectionEditDialog` |
| `validateSectionForm.ts` | Returns `Errors` when title or description is blank |
| `updateSectionInFlat.ts` | Re-flattens one section with new header + column count |
| `_deps.ts` | Sibling-package imports (see src/README.md import rules) |
| `SectionEdit.test.tsx` | Demo hook + dialog UI (`SectionEditDemo`) |

## Flow

```
User clicks "Edit" on section header (via sectionExtra)
  → host opens dialog with { header, cols }
  → host useSectionEditDialog manages form state
  → validateSectionForm on submit
  → onSave → updateSectionInFlat(flatItems, id, { title, description }, cols)
```

## Section shape

`EditFormSection` (in `form-edit/EditForm.test.tsx`):

```typescript
{ id: string; deleted: boolean; title: string; description: string }
```

## Demo wiring

```tsx
<EditFormTest
  sectionExtra={(section, { cols }) => [{ label: "Edit", onClick: () => open(section, cols) }]}
  renderLayout={({ sections, setFlatItems, ... }) => (
    <>
      {editing && <SectionEditDialog onSave={...} />}
      {sections}
    </>
  )}
/>
```
