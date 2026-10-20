import type { ReactNode } from "react";

export const Inline = ({
  gap,
  align,
  children,
}: {
  gap: number;
  align: "center" | "start";
  children: ReactNode;
}) => (
  <span
    style={{
      display: "inline-flex",
      gap,
      alignItems: align === "start" ? "flex-start" : "center",
    }}
  >
    {children}
  </span>
);
