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
  muted,
  emphasis,
  children,
}: {
  name: ReactNode;
  required: boolean;
  badge: ReactNode;
  icon: ReactNode | null;
  appendix: ReactNode | null;
  shell: CSSProperties;
  muted: boolean;
  emphasis: boolean;
  children: ReactNode;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 4, ...shell }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontWeight: emphasis ? 700 : 400,
          color: muted ? "#777" : undefined,
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
