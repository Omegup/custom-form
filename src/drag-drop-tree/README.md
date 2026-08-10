# drag-drop-tree

**Drag-and-drop tree package** — literal port of `school/components/drag-drop-tree`:
pure tree ops **and** the React DnD engine (`DnDTreeCore`, `TreeNodeComponent`, …).
JSS/`school-style` is replaced by inline styles + a minimal `Theme` (`theme.ts`).

## Package layout (mirrors school)

```
drag-drop-tree/
├── types.ts              TreeNode, DropPosition, Handlers, DnDTreeProps, …
├── utils.ts              findNodeById, removeNode, insertNode, moveNode, …
├── applyDrop.ts          pure drop helper (used by DnDTreeCore.handleDrop)
├── theme.ts              Theme + defaultTheme (school-style stand-in)
├── DnDTree.tsx           DnDTreeCore, DnDTree
└── Components/
    ├── TreeNode/         RecursiveTreeNode, TreeNodeCore, TreeNodeComponent, Indicator
    └── Handle/           HandleVertical, HandleHorizontal + variant helpers
```

Public API matches school's `index.ts`:

- `DnDTree`, `DnDTreeCore`
- `TreeNodeComponent`, `RecursiveTreeNode`, `Indicator`, `Handle*` exports
- types: `TreeNode`, `Handlers`, `RenderItem`, `DropPosition`, `DropTarget`, …

## Who imports what

| Consumer | Imports |
|---|---|
| `flat-dnd` (lib) | pure ops only — `applyDrop`, `TreeNode`, … via `_deps` |
| `flat-dnd/demo` | React engine — `DnDTreeCore`, `RecursiveTreeNode`, `Indicator` |
| `form-dialogs/demo` | same via `flat-dnd/demo/WebRecursiveEdit` |

Hosts that only need headless ops can import `utils` / `applyDrop` directly and
bring their own UI (e.g. mobile gestures). Web hosts use the React components
the same way school does — see `flat-dnd/demo/WebRecursiveEdit.tsx` (~30 lines
of glue over `flat-dnd`'s `toDndTree` / `cleanNodes`).

## Deviations from school

| School | Here | Why |
|---|---|---|
| `react-jss` + `school-style` `Theme` | inline styles + `theme.ts` / `defaultTheme` | no design-system dependency in this repo |
| `removeNode` via `.filter(Boolean) as TreeNode<T>[]` | `.flatMap` | same behavior, no cast |
| inline `handleDrop` body in `DnDTreeCore` | calls `applyDrop` | shared with headless callers / tests |

## Dependency rule

No sibling imports — leaf package (no `_deps.ts`). Depends on `react` only for
`Components/` and `DnDTree.tsx`.
