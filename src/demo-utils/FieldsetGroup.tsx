import type { ReactNode } from "react";
import { Stack } from "./Stack";

export const FieldsetGroup = ({
  title,
  border,
  showBorder,
  children,
}: {
  title: string;
  border: string;
  showBorder: boolean;
  children: ReactNode;
}) => (
  <fieldset
    style={{
      border: showBorder ? `1px solid ${border}` : "none",
      borderRadius: 4,
      padding: 8,
    }}
  >
    <legend>{title}</legend>
    <Stack gap={8}>{children}</Stack>
  </fieldset>
);
