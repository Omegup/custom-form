# recursive-form

Tree-shaped form types built on top of `form`.

## Files

| File | Role |
|---|---|
| `Recursive.t.ts` | `Header<H, Meta>`, `Recursive<T, H, Meta>`, `RecursiveT` |
| `RecursiveFormItem.t.ts` | `RecursiveFormItem`, `RecursiveTypedFormItem` |
| `RecursiveForm.stories.tsx` | Storybook: nested items with text/group types |

## Types

```typescript
// Any item type in the header
RecursiveFormItem<TypeNames, Params, Meta>

// Header narrowed to one type K
RecursiveTypedFormItem<TypeNames, Params, K, Meta>
// = { header: TypedFormItem<Params, K>; meta: Meta["meta"]; children: ...[][] }
```

**MetaDom** — `{ meta: T }` wrapper. Edit form uses `MetaDom<{ index, total, sIndex }>` on items and sections.

**Column slots** — `children` on recursive items and `items` on sections are `RecursiveFormItem[][]`.
Use `resizeColumns(cols, slots)` to grow or shrink that grid (see `resizeColumns.ts`).

## Relationship to flat format

`consolidateSections` (in `form-edit/`) converts flat → recursive tree.
`flatten()` (in `form-edit/section-layout/`) converts recursive → flat.
