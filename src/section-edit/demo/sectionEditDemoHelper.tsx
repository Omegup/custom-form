/**
 * UI chrome for the section-edit demo + Storybook docs source.
 * Dialog/field styling mirrors the form-item-editor demo helpers; the
 * column selector allows up to 3 columns (sections, unlike panels).
 */
import type { ReactNode } from "react";
import { FormContainer } from "../../form-edit/demo/editFormDemoHelper";
import sectionEditDemoSource from "./SectionEditDemo.tsx?raw";
import sectionEditDemoTypesSource from "./sectionEditDemoTypes.t.ts?raw";

export { FormContainer };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const SECTION_EDIT_DEMO_SOURCE = [
  withFileHeader("sectionEditDemoTypes.t.ts", sectionEditDemoTypesSource),
  "",
  withFileHeader("SectionEditDemo.tsx", sectionEditDemoSource),
].join("\n");

// ── Dialog chrome ─────────────────────────────────────────────────────────────

export const EditorDialog = ({
  title,
  onCancel,
  onSave,
  children,
}: {
  title: ReactNode;
  onCancel: () => void;
  onSave: () => void;
  children: ReactNode;
}) => (
  <div
    style={{
      border: "1px solid #b8d4f0",
      borderRadius: 8,
      overflow: "hidden",
      maxWidth: 360,
      background: "#e8f4fd",
      marginBottom: 12,
    }}
  >
    <div style={{ padding: "8px 12px", background: "#d4e9f7", fontSize: 13 }}>
      <strong>{title}</strong>
    </div>
    <div
      style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}
    >
      {children}
    </div>
    <div
      style={{
        display: "flex",
        gap: 8,
        justifyContent: "flex-end",
        padding: "8px 12px",
        borderTop: "1px solid #b8d4f0",
      }}
    >
      <button type="button" onClick={onCancel} style={{ padding: "4px 12px" }}>
        Cancel
      </button>
      <button type="button" onClick={onSave} style={{ padding: "4px 12px" }}>
        Save
      </button>
    </div>
  </div>
);

export const TextField = ({
  label,
  value,
  error,
  multiline = false,
  onChange,
}: {
  label: string;
  value: string;
  error: string | null;
  multiline?: boolean;
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

export const SECTION_COL_OPTIONS = [1, 2, 3] as const;

export const SelectSectionColumns = ({
  cols,
  onChange,
}: {
  cols: number;
  onChange: (cols: number) => void;
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
      Columns
    </legend>
    <div style={{ display: "flex", gap: 8 }}>
      {SECTION_COL_OPTIONS.map((n) => (
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
