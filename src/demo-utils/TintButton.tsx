import type { ReactNode } from "react";

export const TintButton = ({
  onClick,
  disabled,
  color,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  color: string | null;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{ color: color ?? undefined }}
  >
    {children}
  </button>
);
