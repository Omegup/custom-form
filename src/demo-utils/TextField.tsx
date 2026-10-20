export const TextField = ({
  label,
  value,
  error,
  multiline,
  onChange,
}: {
  label: string;
  value: string;
  error: string | null;
  multiline: boolean;
  onChange: (value: string) => void;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, opacity: 0.7 }}>{label}</span>
    {multiline ? (
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "6px 8px",
          borderRadius: 4,
          border: `1px solid ${error ? "#c00" : "#ccc"}`,
          resize: "vertical",
        }}
      />
    ) : (
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "6px 8px",
          borderRadius: 4,
          border: `1px solid ${error ? "#c00" : "#ccc"}`,
        }}
      />
    )}
    {error && <span style={{ color: "#c00", fontSize: 12 }}>{error}</span>}
  </label>
);
