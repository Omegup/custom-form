/**
 * Shared All-in lifecycle chrome — Design / Fill / Update phase tabs, fill +
 * review viewers, and review overlays that defer type picking to the Library
 * sidebar (same Side catalog as Design).
 */
import { useImperativeHandle, type CSSProperties, type Ref } from "react";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

/**
 * Keep Date identity for `lastPending === history.at(-1).date` (school
 * review status). Storybook stores ISO strings; this map restores the
 * live Date object used when the history entry was stamped.
 */
const datesByIso = new Map<string, Date>();

export const rememberDate = (date: Date): Date => {
  datesByIso.set(date.toISOString(), date);
  return date;
};

export const dateFromIso = (iso: string): Date =>
  datesByIso.get(iso) ?? rememberDate(new Date(iso));

/** Map FormResponse.responses[] → Record for fill/review UIs. */
export const formResponseValues = (
  doc: types.FormResponseDoc,
): Record<string, lib.Response> =>
  Object.fromEntries(doc.responses.map((r) => [r.formItemId, r.response]));

/** Submit payload → persisted `FormResponse.responses` array. */
export const toFormResponseEntries = (
  values: Record<string, lib.Response>,
): types.FormResponseEntry[] =>
  Object.entries(values).map(([formItemId, response]) => ({
    formItemId,
    response,
  }));

/** @deprecated Prefer `dateFromIso` / live feedbackHistory — kept for older demos. */
export const PENDING_DATE = rememberDate(new Date("2024-01-15T00:00:00Z"));

const PHASES: {
  id: types.DemoPhase;
  label: string;
  blurb: string;
}[] = [
  {
    id: "design",
    label: "1. Design",
    blurb: "Author the form — sections, fields, panels, drag-and-drop, Library sidebar.",
  },
  {
    id: "fill",
    label: "2. Fill",
    blurb:
      "Student answers then Sends — creates/updates the FormResponse. Send is available when there is no response yet, or status is changesRequested.",
  },
  {
    id: "update",
    label: "3. Update",
    blurb:
      "Teacher view of the same FormResponse — Save remarks/follow-ups, then Request changes / Approve / Reject.",
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
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
  margin: 0,
  padding: 10,
  background: active ? "#eef4fb" : "#f6f7f9",
  border: active ? "1px solid #1a5fb4" : "1px solid #e0e0e0",
  borderRadius: 6,
  fontSize: 11,
  overflow: "auto",
  maxHeight: 220,
  lineHeight: 1.4,
});

