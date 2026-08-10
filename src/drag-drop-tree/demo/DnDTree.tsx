/**
 * School `DnDTree` convenience wrap — HTML `TreeNodeComponent` over headless core.
 * Demo / host only.
 */
import type { ReactNode, RefObject } from "react";
import { DnDTreeCore, type Handlers, type RenderItem, type TreeNode } from "..";
import { TreeNodeComponent } from "./TreeNodeComponent";
import type { Theme } from "./theme";

export type DnDTreeProps<T, Ctx> = {
  ctx: { theme: Theme } & Ctx;
  nodes: TreeNode<T>[];
  setNodes: (arg: TreeNode<T>[] | ((prev: TreeNode<T>[]) => TreeNode<T>[])) => void;
  renderItem: RenderItem<T, { theme: Theme } & Ctx>;
  handlersRef: RefObject<Handlers<T> | undefined>;
};

export const DnDTree = <T, Ctx>({
  ctx,
  nodes,
  setNodes,
  renderItem,
  handlersRef,
}: DnDTreeProps<T, Ctx>): ReactNode => (
  <DnDTreeCore<T>
    nodes={nodes}
    setNodes={setNodes}
    handlersRef={handlersRef}
    renderComponent={({ key, ...props }) => (
      <TreeNodeComponent key={key} {...props} renderItem={renderItem} ctx={ctx} />
    )}
  />
);
