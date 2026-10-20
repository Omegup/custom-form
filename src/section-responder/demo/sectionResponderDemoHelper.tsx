import { withFileHeader, ClearIcon, type PhaseTab, RemarkCard, SectionFrame } from "../../demo-utils";
import sectionResponderDemoSource from "./SectionResponderDemo.tsx?raw";
import sectionResponderDemoTypesSource from "./sectionResponderDemoTypes.t.ts?raw";
import type * as types from "./sectionResponderDemoTypes.t";
import * as lib from "./library";

export { SectionFrame };

export const PHASES: PhaseTab<types.DemoPhase>[] = [
  {
    id: "design",
    label: "1. Design",
    blurb: "Same editor as form-dialogs — library, add/edit, drag-and-drop.",
  },
  {
    id: "fill",
    label: "2. Fill",
    blurb: "Student answers this section, then Validate.",
  },
];

export const sectionChrome: lib.SectionResponderChrome = {
  renderSection: (args) => <SectionFrame {...args} note={null} />,
  renderClearIcon: (onClear) => <ClearIcon onClick={onClear} />,
  renderAppendix: (comment) => <RemarkCard>{comment}</RemarkCard>,
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

export const INITIAL_FLAT = lib.flattenSections([INITIAL_SECTION]);

export const INITIAL_RESPONSES: Record<string, lib.Response> = {};


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
