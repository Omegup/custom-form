import type { CSSProperties } from "react";
import { FollowUpAdd } from "./followUpAdd";
import { flatFromFieldSections } from "../../form-dialogs/demo/formDialogsDemoFlat";
import {
  FormContainer,
  PhaseTabs,
  SectionFrame,
  type PhaseTab,
} from "../../section-responder/demo/sectionResponderDemoHelper";
import sectionReviewDemoSource from "./SectionReviewDemo.tsx?raw";
import sectionReviewDemoTypesSource from "./sectionReviewDemoTypes.t.ts?raw";
import type * as types from "./sectionReviewDemoTypes.t";
import * as lib from "./library";

export { FormContainer, PhaseTabs, SectionFrame };

/** Stable reference so `lastPending === history.at(-1).date` can match by identity. */
export const PENDING_DATE = new Date("2024-01-15T00:00:00Z");

export const PHASES: PhaseTab<types.DemoPhase>[] = [
  {
    id: "design",
    label: "1. Design",
    blurb: "Same editor as form-dialogs — library, add/edit, drag-and-drop. This story reviews the first section.",
  },
  {
    id: "response",
    label: "2. Response",
    blurb: "Student answers this section (multiple panels get + Add). No reviewer comments yet.",
  },
  {
    id: "follow",
    label: "3. Follow",
    blurb:
      "Teacher reviews: lock/unlock comments, nested Design list under the origin (add/edit/move follow-ups), status highlighting.",
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

export const PhaseJsonPanels = ({
  phase,
  section,
  responses,
  changes,
}: {
  phase: types.DemoPhase;
  section: types.ListSection;
  responses: Record<string, lib.Response>;
  changes: lib.AdditionalChanges<types.TypeNames, types.Params>;
}) => {
  const panels: { id: types.DemoPhase; title: string; value: unknown }[] = [
    { id: "design", title: "design · section", value: section },
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

const overlayBox: CSSProperties = {
  marginTop: 16,
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#fff",
};

const actionButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
};

const ACTION_ICON: Record<
  "lock" | "unlock",
  { glyph: string; label: string }
> = {
  // Remark unlocks revise — lock = no remark yet; unlock = remark present.
  lock: { glyph: "🔒", label: "Locked — add remark to unlock" },
  unlock: { glyph: "🔓", label: "Unlocked by remark — remove remark" },
};

/** Demo HTML chrome for `SectionReviewHOC` — not part of the library. */
export const sectionChrome: lib.SectionReviewChrome<types.TypeNames, types.Params> = {
  renderSection: (args) => (
    <SectionFrame
      {...args}
      note={
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888", fontStyle: "italic" }}>
          Follow / review — status border: green = commented, amber = needs attention, grey =
          idle.
        </p>
      }
    />
  ),
  renderItemShell: ({ children, action }) => (
    <div style={{ position: "relative", padding: "4px 28px 4px 0" }}>
      {children}
      {action}
    </div>
  ),
  renderComment: ({ text, onEdit }) => (
    <div
      style={{
        marginTop: 4,
        padding: 8,
        background: "#e7f1ff",
        borderLeft: "4px solid #4285f4",
        fontSize: 13,
        display: "flex",
        justifyContent: "space-between",
        gap: 8,
      }}
    >
      <span>💬 {text}</span>
      <button type="button" aria-label="Edit comment" onClick={onEdit} style={actionButtonStyle}>
        ✎
      </button>
    </div>
  ),
  renderFormItemAppendix: (nodes) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>{nodes}</div>
  ),
  renderAddFollowUp: ({ onPick }) => <FollowUpAdd onPick={onPick} />,
  renderActionIcon: (kind, onClick) => {
    const { glyph, label } = ACTION_ICON[kind];
    return (
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        style={actionButtonStyle}
      >
        {glyph}
      </button>
    );
  },
  renderFollowUpMark: () => (
    <span
      title="Answered follow-up"
      aria-label="Answered follow-up"
      style={{ color: "#b45309", fontSize: 12, fontWeight: 700, lineHeight: 1 }}
    >
      ✚
    </span>
  ),
};

/** Host-mounted overlay chrome — not part of `SectionReviewHOC`. */
export const renderReviewOverlays = ({
  addition,
  deleteCommentId,
  setAddition,
  clearDelete,
  onSubmitComment,
  onConfirmDeleteComment,
  tCommon,
}: lib.ReviewOverlayArgs) => {
  if (deleteCommentId) {
    return (
      <div style={overlayBox}>
        <p style={{ margin: "0 0 8px" }}>Remove this comment?</p>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={onConfirmDeleteComment}>
            {tCommon("delete")}
          </button>
          <button type="button" onClick={clearDelete}>
            {tCommon("cancel")}
          </button>
        </div>
      </div>
    );
  }

  if (addition) {
    return (
      <div style={overlayBox}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Comment</span>
          <textarea
            rows={3}
            value={addition.text ?? ""}
            onChange={(e) => setAddition({ ...addition, text: e.target.value })}
          />
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="button" onClick={() => onSubmitComment(addition.text ?? "")}>
            {tCommon("save")}
          </button>
          <button type="button" onClick={() => setAddition(null)}>
            {tCommon("cancel")}
          </button>
        </div>
      </div>
    );
  }

  return null;
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

export const INITIAL_SECTION: types.ListSection = {
  meta: { index: 0, total: 4 },
  header: {
    id: "s1",
    deleted: false,
    title: "Personal",
    description: "Identity the reviewer will assess.",
  },
  items: [
    [
      field("name", "Full name", true),
      field("email", "Email", true),
      field("note", "Note (optional)", false),
    ],
  ],
};

export const INITIAL_FLAT = flatFromFieldSections([INITIAL_SECTION]);

export const INITIAL_RESPONSES: Record<string, lib.Response> = {
  name: { meta: {}, data: { value: "Ada Lovelace" } },
  email: { meta: {}, data: { value: "ada@analytical.engine" } },
  // note intentionally empty
};

export const INITIAL_CHANGES: lib.AdditionalChanges<types.TypeNames, types.Params> = {
  name: {
    history: [{ date: PENDING_DATE }],
  },
  email: {
    comment: "Please use your institutional address.",
  },
  note: {
    comment: "Please add a short note.",
    formItems: [
      {
        comment: "Which topic did you struggle with?",
        formItem: lib.branded({
          id: "note-followup-0",
          type: "field",
          deleted: false,
          params: { name: "Topic", required: false },
        }),
        children: null,
        date: PENDING_DATE,
      },
    ],
  },
};

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const SECTION_REVIEW_DEMO_SOURCE = [
  withFileHeader(
    "section-review/demo/sectionReviewDemoTypes.t.ts",
    sectionReviewDemoTypesSource,
  ),
  withFileHeader("section-review/demo/SectionReviewDemo.tsx", sectionReviewDemoSource),
].join("\n\n");
