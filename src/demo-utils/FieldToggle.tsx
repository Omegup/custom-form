import type { ReactNode } from "react";
import { CheckboxLabel } from "./CheckboxLabel";

export const FieldToggle = ({
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
    fontSize={13}
    gap={8}
    marginTop={4}
    color={null}
  >
    {children}
  </CheckboxLabel>
);
