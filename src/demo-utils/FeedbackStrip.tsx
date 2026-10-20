import type { ReactNode } from "react";

export const FeedbackStrip = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center",
      padding: "10px 12px",
      background: "#f6f7f9",
      borderRadius: 6,
      fontSize: 13,
    }}
  >
    {children}
  </div>
);
