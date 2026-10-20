export const BoxedInput = ({
  value,
  onChange,
  disabled,
  border,
  background,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  border: string;
  background: string;
}) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={disabled}
    style={{
      padding: "6px 8px",
      border: `1px solid ${border}`,
      borderRadius: 4,
      background,
    }}
  />
);
