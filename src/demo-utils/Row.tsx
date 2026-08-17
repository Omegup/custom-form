import type { ReactNode } from "react";

export const Row = ({
  gap,
  align,
  wrap,
  fontSize,
  children,
}: {
  gap: number;
  align: "center" | "start" | "end" | "stretch";
  wrap: boolean;
  fontSize: number | null;
  children: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap,
      alignItems:
        align === "start"
          ? "flex-start"
          : align === "end"
            ? "flex-end"
            : align,
      flexWrap: wrap ? "wrap" : "nowrap",
      fontSize: fontSize ?? undefined,
    }}
  >
    {children}
  </div>
);