export const PhaseJsonPanels = ({
  phase,
  flatItems,
  responses,
  formResponse,
}: {
  phase: types.DemoPhase;
  flatItems: types.FlatItems;
  responses: Record<string, lib.Response>;
  formResponse: types.FormResponseDoc | null;
}) => {
  /** Two school documents — Design/Fill/Update are views, not third stores. */
  const panels: { title: string; active: boolean; value: unknown }[] = [
    {
      title: "CustomForm · design",
      active: phase === "design",
      value: flatItems,
    },
    {
      title: "FormResponse",
      active: phase === "fill" || phase === "update",
      value: formResponse,
    },
  ];
  // Fill draft (formik) is session state — show beside the docs while filling.
  if (phase === "fill") {
    panels.push({
      title: "Fill draft (formik)",
      active: true,
      value: responses,
    });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#444",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        Documents (school: CustomForm + FormResponse)
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${panels.length}, minmax(0, 1fr))`,
          gap: 10,
        }}
      >
        {panels.map((p) => (
          <div key={p.title} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: p.active ? 700 : 500,
                color: p.active ? "#1a5fb4" : "#666",
              }}
            >
              {p.title}
              {p.active ? " · active view" : ""}
            </div>
            <pre style={jsonPanelStyle(p.active)}>
              {JSON.stringify(p.value, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

const STATUS_COLOR: Record<lib.ReviewStatus, string> = {
  normal: "#22883e",
  disabled: "#ddd",
  highlight: "#f59e0b",
};

const actionButtonStyle: CSSProperties = {
  border: "none",
  background: "transparent",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
};

const ACTION_ICON: Record<
  "lock" | "unlock" | "addFormItem" | "edit",
  { glyph: string; label: string }
> = {
  lock: { glyph: "🔒", label: "Locked — add remark to unlock" },
  unlock: { glyph: "🔓", label: "Unlocked by remark — remove remark" },
  addFormItem: { glyph: "💬", label: "Ask follow-up" },
  edit: { glyph: "✎", label: "Edit follow-up" },
};

const overlayBox: CSSProperties = {
  marginTop: 16,
  padding: 12,
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#fff",
};

/** Fill-path chrome — no HTML in the library; demo owns layout. */
export const fillChrome: lib.FormResponderChrome = {
  renderHeader: (header) => (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>{header.title}</h2>
      {header.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{header.description}</p>
      ) : null}
    </div>
  ),
  renderForm: ({ header, sections, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
  renderItemShell: ({ children, onActivate }) => (
    <div onClick={onActivate}>{children}</div>
  ),
  renderClearIcon: (onClear) => (
    <button
      type="button"
      aria-label="Clear draft answer"
      onClick={(e) => {
        e.stopPropagation();
        onClear();
      }}
      style={{ ...actionButtonStyle, margin: "0 4px", color: "#666" }}
    >
      ×
    </button>
  ),
  renderAppendix: (comment) => (
    <div style={{ marginTop: 4, color: "#c00", fontSize: 12 }}>{comment}</div>
  ),
};

/** Update/review chrome — follow-up type picking happens via the Library sidebar. */
export const reviewChrome: lib.FormReviewChrome<types.TypeNames, types.Params> = {
  renderHeader: (header) => (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>{header.title}</h2>
      {header.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{header.description}</p>
      ) : null}
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888", fontStyle: "italic" }}>
        Remark unlocks a field (🔓). Click 💬 then pick a type from the Library sidebar to attach
        a follow-up.
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
    onSubmitFormItem,
    tCommon,
  }) => {
    if (deleteCommentId) {
      return (
        <div style={overlayBox}>
          <p style={{ margin: "0 0 8px" }}>Remove this remark? The answer will lock again.</p>
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
            <span>Remark (unlocks this answer for revise)</span>
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
          {!formItem ? (
            <p style={{ margin: "0 0 8px", fontSize: 14 }}>
              Pick a type from the <strong>Library</strong> sidebar (Field / Heading / Panel) to
              attach a follow-up under this answer.
            </p>
          ) : (
            <>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#555" }}>
                Follow-up type: <strong>{formItem.type}</strong> · id: {formItem.id}
              </p>
              <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span>Label</span>
                <input
                  value={formItem.params.name}
                  onChange={(e) =>
                    setAddition({
                      ...addition,
                      formItem: lib.withFormItemName(formItem, e.target.value),
                    })
                  }
                />
              </label>
            </>
          )}
          <label style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
            <span>Follow-up comment</span>
            <textarea
              rows={2}
              value={addition.comment ?? ""}
              onChange={(e) => setAddition({ ...addition, comment: e.target.value })}
            />
          </label>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              disabled={!formItem}
              onClick={() =>
                formItem &&
                onSubmitFormItem({ comment: addition.comment, formItem })
              }
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

export const useFillFieldMethods = (
  impRef: Ref<lib.ViewerMethods> | null,
  response: lib.ResponseSetter,
  required: boolean,
  fieldRequired: string,
) => {
  useImperativeHandle(impRef, () => ({
    validate: (value) => {
      const text = value.data.value?.trim() ?? "";
      if (required && !text) return fieldRequired;
      return null;
    },
    update: (value) => value ?? lib.emptyResponse(),
  }));

  const setDataValue = (text: string) => {
    response.setValue?.("data", { ...response.value.data, value: text });
  };

  return { setDataValue, value: response.value.data.value ?? "" };
};

type FillViewerExtra = lib.ResponderExtra & {
  impRef: Ref<lib.ViewerMethods>;
} & lib.Children;

type FillHostExtra = lib.ResponderExtra & {
  impRef: Ref<lib.StrictViewerMethods>;
};

export const fillViewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  FillViewerExtra,
  FillHostExtra,
  lib.SectionResponderContext,
  string
> = {
  field: {
    viewer: ({ props: { formItem, extra, ctx } }) => {
      const { setDataValue, value } = useFillFieldMethods(
        extra.impRef,
        extra.response,
        formItem.params.required,
        ctx.t("fieldRequired"),
      );
      // String = validate() message (useFillFieldMethods). Boolean true =
      // revise-unlock highlight from SectionResponder — border only, no copy.
      const err = typeof extra.error === "string" ? extra.error : null;
      return (
        <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <span>
            {formItem.params.name || "(unnamed field)"}
            {formItem.params.required ? " *" : ""}
            {extra.icon}
          </span>
          <input
            value={value}
            onChange={(e) => setDataValue(e.target.value)}
            disabled={extra.response.setValue == null}
            style={{
              padding: "6px 8px",
              border: extra.error ? "1px solid #c00" : "1px solid #ccc",
              borderRadius: 4,
            }}
          />
          {err ? (
            <span style={{ color: "#c00", fontSize: 12 }}>{err}</span>
          ) : null}
          {extra.appendix}
        </label>
      );
    },
  },
  heading: {
    viewer: ({ props: { formItem, extra } }) => (
      <div style={{ fontSize: 15, fontWeight: 600 }}>
        {formItem.params.name || "(heading)"}
        {extra.appendix}
      </div>
    ),
  },
  panel: {
    viewer: ({ props: { formItem, extra } }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <strong style={{ fontSize: 14 }}>{formItem.params.name || "(panel)"}</strong>
        <div
          style={{
            display: "flex",
            gap: 12,
            paddingLeft: 8,
            borderLeft: "2px solid #b8d4f0",
          }}
        >
          {extra.children}
        </div>
        {extra.appendix}
      </div>
    ),
    repeatChildren: () => [""],
  },
};

type ReviewViewerExtra = lib.ReviewExtra & {
  impRef: Ref<lib.ViewerMethods>;
} & lib.Children;

type ReviewHostExtra = lib.ReviewExtra & {
  impRef: Ref<lib.StrictViewerMethods>;
};

export const reviewViewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  ReviewViewerExtra,
  ReviewHostExtra,
  lib.SectionReviewContext,
  string
> = {
  field: {
    viewer: ({ props: { formItem, extra } }) => {
      const value = extra.response.value.data.value ?? "";
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            opacity: extra.parentDeleted ? 0.5 : 1,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <strong>
              {formItem.params.name || "(unnamed field)"}
              {formItem.params.required ? " *" : ""}
            </strong>
            {extra.icon}
          </span>
          <div
            style={{
              padding: "6px 8px",
              border: `1px solid ${STATUS_COLOR[extra.status]}`,
              borderRadius: 4,
              background: "#fafafa",
            }}
          >
            {value || <em style={{ color: "#999" }}>No answer</em>}
          </div>
          {extra.appendix}
        </div>
      );
    },
  },
  heading: {
    viewer: ({ props: { formItem, extra } }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
          {formItem.params.name || "(heading)"}
          {extra.icon}
        </span>
        {extra.appendix}
      </div>
    ),
  },
  panel: {
    viewer: ({ props: { formItem, extra } }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
          {formItem.params.name || "(panel)"}
          {extra.icon}
        </span>
        <div
          style={{
            display: "flex",
            gap: 12,
            paddingLeft: 8,
            borderLeft: `2px solid ${STATUS_COLOR[extra.status]}`,
          }}
        >
          {extra.children}
        </div>
        {extra.appendix}
      </div>
    ),
    repeatChildren: () => [""],
  },
};
