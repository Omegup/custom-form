import type { ReactNode } from "react";

export const SendButton = ({
  onClick,
  enabled,
  children,
}: {
  onClick: () => void;
  enabled: boolean;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!enabled}
    style={{
      background: enabled ? "#1a5fb4" : "#9aa7b8",
      color: "#fff",
      border: "none",
      padding: "6px 14px",
      borderRadius: 4,
      cursor: enabled ? "pointer" : "not-allowed",
      fontWeight: 600,
    }}
  >
    {children}
  </button>
);
