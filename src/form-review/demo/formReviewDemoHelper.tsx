import { FormTitle, type PhaseTab, ReviewStatusNote } from "../../demo-utils";
import {
  PENDING_DATE,
  SectionFrame,
  sectionChrome,
} from "../../section-review/demo/sectionReviewDemoHelper";
import formReviewDemoSource from "./FormReviewDemo.tsx?raw";
import formReviewDemoTypesSource from "./formReviewDemoTypes.t.ts?raw";
import type * as types from "./formReviewDemoTypes.t";
import * as lib from "./library";

export { PENDING_DATE };

export const PHASES: PhaseTab<types.DemoPhase>[] = [
  {
    id: "design",
    label: "1. Design",
    blurb: "Same editor as form-dialogs — library, add/edit, drag-and-drop.",
  },
  {
    id: "response",
    label: "2. Response",
    blurb: "Student fills answers (multiple panels get + Add). Reviewer comments are not applied yet.",
  },
  {
    id: "follow",
    label: "3. Follow",
    blurb:
      "Teacher reviews answers: lock/unlock comments, nested Design list under the origin (add/edit/move follow-ups), status highlighting.",
  },
];

/** Demo HTML chrome for `CustomFormReviewHOC` — item slots come from `sectionChrome`. */
export const formChrome: lib.FormReviewChrome<types.TypeNames, types.Params> = {
  ...sectionChrome,
  renderHeader: (header) => (
    <FormTitle
      title={header.title}
      description={header.description}
      note={<ReviewStatusNote />}
    />
  ),
  renderForm: ({ header, sections, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {header}
      {sections}
      {children}
    </div>
  ),
  renderSection: (args) => <SectionFrame {...args} note={null} />,
};

const field = (id: string, name: string, required: boolean): types.ListItem => ({
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
    meta: { index: 0, total: 4 },
    header: {
      id: "s1",
      deleted: false,
      title: "Personal",
      description: "Identity and contact.",
    },
    items: [
      [
        field("name", "Full name", true),
        field("email", "Email", true),
      ],
    ],
  },
  {
    meta: { index: 4, total: 3 },
    header: {
      id: "s2",
      deleted: false,
      title: "Experience",
      description: "Background the reviewer will assess.",
    },
    items: [
      [
        field("years", "Years of experience", true),
        field("summary", "Project summary", false),
      ],
    ],
  },
  {
    meta: { index: 7, total: 1 },
    header: {
      id: "s3",
      deleted: true,
      title: "Archived extras",
      description: "Deleted section — only visible when showDeleted is on.",
    },
    items: [[field("legacy", "Legacy note", false)]],
  },
];

export const INITIAL_FLAT = lib.flattenSections(INITIAL_SECTIONS);

export const INITIAL_RESPONSES: Record<string, lib.Response> = {
  name: { meta: {}, data: { value: "Ada Lovelace" } },
  email: { meta: {}, data: { value: "ada@analytical.engine" } },
  years: { meta: {}, data: { value: "12" } },
  // summary intentionally empty — reviewer will flag it
};

export const INITIAL_CHANGES: lib.AdditionalChanges<types.TypeNames, types.Params> = {
  name: {
    history: [{ date: PENDING_DATE }],
  },
  email: {
    comment: "Please use your institutional address.",
  },
  summary: {
    comment: "Add a short description of your last project.",
    formItems: [
      {
        comment: "Which stack did you use?",
        formItem: lib.branded({
          id: "summary-followup-0",
          type: "field",
          deleted: false,
          params: { name: "Tech stack", required: false },
        }),
        children: null,
        date: PENDING_DATE,
      },
    ],
  },
};

export const INITIAL_HEADER: lib.FormHeader = {
  title: "Fellowship application",
  description: "Design the form, collect answers, then follow up in review.",
};

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_REVIEW_DEMO_SOURCE = [
  withFileHeader("form-review/demo/formReviewDemoTypes.t.ts", formReviewDemoTypesSource),
  withFileHeader("form-review/demo/FormReviewDemo.tsx", formReviewDemoSource),
].join("\n\n");
