import type { ReactNode } from "react";
import { Stack } from "./Stack";

export const BlockStack = ({ children }: { children: ReactNode }) => (
  <Stack gap={12}>{children}</Stack>
);
