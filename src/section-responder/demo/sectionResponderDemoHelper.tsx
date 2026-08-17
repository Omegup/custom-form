import type { ReactNode } from "react";
import { flatFromFieldSections } from "../../form-dialogs/demo/formDialogsDemoFlat";
import { useFieldMethods } from "../../response/demo/responseDemoHelper";
import sectionResponderDemoSource from "./SectionResponderDemo.tsx?raw";
import sectionResponderDemoTypesSource from "./sectionResponderDemoTypes.t.ts?raw";
import type * as types from "./sectionResponderDemoTypes.t";
import * as lib from "./library";

export { useFieldMethods };

export const FormContainer = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div
    style={{
      fontFamily: "system-ui, sans-serif",
      maxWidth: 1120,
      margin: "0 auto",
      color: "#1a1a1a",
    }}
  >
    <h2 style={{ marginTop: 0, marginBottom: 4 }}>{title}</h2>
    {children}
  </div>
);

export type PhaseTab<Id extends string> = {
  id: Id;
  label: string;
  blurb: string;
};

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

export const PhaseTabs = <Id extends string>({
  phase,
  onChange,
  phases,
}: {
  phase: Id;
  onChange: (phase: Id) => void;
  phases: readonly PhaseTab<Id>[];
}) => {
  const current = phases.find((p) => p.id === phase)!;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
      <div
        role="tablist"
        aria-label="Lifecycle phase"
        style={{ display: "flex", gap: 0, borderBottom: "1px solid #ddd" }}
      >
        {phases.map((p) => {
          const active = p.id === phase;
          return (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(p.id)}
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "none",
                borderBottom: active ? "2px solid #1a5fb4" : "2px solid transparent",
                background: active ? "#f0f5fb" : "transparent",
                color: active ? "#1a5fb4" : "#555",
                fontWeight: active ? 600 : 500,
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#555", lineHeight: 1.4 }}>
        {current.blurb}
      </p>
    </div>
  );
};

/** Demo HTML chrome for `renderSection` — fill, review, and form shells share this. */
export const SectionFrame = ({
  deleted,
  title,
  description,
  i,
  multiSection,
  columns,
  note,
}: {
  deleted: boolean;
  title: string;
  description: string;
  i: number;
  multiSection: boolean;
  columns: ReactNode[];
  note: ReactNode | null;
}) => (
  <div style={{ marginBottom: 20, opacity: deleted ? 0.5 : 1 }}>
    <div style={{ marginBottom: 12 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>
        {multiSection ? `${i + 1}. ${title}` : title}
      </h3>
      {description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{description}</p>
      ) : null}
      {note}
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
);

const ClearAnswer = ({ onClear }: { onClear: () => void }) => (
  <button
    type="button"
    aria-label="Clear draft answer"
    onClick={onClear}
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
);

const RemarkAppendix = ({ comment }: { comment: string }) => (
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
);

export const sectionChrome: lib.SectionResponderChrome = {
  renderSection: (args) => <SectionFrame {...args} note={null} />,
  renderClearIcon: (onClear) => <ClearAnswer onClear={onClear} />,
  renderAppendix: (comment) => <RemarkAppendix comment={comment} />,
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

export const INITIAL_FLAT = flatFromFieldSections([INITIAL_SECTION]);

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
