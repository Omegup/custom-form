import type { ReactNode } from "react";
import { CheckboxLabel } from "./CheckboxLabel";

export const ToolbarCheck = ({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) => (
  <CheckboxLabel
    checked={checked}
    onChange={onChange}
    fontSize={14}
    gap={6}
    marginTop={0}
    color={null}
  >
    {children}
  </CheckboxLabel>
);
