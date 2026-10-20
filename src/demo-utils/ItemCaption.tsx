import type { ReactNode } from "react";
import { Inline } from "./Inline";

export const ItemCaption = ({
  badge,
  children,
}: {
  badge: ReactNode;
  children: ReactNode;
}) => (
  <Inline gap={6} align="center">
    {children}
    {badge}
  </Inline>
);
