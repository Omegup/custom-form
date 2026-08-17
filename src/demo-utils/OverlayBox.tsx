import type { ReactNode } from "react";

export const OverlayBox = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      marginTop: 16,
      padding: 12,
      border: "1px solid #ddd",
      borderRadius: 6,
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      gap: 8,
    }}
  >
    {children}
  </div>
);
