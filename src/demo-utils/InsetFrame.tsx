import type { ReactNode } from "react";
import { BorderedStack } from "./BorderedStack";

export const InsetFrame = ({ children }: { children: ReactNode }) => (
  <BorderedStack gap={8} padding={8}>
    {children}
  </BorderedStack>
);
