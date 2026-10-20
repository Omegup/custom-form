export const SelectColumns = ({
  cols,
  onChange,
  options,
  legend,
}: {
  cols: number;
  onChange: (cols: number) => void;
  options: readonly number[];
  legend: string;
}) => (
  <fieldset
    style={{
      margin: 0,
      padding: "8px 10px",
      border: "1px solid #ccc",
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <legend style={{ fontSize: 12, opacity: 0.7, padding: "0 4px" }}>
      {legend}
    </legend>
    <div style={{ display: "flex", gap: 8 }}>
      {options.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            flex: 1,
            padding: "8px 6px",
            borderRadius: 4,
            border: `2px solid ${cols === n ? "#3b82f6" : "#ccc"}`,
            background: cols === n ? "#eff6ff" : "white",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${n}, 1fr)`,
              gap: 3,
              height: 28,
              marginBottom: 4,
            }}
          >
            {Array.from({ length: n }, (_, i) => (
              <div
                key={i}
                style={{
                  background: cols === n ? "#93c5fd" : "#e5e7eb",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 11 }}>
            {n} column{n > 1 ? "s" : ""}
          </span>
        </button>
      ))}
    </div>
    <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>
      Decreasing columns merges trailing slots into the last column.
    </p>
  </fieldset>
);
