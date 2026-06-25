import type { ReactNode } from "react";
import formItemEditorDemoSource from "./FormItemEditorDemo.tsx?raw";
import formItemEditorDemoTypesSource from "./formItemEditorDemoTypes.t.ts?raw";

export type { StoryArgs } from "./formItemEditorDemoTypes.t";

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_ITEM_EDITOR_DEMO_SOURCE = [
  withFileHeader("formItemEditorDemoTypes.t.ts", formItemEditorDemoTypesSource),
  "",
  withFileHeader("FormItemEditorDemo.tsx", formItemEditorDemoSource),
].join("\n");

// ── Layout chrome (not part of the form-item-editor API) ──────────────────────

export const EditorDialog = ({
  title,
  onCancel,
  onSave,
  saveError,
  children,
}: {
  title: string;
  onCancel: () => void;
  onSave: () => void;
  saveError: string | null;
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
    <div
      style={{
        padding: "8px 12px",
        background: "#d4e9f7",
        fontSize: 13,
      }}
    >
      <strong>{title}</strong>
    </div>
    <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
      {children}
      {saveError && (
        <p style={{ margin: 0, color: "#c00", fontSize: 12 }}>{saveError}</p>
      )}
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

export const NameField = ({
  value,
  error,
  onChange,
}: {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, opacity: 0.7 }}>Name</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "6px 8px",
        borderRadius: 4,
        border: `1px solid ${error ? "#c00" : "#ccc"}`,
      }}
    />
    {error && <span style={{ color: "#c00", fontSize: 12 }}>{error}</span>}
  </label>
);

const MAX_NAME_LEN = 10;

/** Companion UI rendered through the editor `render()` slot. */
export const NameLengthHint = ({ name }: { name: string }) => (
  <p style={{ margin: 0, fontSize: 11, opacity: name.length > MAX_NAME_LEN ? 1 : 0.55 }}>
    {name.length}/{MAX_NAME_LEN} characters
    {name.length > MAX_NAME_LEN ? " — too long" : ""}
  </p>
);

export { MAX_NAME_LEN };
