export const PlainInput = ({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: ((value: string) => void) | null;
  disabled: boolean;
}) => (
  <input
    value={value}
    onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    disabled={disabled}
  />
);
