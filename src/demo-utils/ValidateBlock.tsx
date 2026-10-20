import type { ReactNode } from "react";
import { Stack } from "./Stack";
import { StartButton } from "./StartButton";

export const ValidateBlock = ({
  onValidate,
  children,
}: {
  onValidate: () => void;
  children: ReactNode;
}) => (
  <Stack gap={16}>
    {children}
    <StartButton onClick={onValidate}>Validate</StartButton>
  </Stack>
);
