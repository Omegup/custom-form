import type { ReactNode } from "react";

export const MutedWell = ({ children }: { children: ReactNode }) => (
  <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{children}</div>
);
