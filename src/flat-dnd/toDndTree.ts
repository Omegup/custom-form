/**
 * Section item grid → DnD tree — school `FlatDnd.tsx` `filterDeleted`.
 * Column `index` (add-item slot) uses the same rule as `ColumnsEdit`'s
 * `render.addItem` (`getFlatInsertionIndex` over the *full*, unfiltered
 * column), so add slots keep landing in the right place after a drop.
 *
 * `showDeleted: false` drops deleted items from the tree entirely — same as
 * school. A `commitDrop` taken while `showDeleted` is off therefore omits
 * those items from the rebuilt column (`cleanNodes` only sees what's still in
 * the tree); hosts that want deleted items reorderable/restorable through
 * drag should keep `showDeleted: true` (as every other demo in this repo
 * already does) and use it only as an optional "declutter" display toggle.
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SectionNodes, SIndexed } from "./_deps";
import { getFlatInsertionIndex } from "./_deps";
import type { DndTreeNode } from "./types";

const toDndColumns = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  columns: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][],
  parentIndex: number,
  sIndex: number,
  parentDeleted: boolean,
  idPrefix: string,
  showDeleted: boolean,
): DndTreeNode<TypeNames, Params>[] =>
  columns.map((column, colIndex): DndTreeNode<TypeNames, Params> => ({
    type: "column",
    _id: `${idPrefix}-col${colIndex}`,
    isExpanded: true,
    index: getFlatInsertionIndex(parentIndex, columns, colIndex),
    sIndex,
    children: column
      .filter((item) => showDeleted || !item.header.deleted)
      .map((item): DndTreeNode<TypeNames, Params> => ({
        type: "item",
        _id: item.header.id,
        isExpanded: true,
        item,
        parentDeleted,
        children: toDndColumns(
          item.children,
          item.meta.index,
          item.meta.sIndex,
          parentDeleted || item.header.deleted,
          item.header.id,
          showDeleted,
        ),
      })),
  }));

export const toDndTree = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  nodes: SectionNodes<TypeNames, Params>,
  args: { rootId: string; rootDeleted: boolean; showDeleted: boolean },
): DndTreeNode<TypeNames, Params>[] =>
  toDndColumns(
    nodes.children,
    nodes.index,
    nodes.sIndex,
    args.rootDeleted,
    args.rootId,
    args.showDeleted,
  );
