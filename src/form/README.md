# form

**View layer** — types and React factories for rendering form items (read-only display).

Migrated from `school/components/custom-form` → `form-react`, `form-model`.

## Files

| File | Role |
|---|---|
| `form.t.ts` | Core types: `TypedFormItem`, `ParamsDom`, `SomeFormItem`, `ContextDom` |
| `form-react.t.ts` | Viewer types: `Viewer`, `Viewers`, `FormItemProps`, `WithChildren` |
| `branded.ts` / `branded.t.ts` | `branded()` helper and `Branded<T, Tag>` nominal type |
| `createFormItemByGetChild.tsx` | `FormItemHOC` — resolves lazy children via `getChild` |
| `createFormItemByChildren.tsx` | Variant using pre-resolved `children` map |
| `Form.stories.tsx` | Storybook: JSON textarea drives a live form |

## Key concepts

**ParamsDom** — map from item type name to param shape:
```typescript
type Params = TheParams<{ field: { name: string }; group: { title: string } }>;
```

**Viewer** — React component `( { props: ViewerProps }) => ReactNode` looked up by `formItem.type`.

**FormItemHOC(viewers, useUpdatedViewProps)** — returns a `FormItem` component that picks the right viewer and wraps output in `renderCard`.

## Does NOT contain

Edit logic, flat state, move actions, or dialogs. See `form-edit/` and `form-item-editor/`.
