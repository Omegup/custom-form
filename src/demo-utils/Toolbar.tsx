import type { ReactNode } from "react";

export const Toolbar = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      alignItems: "center",
      fontSize: 14,
    }}
  >
    {children}
  </div>
);
