import type { ReactNode } from "react";

export const QuietButton = ({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string | null;
  children: ReactNode;
}) => (
  <button
    type="button"
    aria-label={label ?? undefined}
    onClick={onClick}
    style={{ fontSize: 12, opacity: 0.75 }}
  >
    {children}
  </button>
);
