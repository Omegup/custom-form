import type { ReactNode } from "react";

export const StrikeLabel = ({
  strike,
  children,
}: {
  strike: boolean;
  children: ReactNode;
}) => (
  <span style={{ textDecoration: strike ? "line-through" : "", flex: 1 }}>
    {children}
  </span>
);
