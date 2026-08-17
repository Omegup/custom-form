import type { CSSProperties, ReactNode } from "react";

const TONE = {
  ok: { fontSize: 13, color: "#22883e" },
  quiet: { fontSize: 13, color: "#666" },
  meta: { fontSize: 13, color: "#555" },
} as const satisfies Record<string, CSSProperties>;

export const ToneNote = ({
  tone,
  children,
}: {
  tone: keyof typeof TONE;
  children: ReactNode;
}) => <span style={TONE[tone]}>{children}</span>;
