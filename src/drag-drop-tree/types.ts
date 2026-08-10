/**
 * School `components/drag-drop-tree/src/types.ts` — tree shape + React DnD
 * contract. `Theme` comes from `./theme` (school's `school-style` stand-in).
 */
import type { ReactNode, RefObject } from "react";
import type { CommonTreeNodeProps } from "./Components/TreeNode/types";
import type { Theme } from "./theme";

export type TreeNode<T> = T & {
  _id: string;
  isExpanded?: boolean;
  children: TreeNode<T>[];
  parentId?: string | null;
};

export type DropPosition = "inside" | "before" | "after" | null;

/** Concrete drop target for `insertNode` / `applyDrop`. */
export type DropTarget = { _id: string; position: DropPosition };

export type Direction = "up" | "down";

export type DnDTreeCoreProps<T> = {
  nodes: TreeNode<T>[];
  setNodes: (arg: TreeNode<T>[] | ((prev: TreeNode<T>[]) => TreeNode<T>[])) => void;
  handlersRef: RefObject<Handlers<T> | undefined>;
  renderComponent: (args: CommonTreeNodeProps<T> & { key: string }) => ReactNode;
};

export type DnDTreeProps<T, Ctx> = {
  ctx: { theme: Theme } & Ctx;
  nodes: TreeNode<T>[];
  setNodes: (arg: TreeNode<T>[] | ((prev: TreeNode<T>[]) => TreeNode<T>[])) => void;
  renderItem: RenderItem<T, Ctx>;
  handlersRef: RefObject<Handlers<T> | undefined>;
};

export type RenderItem<
  T,
  Ctx,
  State = {
    isSelected: boolean;
    isOver: boolean;
    isHovered: boolean;
  },
> = (props: {
  node: TreeNode<T>;
  ord: number;
  handlersRef: RefObject<Handlers<T> | undefined>;
  state: State;
  actions: {
    toggleExpand: (_id: string) => void;
    onUp: (_id: string) => void;
    onDown: (_id: string) => void;
  };
  ctx: { theme: Theme } & Ctx;
}) => ReactNode;

export type Handlers<T> = {
  handleUpdateNode: (updatedNode: TreeNode<T>) => void;
  handleAddChild: (parentId: string, newNode: TreeNode<T>) => void;
  removeNode: (nodes: TreeNode<T>[], nodeId: string) => TreeNode<T>[];
  updateNodes: (arg: TreeNode<T>[] | ((prev: TreeNode<T>[]) => TreeNode<T>[])) => void;
  insertNodeIn: (
    nodes: TreeNode<T>[],
    insertedNode: TreeNode<T>,
    parentId: string | null,
  ) => TreeNode<T>[];
  applyToAllNodes: (fn: (node: TreeNode<T>) => TreeNode<T>) => void;
};
