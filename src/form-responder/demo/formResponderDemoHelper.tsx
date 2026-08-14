import { useImperativeHandle, type ReactNode } from "react";
import formResponderDemoSource from "./FormResponderDemo.tsx?raw";
import formResponderDemoTypesSource from "./formResponderDemoTypes.t.ts?raw";
import type * as types from "./formResponderDemoTypes.t";
import * as lib from "./library";

export const FormContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div style={{ fontFamily: "system-ui, sans-serif", maxWidth: 700, margin: "0 auto" }}>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    {children}
  </div>
);

/** Demo HTML chrome for `CustomFormResponderHOC` — not part of the library. */
export const formChrome: lib.FormResponderChrome = {
  renderHeader: (header) => (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>
        {header.title}
      </h2>
      {header.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{header.description}</p>
      ) : null}
    </div>
  ),
  renderForm: ({ header, sections, children }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 700,
      }}
    >
      {header}
      {sections}
      {children}
    </div>
  ),
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

export const INITIAL_SECTIONS: types.ListSection[] = [
  {
    meta: { index: 0, total: 3 },
    header: {
      id: "s1",
      deleted: false,
      title: "Personal",
      description: "Who you are.",
    },
    items: [[field("name", "Full name", true)]],
  },
  {
    meta: { index: 3, total: 3 },
    header: {
      id: "s2",
      deleted: false,
      title: "Notes",
      description: "Anything else.",
    },
    items: [[field("note", "Note (optional)", false)]],
  },
];

export const INITIAL_RESPONSES: Record<string, lib.Response> = {};

export const INITIAL_HEADER: lib.FormHeader = {
  title: "Application",
  description: "Fill every section, then Validate.",
};

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_RESPONDER_DEMO_SOURCE = [
  withFileHeader(
    "form-responder/demo/formResponderDemoTypes.t.ts",
    formResponderDemoTypesSource,
  ),
  withFileHeader(
    "form-responder/demo/FormResponderDemo.tsx",
    formResponderDemoSource,
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
