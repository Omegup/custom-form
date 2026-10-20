import type { ReactNode } from "react";

export const CornerSlot = ({ children }: { children: ReactNode }) => (
  <div style={{ position: "absolute", top: 0, right: 0 }}>{children}</div>
);
