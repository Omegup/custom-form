import type { HTMLAttributes, ReactNode } from "react";

export const DragItem = ({
  enabled,
  children,
  ...handlers
}: {
  enabled: boolean;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) => (
  <div draggable={enabled} {...handlers}>
    {children}
  </div>
);
