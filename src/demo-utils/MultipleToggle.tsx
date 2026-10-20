import { FieldToggle } from "./FieldToggle";

export const MultipleToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (multiple: boolean) => void;
}) => (
  <FieldToggle checked={checked} onChange={onChange}>
    Multiple answers
  </FieldToggle>
);
