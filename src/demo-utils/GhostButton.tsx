import type { ReactNode } from "react";

export const GhostButton = ({
  onClick,
  label,
  margin,
  children,
}: {
  onClick: () => void;
  label: string;
  margin: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    style={{
      margin,
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "#666",
      fontSize: 16,
      lineHeight: 1,
    }}
  >
    {children}
  </button>
);
