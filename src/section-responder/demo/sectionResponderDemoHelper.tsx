import { useImperativeHandle, type ReactNode } from "react";
import sectionResponderDemoSource from "./SectionResponderDemo.tsx?raw";
import sectionResponderDemoTypesSource from "./sectionResponderDemoTypes.t.ts?raw";
import type * as types from "./sectionResponderDemoTypes.t";
import * as lib from "./library";

export const FormContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 520, margin: "0 auto" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    {children}
  </div>
);

/** Demo HTML chrome for `SectionResponderHOC` — not part of the library. */
export const sectionChrome: lib.SectionResponderChrome = {
  renderSection: ({ deleted, title, description, i, multiSection, columns }) => (
    <div style={{ marginBottom: 20, opacity: deleted ? 0.5 : 1 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>
          {multiSection ? `${i + 1}. ${title}` : title}
        </h3>
        {description ? (
          <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{description}</p>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {columns.map((col, idx) => (
          <div
            key={idx}
            style={{ display: "flex", flexDirection: "column", gap: 12 }}
          >
            {col}
          </div>
        ))}
      </div>
    </div>
  ),
  renderItemShell: ({ children, onActivate }) => (
    <div onClick={onActivate}>{children}</div>
  ),
  renderClearIcon: (onClear) => (
    <button
      type="button"
      aria-label="Clear draft answer"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      style={{
        margin: "0 4px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        color: "#666",
        fontSize: 16,
        lineHeight: 1,
      }}
    >
      ×
    </button>
  ),
  renderAppendix: (comment) => (
    <div
      style={{
        marginTop: 4,
        padding: 8,
        background: "#fff3cd",
        borderLeft: "4px solid #ffc107",
        color: "#856404",
        fontSize: 12,
      }}
    >
      {comment}
    </div>
  ),
  renderFollowUpGroup: ({ items }) => items,
};

const field = (
  id: string,
  name: string,
  required: boolean,
): types.ListItem => ({
  header: lib.branded({
    id,
    type: "field",
    deleted: false,
    params: { name, required },
  }),
  meta: {},
  children: [],
});

export const INITIAL_SECTION: types.ListSection = {
  meta: { index: 0, total: 3 },
  header: {
    id: "s1",
    deleted: false,
    title: "Personal",
    description: "Fill the fields below, then Validate.",
  },
  items: [[field("name", "Full name", true), field("note", "Note (optional)", false)]],
};

export const INITIAL_RESPONSES: Record<string, lib.Response> = {};

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const SECTION_RESPONDER_DEMO_SOURCE = [
  withFileHeader(
    "section-responder/demo/sectionResponderDemoTypes.t.ts",
    sectionResponderDemoTypesSource,
  ),
  withFileHeader(
    "section-responder/demo/SectionResponderDemo.tsx",
    sectionResponderDemoSource,
  ),
].join("\n\n");

export const useFieldMethods = (
  impRef: types.FieldExtra["impRef"],
  response: lib.ResponseSetter,
  required: boolean,
  label: string,
) => {
  useImperativeHandle(impRef, () => ({
    validate: (value) => {
      const text = value.data.value?.trim() ?? "";
      if (required && !text) return `${label} is required`;
      return null;
    },
    update: (value) => value ?? lib.emptyResponse(),
  }));

  const setDataValue = (text: string) => {
    response.setValue?.("data", { ...response.value.data, value: text });
  };

  return { setDataValue, value: response.value.data.value ?? "" };
};
