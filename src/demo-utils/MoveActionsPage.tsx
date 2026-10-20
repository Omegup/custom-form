import type { ReactNode } from "react";
import { DemoPage } from "./DemoPage";
import { Stack } from "./Stack";

export const MoveActionsPage = ({ children }: { children: ReactNode }) => (
  <DemoPage title="Move actions">
    <Stack gap={8}>{children}</Stack>
  </DemoPage>
);
