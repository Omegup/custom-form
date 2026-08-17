import type { ReactNode } from "react";

export const TextButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);
