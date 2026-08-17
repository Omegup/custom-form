import type { CSSProperties } from "react";
import { flatFromFieldSections } from "../../form-dialogs/demo/formDialogsDemoFlat";
import {
  FormContainer,
  PENDING_DATE,
  ReviewSection,
  sectionChrome,
} from "../../section-review/demo/sectionReviewDemoHelper";
import {
  PhaseTabs,
  type PhaseTab,
} from "../../section-responder/demo/sectionResponderDemoHelper";
import formReviewDemoSource from "./FormReviewDemo.tsx?raw";
import formReviewDemoTypesSource from "./formReviewDemoTypes.t.ts?raw";
import type * as types from "./formReviewDemoTypes.t";
import * as lib from "./library";

export { FormContainer, PENDING_DATE, PhaseTabs };

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
      "Teacher reviews answers: lock/unlock comments, 💬 follow-up dropdown, status highlighting.",
  },
];

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

/** Three JSON dumps — Design / Response / Follow — always visible for comparison. */
export const PhaseJsonPanels = ({
  phase,
  sections,
  responses,
  changes,
}: {
  phase: types.DemoPhase;
  sections: types.ListSection[];
  responses: Record<string, lib.Response>;
  changes: lib.AdditionalChanges<types.TypeNames, types.Params>;
}) => {
  const panels: {
    id: types.DemoPhase;
    title: string;
    value: unknown;
  }[] = [
    { id: "design", title: "design · sections", value: sections },
    { id: "response", title: "response · answers", value: responses },
    { id: "follow", title: "follow · AdditionalChanges", value: changes },
  ];
  return (
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
        JSON by phase
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 10,
        }}
      >
        {panels.map((p) => (
          <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: phase === p.id ? 700 : 500,
                color: phase === p.id ? "#1a5fb4" : "#666",
              }}
            >
              {p.title}
              {phase === p.id ? " · active" : ""}
            </div>
            <pre style={jsonPanelStyle(phase === p.id)}>
              {JSON.stringify(p.value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Demo HTML chrome for `CustomFormReviewHOC` — item slots come from `sectionChrome`. */
export const formChrome: lib.FormReviewChrome<types.TypeNames, types.Params> = {
  ...sectionChrome,
  renderHeader: (header) => (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>{header.title}</h2>
      {header.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{header.description}</p>
      ) : null}
      <p
        style={{
          margin: "8px 0 0",
          fontSize: 12,
          color: "#888",
          fontStyle: "italic",
        }}
      >
        Follow / review — status border colors: green = commented, amber = needs attention,
        grey = idle.
      </p>
    </div>
  ),
  renderForm: ({ header, sections, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {header}
      {sections}
      {children}
    </div>
  ),
  renderSection: (args) => <ReviewSection {...args} note={null} />,
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

export const INITIAL_FLAT = flatFromFieldSections(INITIAL_SECTIONS);

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
