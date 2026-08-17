import type { ReactNode } from "react";
import { FormStack } from "./FormStack";

export const PhaseBody = ({ children }: { children: ReactNode }) => (
  <FormStack maxWidth={null}>{children}</FormStack>
);
