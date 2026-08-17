import type { ReactNode } from "react";

export const DisplayColumns = ({
  gap,
  columns,
}: {
  gap: number;
  columns: ReactNode[];
}) => (
  <div style={{ display: "flex", gap }}>
    {columns.map((col, i) => (
      <div key={i} style={{ flex: 1, minWidth: 0 }}>
        {col}
      </div>
    ))}
  </div>
);
