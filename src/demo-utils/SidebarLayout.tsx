import type { ReactNode } from "react";

export const SidebarLayout = ({
  main,
  sidebar,
}: {
  main: ReactNode;
  sidebar: ReactNode;
}) => (
  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
    <div
      style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
    >
      {main}
    </div>
    {sidebar}
  </div>
);
