import type { ReactNode } from "react";

/** Button that sits at the start of a column (Validate, + Add). */
export const StartButton = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) => (
  <button type="button" onClick={onClick} style={{ alignSelf: "flex-start" }}>
    {children}
  </button>
);
