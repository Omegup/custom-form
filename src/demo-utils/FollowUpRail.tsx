import type { ReactNode } from "react";

export const FollowUpRail = ({
  border,
  background,
  label,
  children,
}: {
  border: string;
  background: string;
  label: string | null;
  children: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: 8,
      marginLeft: 8,
      padding: "8px 8px 8px 12px",
      borderLeft: `3px solid ${border}`,
      background,
      borderRadius: "0 6px 6px 0",
    }}
  >
    {label ? (
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#b45309",
        }}
      >
        {label}
      </div>
    ) : null}
    {children}
  </div>
);
