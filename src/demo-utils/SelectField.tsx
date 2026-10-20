import { FieldError } from "./FieldError";

export const SelectField = ({
  label,
  value,
  error,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: number;
  error: string | null;
  placeholder: string;
  options: readonly { index: number; title: string }[];
  onChange: (index: number) => void;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        padding: "6px 8px",
        borderRadius: 4,
        border: `1px solid ${error ? "#c00" : "#ccc"}`,
      }}
    >
      <option value={-1} disabled>
        {placeholder}
      </option>
      {options.map(({ index, title }) => (
        <option key={index} value={index}>
          {title}
        </option>
      ))}
    </select>
    {error ? <FieldError>{error}</FieldError> : null}
  </label>
);
