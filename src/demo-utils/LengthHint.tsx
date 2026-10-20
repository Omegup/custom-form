import type { ReactNode } from "react";

export const LengthHint = ({
  current,
  limit,
  emphasize,
  children,
}: {
  current: number;
  limit: number;
  emphasize: boolean;
  children: ReactNode;
}) => (
  <p style={{ margin: 0, fontSize: 11, opacity: emphasize ? 1 : 0.55 }}>
    {current}/{limit} {children}
  </p>
);
