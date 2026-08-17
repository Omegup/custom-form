import type { ReactNode } from "react";

export const CatalogButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      fontSize: 13,
      textAlign: "left",
      background: "white",
      border: "1px solid #eee",
      borderRadius: 4,
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);
