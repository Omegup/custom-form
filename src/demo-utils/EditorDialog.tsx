import type { ReactNode } from "react";

export const EditorDialog = ({
  title,
  onCancel,
  onSave,
  saveError,
  children,
}: {
  title: ReactNode;
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
