import type { CSSProperties, ReactNode } from "react";
import formReviewDemoSource from "./FormReviewDemo.tsx?raw";
import formReviewDemoTypesSource from "./formReviewDemoTypes.t.ts?raw";
import type * as types from "./formReviewDemoTypes.t";
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

/** Stable reference so `lastPending === history.at(-1).date` can match by identity. */
export const PENDING_DATE = new Date("2024-01-15T00:00:00Z");

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

const ACTION_ICON: Record<"lock" | "unlock" | "addQuestion" | "edit", { glyph: string; label: string }> = {
  lock: { glyph: "🔒", label: "Remove comment" },
  unlock: { glyph: "🔓", label: "Add comment" },
  addQuestion: { glyph: "💬", label: "Ask follow-up question" },
  edit: { glyph: "✎", label: "Edit follow-up question" },
};

/** Demo HTML chrome for `CustomFormReviewHOC` — not part of the library. */
export const formChrome: lib.FormReviewChrome<types.TypeNames, types.Params> = {
  renderHeader: (header) => (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>{header.title}</h2>
      {header.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{header.description}</p>
      ) : null}
    </div>
  ),
  renderForm: ({ header, sections, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 700 }}>
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
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {col}
          </div>
        ))}
      </div>
    </div>
  ),
  renderItemShell: ({ children, action }) => (
    <div style={{ position: "relative", padding: "4px 24px 4px 0" }}>
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
  renderQuestionAppendix: (nodes) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>{nodes}</div>
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
  renderOverlays: ({
    addition,
    deleteCommentId,
    setAddition,
    clearDelete,
    onSubmitComment,
    onConfirmDeleteComment,
    onSubmitQuestion,
    tCommon,
  }) => {
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

    if (addition?.mode === "question") {
      const question = addition.question;
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
              checked={!!question}
              onChange={(e) =>
                setAddition({
                  ...addition,
                  question: e.target.checked
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
          {question ? (
            <label style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
              <span>Field label</span>
              <input
                value={question.params.name}
                onChange={(e) =>
                  setAddition({
                    ...addition,
                    question: {
                      ...question,
                      params: { ...question.params, name: e.target.value },
                    },
                  })
                }
              />
            </label>
          ) : null}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => onSubmitQuestion({ comment: addition.comment, question })}
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
  },
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
    meta: { index: 0, total: 3 },
    header: {
      id: "s1",
      deleted: false,
      title: "Personal",
      description: "Who they are.",
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

export const INITIAL_RESPONSES: Record<string, lib.Response> = {
  name: { meta: {}, data: { value: "Ada Lovelace" } },
};

export const INITIAL_CHANGES: lib.AdditionalChanges<types.TypeNames, types.Params> = {
  note: {
    comment: "Please add a note here.",
    questions: [
      {
        comment: "Which topic did you struggle with?",
        question: lib.branded({
          id: "note-followup-0",
          type: "field",
          deleted: false,
          params: { name: "Topic", required: false },
        }),
        date: PENDING_DATE,
      },
    ],
  },
  name: {
    history: [{ date: PENDING_DATE }],
  },
};

export const INITIAL_HEADER: lib.FormHeader = {
  title: "Application review",
  description: "Comment on any section, then follow up with the student.",
};

const withFileHeader = (path: string, source: string) => `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_REVIEW_DEMO_SOURCE = [
  withFileHeader("form-review/demo/formReviewDemoTypes.t.ts", formReviewDemoTypesSource),
  withFileHeader("form-review/demo/FormReviewDemo.tsx", formReviewDemoSource),
].join("\n\n");
