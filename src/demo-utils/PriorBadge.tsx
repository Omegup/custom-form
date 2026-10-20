import type { ReactNode } from "react";

export const PriorBadge = ({ children }: { children: ReactNode }) => (
  <span
    title="Prior answer"
    aria-label="Prior answer"
    style={{
      marginLeft: 6,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "#6b7280",
    }}
  >
    {children}
  </span>
);
