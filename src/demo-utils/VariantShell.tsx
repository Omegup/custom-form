import type { CSSProperties, ReactNode } from "react";

export const VariantShell = ({
  shell,
  children,
}: {
  shell: CSSProperties;
  children: ReactNode;
}) => <div style={shell}>{children}</div>;
