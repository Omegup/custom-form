import type { ReactNode } from "react";

export const DropdownMenu = ({
  open,
  trigger,
  align,
  children,
}: {
  open: boolean;
  trigger: ReactNode;
  align: "start" | "end";
  children: ReactNode;
}) => (
  <div style={{ position: "relative", display: "inline-flex" }}>
    {trigger}
    {open ? (
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: align === "start" ? 0 : "auto",
          right: align === "end" ? 0 : "auto",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minWidth: 140,
          padding: 6,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {children}
      </div>
    ) : null}
  </div>
);
