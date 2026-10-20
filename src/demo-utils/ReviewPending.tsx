import { CheckboxLabel } from "./CheckboxLabel";

export const ReviewPending = ({
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
    Review round pending (highlight status)
  </CheckboxLabel>
);
