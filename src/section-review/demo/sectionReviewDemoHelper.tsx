import type { CSSProperties, ReactNode } from "react";
import { FollowUpAdd } from "./followUpAdd";
import { flatFromFieldSections } from "../../form-dialogs/demo/formDialogsDemoFlat";
import sectionReviewDemoSource from "./SectionReviewDemo.tsx?raw";
import sectionReviewDemoTypesSource from "./sectionReviewDemoTypes.t.ts?raw";
import type * as types from "./sectionReviewDemoTypes.t";
import * as lib from "./library";

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

/** Stable reference so `lastPending === history.at(-1).date` can match by identity. */
export const PENDING_DATE = new Date("2024-01-15T00:00:00Z");

const PHASES: {
  id: types.DemoPhase;
  label: string;
  blurb: string;
}[] = [
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
      "Teacher reviews: lock/unlock comments, 💬 follow-up dropdown, status highlighting.",
  },
];

export const PhaseTabs = ({
  phase,
  onChange,
}: {
  phase: types.DemoPhase;
  onChange: (phase: types.DemoPhase) => void;
}) => {
  const current = PHASES.find((p) => p.id === phase)!;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        role="tablist"
        aria-label="Lifecycle phase"
        style={{ display: "flex", gap: 0, borderBottom: "1px solid #ddd" }}
      >
        {PHASES.map((p) => {
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
  "lock" | "unlock" | "edit",
  { glyph: string; label: string }
> = {
  // Remark unlocks revise — lock = no remark yet; unlock = remark present.
  lock: { glyph: "🔒", label: "Locked — add remark to unlock" },
  unlock: { glyph: "🔓", label: "Unlocked by remark — remove remark" },
  edit: { glyph: "✎", label: "Edit follow-up" },
};

/** Demo HTML chrome for `SectionReviewHOC` — not part of the library. */
export const sectionChrome: lib.SectionReviewChrome<types.TypeNames, types.Params> = {
  renderSection: ({ deleted, title, description, i, multiSection, columns }) => (
    <div style={{ marginBottom: 20, opacity: deleted ? 0.5 : 1 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>
          {multiSection ? `${i + 1}. ${title}` : title}
        </h3>
        {description ? (
          <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{description}</p>
        ) : null}
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888", fontStyle: "italic" }}>
          Follow / review — status border: green = commented, amber = needs attention, grey =
          idle.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {columns.map((col, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {col}
          </div>
        ))}
      </div>
    </div>
  ),
  renderItemShell: ({ children, action }) => (
    <div style={{ position: "relative", padding: "4px 28px 4px 0" }}>
      {children}
      {action ? <span style={{ position: "absolute", top: 0, right: 0 }}>{action}</span> : null}
    </div>
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
      👉 {comment}
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
  renderAddFollowUp: ({ originId, onPick }) => (
    <FollowUpAdd originId={originId} onPick={onPick} />
  ),
  renderActionIcon: (kind, onClick) => {
    const { glyph, label } = ACTION_ICON[kind];
    return (
      <button
        type="button"
        aria-label={label}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
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
  onSubmitFormItem,
  tCommon,
}: lib.ReviewOverlayArgs<types.TypeNames, types.Params>) => {
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

  if (addition?.mode === "comment") {
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

  if (addition?.mode === "formItem") {
    const formItem = addition.formItem;
    return (
      <div style={overlayBox}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span>Follow-up comment</span>
          <textarea
            rows={2}
            value={addition.comment ?? ""}
            onChange={(e) => setAddition({ ...addition, comment: e.target.value })}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
          <input
            type="checkbox"
            checked={!!formItem}
            onChange={(e) =>
              setAddition({
                ...addition,
                formItem: e.target.checked
                  ? {
                      id: `${addition.originId}-followup-${addition.replace?.index ?? Date.now()}`,
                      type: "field",
                      deleted: false,
                      params: { name: "Follow-up field", required: false },
                    }
                  : undefined,
              })
            }
          />
          Attach a follow-up field
        </label>
        {formItem ? (
          <label style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
            <span>Field label</span>
            <input
              value={formItem.params.name}
              onChange={(e) => {
                if (formItem.type !== "field") return;
                setAddition({
                  ...addition,
                  formItem: {
                    ...formItem,
                    params: { ...formItem.params, name: e.target.value },
                  },
                });
              }}
            />
          </label>
        ) : null}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            type="button"
            onClick={() => onSubmitFormItem({ comment: addition.comment, formItem })}
          >
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
