import type { ReactNode } from "react";

export const DemoPage = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div
    style={{ display: "flex", flexDirection: "column", gap: 16, padding: 16 }}
  >
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </div>
);
