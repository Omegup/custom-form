import type { ReactNode } from "react";

export const ColumnRow = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 12,
      flex: 1,
      minWidth: 0,
    }}
  >
    {children}
  </div>
);
