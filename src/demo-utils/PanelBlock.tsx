import type { ReactNode } from "react";
import { PanelName } from "./PanelName";
import { Stack } from "./Stack";
import { StartButton } from "./StartButton";

export const PanelBlock = ({
  name,
  add,
  children,
}: {
  name: string;
  add: (() => void) | null;
  children: ReactNode;
}) => (
  <Stack gap={8}>
    <PanelName>{name}</PanelName>
    {children}
    {add ? <StartButton onClick={add}>+ Add</StartButton> : null}
  </Stack>
);
