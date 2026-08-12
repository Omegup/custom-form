/**
 * Drop → flat list write-back — school `FlatDnd.tsx`'s `setCleanNodes`
 * (`setNodes(cleanNodes(tree, nodes))`), generalized to `toDndTree` →
 * `applyDrop` → `cleanNodes` → `edit.setNodes`. The one call a host `onDrop`
 * handler needs; no React.
 */
import type { DropTarget, ParamsDom, RecursiveEditManager, SectionDom } from "./_deps";
import { applyDrop } from "./_deps";
import { cleanNodes } from "./cleanNodes";
import { toDndTree } from "./toDndTree";

export const commitDrop = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  edit: RecursiveEditManager<TypeNames, Params, SectionConfig>,
  args: { draggedId: string; target: DropTarget; showDeleted: boolean },
): void => {
  const tree = toDndTree(edit.nodes, {
    rootId: edit.item.id,
    rootDeleted: edit.item.deleted,
    showDeleted: args.showDeleted,
  });
  const dropped = applyDrop(tree, args.draggedId, args.target);
  edit.setNodes({ ...edit.nodes, children: cleanNodes(dropped) });
};
