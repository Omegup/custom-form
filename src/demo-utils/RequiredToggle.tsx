import { FieldToggle } from "./FieldToggle";

export const RequiredToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (required: boolean) => void;
}) => (
  <FieldToggle checked={checked} onChange={onChange}>
    Required
  </FieldToggle>
);
