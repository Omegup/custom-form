import type { ReactNode } from "react";

/** Vertical flex stack. `gap` is required — demos do not pass `style`. */
export const Stack = ({
  gap,
  children,
}: {
  gap: number;
  children: ReactNode;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap }}>{children}</div>
);
