import type { ReactNode } from "react";

export const BorderedStack = ({
  gap,
  padding,
  children,
}: {
  gap: number;
  padding: number;
  children: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap,
      border: "1px solid #ccc",
      padding,
    }}
  >
    {children}
  </div>
);
