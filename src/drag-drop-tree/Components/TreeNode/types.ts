import type { DragEvent, ReactNode, RefObject } from "react";
import type { DropPosition, Handlers, RenderItem, TreeNode } from "../../types";

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

/** Headless node — host supplies chrome via render props. */
export type TreeNodeCoreProps<T, Ctx> = CommonTreeNodeProps<T> & {
  ctx: Ctx;
  renderItem: RenderItem<T, Ctx, State>;
  renderDraggable: (args: DraggableArgs<T>) => ReactNode;
  topThreshold: number;
  bottomThreshold: number;
  renderChildren: (children: ReactNode, node: TreeNode<T>) => ReactNode;
  renderIndicator: (where: "before" | "after" | null) => ReactNode;
};
