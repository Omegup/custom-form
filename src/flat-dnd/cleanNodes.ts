/**
 * DnD tree → section item grid — school `FlatDnd.tsx` `cleanNodes` /
 * `typedCleanNodes`, minus the root `Recursive<T,H>` wrapper (this codebase
 * keeps a section's own `{ index, total, sIndex }` separate from its column
 * grid — see `RecursiveEditManager`/`SectionNodes` — so this only rebuilds
 * `SectionNodes['children']`; `commitDrop` folds it back onto `edit.nodes`).
 *
 * `meta` (`index`/`total`/`sIndex`) on the returned items is stale — harmless,
 * `flatten()` (the only consumer, via `RecursiveEditManager.setNodes`) never
 * reads `.meta`; it gets recomputed on the next `consolidateSections`.
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SIndexed } from "./_deps";
import type { DndTreeNode } from "./types";

export const cleanNodes = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  columns: DndTreeNode<TypeNames, Params>[],
): RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][] =>
  columns.map((column) =>
    column.children.flatMap((node) =>
      node.type === "item"
        ? [{ ...node.item, children: cleanNodes(node.children) }]
        : [],
    ),
  );
