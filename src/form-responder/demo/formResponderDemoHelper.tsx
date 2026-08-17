import type { ReactNode } from "react";
import { flatFromFieldSections } from "../../form-dialogs/demo/formDialogsDemoFlat";
import {
  FormContainer,
  PhaseTabs,
  sectionChrome,
  useFieldMethods,
  type PhaseTab,
} from "../../section-responder/demo/sectionResponderDemoHelper";
import formResponderDemoSource from "./FormResponderDemo.tsx?raw";
import formResponderDemoTypesSource from "./formResponderDemoTypes.t.ts?raw";
import type * as types from "./formResponderDemoTypes.t";
import * as lib from "./library";

export { FormContainer, PhaseTabs, useFieldMethods };

export const FormTitle = ({
  header,
  note,
}: {
  header: lib.FormHeader;
  note: ReactNode | null;
}) => (
  <div style={{ marginBottom: 4 }}>
    <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>
      {header.title}
    </h2>
    {header.description ? (
      <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{header.description}</p>
    ) : null}
    {note}
  </div>
);

export const PHASES: PhaseTab<types.DemoPhase>[] = [
  {
    id: "design",
    label: "1. Design",
    blurb: "Same editor as form-dialogs — library, add/edit, drag-and-drop.",
  },
  {
    id: "fill",
    label: "2. Fill",
    blurb: "Student answers every section, then Validate.",
  },
];

/** Demo HTML chrome for `CustomFormResponderHOC` — section slots come from `sectionChrome`. */
export const formChrome: lib.FormResponderChrome = {
  ...sectionChrome,
  renderHeader: (header) => <FormTitle header={header} note={null} />,
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

export const INITIAL_FLAT = flatFromFieldSections(INITIAL_SECTIONS);

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
