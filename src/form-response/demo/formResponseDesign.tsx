/** Design blueprint — field labels only; editing lives in form-dialogs. */
import { INITIAL_HEADER } from "./formResponseDemoHelper";
import type * as types from "./formResponseDemoTypes.t";

export const DesignPhase = ({ sections }: { sections: types.ListSection[] }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    <div>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>
        {INITIAL_HEADER.title}
      </h2>
      {INITIAL_HEADER.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
          {INITIAL_HEADER.description}
        </p>
      ) : null}
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 12,
          color: "#888",
          fontStyle: "italic",
        }}
      >
        Design blueprint — field labels and required flags only.
      </p>
    </div>
    {sections.map((section, i) => (
      <div
        key={section.header.id}
        style={{
          opacity: section.header.deleted ? 0.5 : 1,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 4px", fontSize: 17, fontWeight: 600 }}>
            {i + 1}. {section.header.title}
            {section.header.deleted ? " (deleted)" : ""}
          </h3>
          {section.header.description ? (
            <p style={{ margin: 0, color: "#555", fontSize: 13 }}>
              {section.header.description}
            </p>
          ) : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {section.items.flat().map(({ header: q }) => (
            <div
              key={q.id}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: 8,
                background: "#fafafa",
                borderRadius: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600 }}>
                {q.params.name}
                {q.params.required ? (
                  <span style={{ color: "#b00020", marginLeft: 4 }}>*</span>
                ) : null}
              </span>
              <span style={{ fontSize: 12, color: "#888" }}>
                id: {q.id}
                {q.deleted ? " · deleted" : ""} · type: {q.type}
              </span>
              <div
                style={{
                  height: 28,
                  borderRadius: 3,
                  border: "1px dashed #ccc",
                  background: "#fff",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
