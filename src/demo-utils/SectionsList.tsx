import type { ReactNode } from "react";
import { Stack } from "./Stack";

export const SectionsList = ({ children }: { children: ReactNode }) => (
  <Stack gap={8}>{children}</Stack>
);
