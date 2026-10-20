import type { ReactNode } from "react";

export const AppendixStack = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: 4,
    }}
  >
    {children}
  </div>
);
