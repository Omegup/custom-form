import type { ReactNode } from "react";
import "./pulse.css";

export const PulseRow = ({
  focused,
  children,
}: {
  focused: boolean | null;
  children: ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      gap: 10,
      animation: focused === null ? undefined : `pulse${focused ? 1 : 2} .2s 2`,
    }}
  >
    {children}
  </div>
);
