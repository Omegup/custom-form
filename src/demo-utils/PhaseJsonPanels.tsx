import type { CSSProperties } from "react";

const jsonPanelStyle = (active: boolean): CSSProperties => ({
  flex: 1,
  minWidth: 0,
  margin: 0,
  padding: 10,
  background: active ? "#eef4fb" : "#f6f7f9",
  border: active ? "1px solid #1a5fb4" : "1px solid #e0e0e0",
  borderRadius: 6,
  fontSize: 11,
  overflow: "auto",
  maxHeight: 260,
  lineHeight: 1.4,
});

export const PhaseJsonPanels = ({
  heading,
  activeId,
  panels,
}: {
  heading: string;
  activeId: string;
  panels: readonly { id: string; title: string; value: unknown }[];
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: "#444",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      }}
    >
      {heading}
    </div>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))`,
        gap: 10,
      }}
    >
      {panels.map((p) => {
        const active = p.id === activeId;
        return (
          <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                color: active ? "#1a5fb4" : "#666",
              }}
            >
              {p.title}
              {active ? " · active" : ""}
            </div>
            <pre style={jsonPanelStyle(active)}>
              {JSON.stringify(p.value, null, 2)}
            </pre>
          </div>
        );
      })}
    </div>
  </div>
);
