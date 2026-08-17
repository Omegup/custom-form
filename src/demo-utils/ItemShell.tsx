import type { ReactNode } from "react";

/** Review item layout: viewer plus an absolute follow-up action. */
export const ItemShell = ({
  children,
  action,
}: {
  children: ReactNode;
  action: ReactNode;
}) => (
  <div style={{ position: "relative", padding: "4px 28px 4px 0" }}>
    {children}
    {action}
  </div>
);
