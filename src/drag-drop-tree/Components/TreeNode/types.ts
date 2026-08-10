import type { DragEvent, ReactNode, RefObject } from "react";
import type { DropPosition, Handlers, RenderItem, TreeNode } from "../../types";
import type { Theme } from "../../theme";

export type CommonTreeNodeProps<T> = {
  ord: number;
  node: TreeNode<T>;
  toggleExpand: (_id: string) => void;
  draggedId: string | null;
  dropTarget: { _id: string; position: DropPosition } | null;
  onDragStart: (_id: string) => void;
  onDragEnd: () => void;
  onDragOver: (_id: string, pos: DropPosition) => void;
  onDrop: () => void;
  onDragLeave: (e: DragEvent) => void;
  onUp: (_id: string) => void;
  onDown: (_id: string) => void;
  draggedSubtreeIds: string[];
  handlersRef: RefObject<Handlers<T> | undefined>;
};

export type TreeNodeProps<T, Ctx> = CommonTreeNodeProps<T> & {
  ctx: { theme: Theme } & Ctx;
  renderItem: RenderItem<T, Ctx>;
};

type State = { isSelected: boolean; isOver: boolean; dragging: boolean };

export type DraggableArgs<T> = {
  onDragStart: (e: DragEvent) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: () => void;
  onDragEnter: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  header: ReactNode;
  children: ReactNode;
  state: State;
  node: TreeNode<T>;
  ord: number;
};

export type TreeNodeCoreProps<T, Ctx> = CommonTreeNodeProps<T> & {
  ctx: { theme: Theme } & Ctx;
  renderItem: RenderItem<T, Ctx, State>;
  renderDraggable: (args: DraggableArgs<T>) => ReactNode;
  topThreshold: number;
  bottomThreshold: number;
  renderChildren: (children: ReactNode, node: TreeNode<T>) => ReactNode;
  renderIndicator: (where: "before" | "after" | null) => ReactNode;
};
