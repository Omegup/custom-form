# drag-drop-tree

**Pure drag-and-drop tree ops** — id-addressed tree mutations, no React, no
HTML5 events, no styling. Usable from a web HTML5 DnD UI or a mobile gesture
UI alike.

Migrated from `school/components/drag-drop-tree` (`src/types.ts` + `src/utils.ts`,
tree shape and ops only).

## Library scope (this package)

| File | Role |
|---|---|
| `types.ts` | `TreeNode<T>` (`_id`, `children`, optional `isExpanded`/`parentId` — kept for field-for-field parity with school), `DropPosition` (`'inside' \| 'before' \| 'after' \| null`), `DropTarget`, `Direction` |
| `utils.ts` | `findNodeById`, `isDescendant`, `collectSubtreeIds`, `removeNode`, `insertNode`, `insertNodeIn`, `moveNode` — same behavior as school's `utils.ts` |
| `applyDrop.ts` | **`applyDrop(nodes, draggedId, target)`** — thin wrapper of school `DnDTreeCore.handleDrop`'s pure body: find dragged node → reject dropping into its own subtree → `removeNode` + `insertNode` |

**Not ported here** (school `Components/`): `DnDTree`/`DnDTreeCore` (React,
holds `draggedId`/`dropTarget` state), `TreeNodeComponent`/`RecursiveTreeNode`/
`Indicator` (React, hover/render), `Handle` (JSS + `school-style` `Theme`).
Those are UI and belong in a host demo, not this package — see
[`flat-dnd/README.md`](../flat-dnd/README.md) for where the web demo puts them.

## Deviations from school

| School | Here | Why |
|---|---|---|
| `removeNode` builds via `.map(...).filter(Boolean) as TreeNode<T>[]` | `.flatMap(...)` | same behavior, no cast (`.cursor/rules/typescript-types.mdc`) |
| `handleDrop`'s find/reject/remove/insert body lives inline in `DnDTreeCore` | extracted as a standalone, independently testable `applyDrop(nodes, draggedId, target)` | this package has no React component to host it in; the host's `onDrop` calls it directly |

Everything else (`TreeNode<T>` shape, `insertNode`'s `isExpanded`/`parentId`
bookkeeping, `moveNode`'s boundary behavior) is byte-for-byte the same
algorithm as school, so a school-style DnD UI (`DnDTreeCore`,
`TreeNodeComponent`, `Handle`) can be dropped into a host demo and driven by
these ops unmodified — see the `flat-dnd` demo.

## Dependency rule

No sibling imports — this package is a leaf (no `_deps.ts`), usable standalone.
