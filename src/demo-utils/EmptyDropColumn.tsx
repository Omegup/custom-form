import type { HTMLAttributes, ReactNode } from "react";

export const EmptyDropColumn = ({
  children,
  ...drag
}: {
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) => (
  <div
    {...drag}
    style={{
      minHeight: 28,
      border: "2px dashed #d5d8dd",
      borderRadius: 4,
      flex: 1,
      minWidth: 0,
    }}
  >
    {children}
  </div>
);
