import type { ReactNode } from "react";

export const FormStack = ({
  maxWidth,
  children,
}: {
  maxWidth: number | null;
  children: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 20,
      maxWidth: maxWidth ?? undefined,
    }}
  >
    {children}
  </div>
);
