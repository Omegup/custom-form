import type { ReactNode } from "react";
import { CheckboxLabel } from "./CheckboxLabel";

export const QuietCheck = ({
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
    fontSize={11}
    gap={4}
    marginTop={0}
    color="#666"
  >
    {children}
  </CheckboxLabel>
);
