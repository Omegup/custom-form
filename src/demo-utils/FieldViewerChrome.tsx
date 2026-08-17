import type { CSSProperties, ReactNode } from "react";
import { RequiredMark } from "./RequiredMark";

/** Shared fill/review field stack — name row, value children, appendix outside the shell. */
export const FieldViewerChrome = ({
  name,
  required,
  badge,
  icon,
  appendix,
  shell,
  nameStyle,
  children,
}: {
  name: ReactNode;
  required: boolean;
  badge: ReactNode;
  icon: ReactNode | null;
  appendix: ReactNode | null;
  shell: CSSProperties;
  nameStyle: CSSProperties | null;
  children: ReactNode;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...shell }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          ...nameStyle,
        }}
      >
        {name}
        <RequiredMark required={required} />
        {badge}
        {icon}
      </span>
      {children}
    </div>
    {appendix}
  </div>
);
