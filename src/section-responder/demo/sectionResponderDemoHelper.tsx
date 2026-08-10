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

/** Registers validate/update on the viewer's internal impRef. */
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
