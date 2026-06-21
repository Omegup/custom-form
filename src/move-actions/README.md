# move-actions

Generic **move / clone / remove / restore** action builders for editable lists.

## Files

| File | Role |
|---|---|
| `MoveActions.t.ts` | `MoveActions` type: `{ up, down, clone, remove, restore, isDeleted }` |
| `makeActions.ts` | Wraps raw `{ fn, ctx }` pairs into nullable click handlers |
| `autofocus.t.ts` | `AutoFocus<Ctx, Focused>` — focus tracking mixin for context |
| `cloneName.ts` | `"Name (copy1)"` style rename helper |
| `animation.css` | Pulse animation used by edit-form focus highlight |
| `Actions.stories.tsx` | Storybook: simple deletable item list |

## Usage in form-edit

```
getFlatRawActions  →  RawActions  →  makeActions  →  MoveActions
```

`getFlatRawActions` builds the `RawActions` object that `makeActions` consumes.
`getFormItemMoveActions` / `getSectionMoveActions` add section-level guards
(e.g. hide `up` when item is first in its section) before returning `MoveActions`.
