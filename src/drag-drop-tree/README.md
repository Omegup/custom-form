# drag-drop-tree

**Drag-and-drop tree package** — port of `school/components/drag-drop-tree`:
pure tree ops **and** a headless React DnD engine (`DnDTreeCore`,
`RecursiveTreeNode` / `TreeNodeCore`). HTML chrome lives in **`demo/`** (see
`.cursor/rules/no-html-outside-demo.mdc`).

## Package layout

```
drag-drop-tree/
├── types.ts              TreeNode, DropPosition, Handlers, DnDTreeCoreProps, …
├── utils.ts              findNodeById, removeNode, insertNode, moveNode, …
├── applyDrop.ts          pure drop helper (used by DnDTreeCore.handleDrop)
├── DnDTree.tsx           DnDTreeCore (headless)
├── Components/
│   └── TreeNode/         RecursiveTreeNode, TreeNodeCore (render props only)
└── demo/                 HTML chrome (Indicator, Handle*, TreeNodeComponent, DnDTree, theme)
```

## Library API

- `DnDTreeCore` — drag state + `applyDrop`; host supplies nodes via `renderComponent`
- `RecursiveTreeNode` / `TreeNodeCore` — hit-testing + expand; host supplies
  `renderDraggable` / `renderChildren` / `renderIndicator` / `renderItem`
- types: `TreeNode`, `Handlers`, `RenderItem`, `DropPosition`, `DropTarget`, …
- pure ops: `utils`, `applyDrop`

## Demo chrome (`demo/`)

School's styled widgets — `Indicator`, `Handle*`, `TreeNodeComponent`, convenience
`DnDTree`, and `defaultTheme` — for hosts that want the stock HTML look. Import
from `drag-drop-tree/demo` (or copy the pattern into your own host).

## Who imports what

| Consumer | Imports |
|---|---|
| `flat-dnd` (lib) | pure ops only — `applyDrop`, `TreeNode`, … via `_deps` |
| `flat-dnd/demo` | headless React — `DnDTreeCore`, `RecursiveTreeNode`; local / demo Indicator |
| `form-dialogs/demo` | same via `flat-dnd/demo/WebRecursiveEdit` |

Hosts that only need headless ops can import `utils` / `applyDrop` directly and
bring their own UI (e.g. mobile gestures). Web hosts wire `renderComponent` the
same way school does — see `flat-dnd/demo/WebRecursiveEdit.tsx`.

## Deviations from school

| School | Here | Why |
|---|---|---|
| `react-jss` + `school-style` `Theme` + HTML in package root | headless lib; HTML + `theme` in `demo/` | host-agnostic; no-html-outside-demo |
| `removeNode` via `.filter(Boolean) as TreeNode<T>[]` | `.flatMap` | same behavior, no cast |
| inline `handleDrop` body in `DnDTreeCore` | calls `applyDrop` | shared with headless callers / tests |

## Dependency rule

No sibling imports — leaf package (no `_deps.ts`). Depends on `react` only for
`Components/` and `DnDTree.tsx`.
