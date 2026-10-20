import { CheckboxLabel } from "./CheckboxLabel";

export const ShowDeleted = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <CheckboxLabel
    checked={checked}
    onChange={onChange}
    fontSize={14}
    gap={6}
    marginTop={0}
    color={null}
  >
    Show deleted
  </CheckboxLabel>
);
