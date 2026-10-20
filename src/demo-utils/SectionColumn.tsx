import type { ReactNode } from "react";

export const SectionColumn = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      padding: "6px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
      flex: 1,
      minWidth: 0,
    }}
  >
    {children}
  </div>
);
