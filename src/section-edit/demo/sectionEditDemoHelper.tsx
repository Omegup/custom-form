/**
 * UI chrome for the section-edit demo + Storybook docs source.
 * Dialog/field styling mirrors the form-item-editor demo helpers; the
 * column selector allows up to 3 columns (sections, unlike panels).
 */
import { EditorDialog, TextField } from "../../demo-utils";
import { FormContainer } from "../../form-edit/demo/editFormDemoHelper";
import sectionEditDemoSource from "./SectionEditDemo.tsx?raw";
import sectionEditDemoTypesSource from "./sectionEditDemoTypes.t.ts?raw";

export { FormContainer, EditorDialog, TextField };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const SECTION_EDIT_DEMO_SOURCE = [
  withFileHeader("sectionEditDemoTypes.t.ts", sectionEditDemoTypesSource),
  "",
  withFileHeader("SectionEditDemo.tsx", sectionEditDemoSource),
].join("\n");

// ── Dialog chrome ─────────────────────────────────────────────────────────────

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
