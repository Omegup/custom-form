import type { ReactNode } from "react";

export const IconButton = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    style={{
      border: "none",
      background: "transparent",
      cursor: "pointer",
      fontSize: 14,
      lineHeight: 1,
    }}
  >
    {children}
  </button>
);
