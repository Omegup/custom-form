import type { ReactNode } from "react";
import { FormStack } from "./FormStack";

export const FormColumn = ({ children }: { children: ReactNode }) => (
  <FormStack maxWidth={700}>{children}</FormStack>
);
