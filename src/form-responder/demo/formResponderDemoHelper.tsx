import { withFileHeader, type PhaseTab, FormColumn, FormTitle } from "../../demo-utils";
import {
  sectionChrome,
} from "../../section-responder/demo/sectionResponderDemoHelper";
import formResponderDemoSource from "./FormResponderDemo.tsx?raw";
import formResponderDemoTypesSource from "./formResponderDemoTypes.t.ts?raw";
import type * as types from "./formResponderDemoTypes.t";
import * as lib from "./library";

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
  renderHeader: (header) => (
    <FormTitle title={header.title} description={header.description} note={null} />
  ),
  renderForm: ({ header, sections, children }) => (
    <FormColumn>
      {header}
      {sections}
      {children}
    </FormColumn>
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

export const INITIAL_FLAT = lib.flattenSections(INITIAL_SECTIONS);

export const INITIAL_RESPONSES: Record<string, lib.Response> = {};

export const INITIAL_HEADER: lib.FormHeader = {
  title: "Application",
  description: "Fill every section, then Validate.",
};


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
