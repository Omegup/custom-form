import type { ReactNode } from "react";

export const EmptyNotice = ({ children }: { children: ReactNode }) => (
  <p style={{ margin: 0, fontSize: 14, color: "#a40" }}>{children}</p>
);
