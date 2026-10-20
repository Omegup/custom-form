import type { ReactNode } from "react";

export const AccentField = ({
  padding,
  border,
  label,
  children,
}: {
  padding: number;
  border: string;
  label: ReactNode | null;
  children: ReactNode;
}) =>
  label === null ? (
    children
  ) : (
    <label
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding,
        borderLeft: `3px solid ${border}`,
      }}
    >
      <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span>
      {children}
    </label>
  );
