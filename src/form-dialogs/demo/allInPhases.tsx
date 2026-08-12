/**
 * Shared All-in lifecycle chrome — Design / Fill / Update phase tabs, fill +
 * review viewers. Follow-ups use Design's `AddFormItem` dropdown in place.
 */
import {
  useImperativeHandle,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import { renderAddFormItem } from "../../side-menu/demo/sideMenuDemoHelper";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

/** Panel `data.instances` — comma-separated instance ids (`0,1,…`). */
export const PANEL_INSTANCES_KEY = "instances";

const parsePanelInstanceIds = (response: lib.Response): string[] => {
  const raw = response.data[PANEL_INSTANCES_KEY];
  if (!raw) return ["0"];
  const ids = raw.split(",").filter((s) => s.length > 0);
  return ids.length ? ids : ["0"];
};

/** Suffixes passed to `getChild` / `renderSlots` (`:0`, `:1`, …). */
export const panelInstanceSuffixes = (
  multiple: boolean,
  response: lib.Response,
): string[] => {
  if (!multiple) return [""];
  return parsePanelInstanceIds(response).map((id) => `:${id}`);
};

const nextPanelInstanceId = (response: lib.Response): string => {
  const ids = parsePanelInstanceIds(response);
  const max = ids.reduce((m, id) => Math.max(m, Number(id) || 0), 0);
  return String(max + 1);
};

const withPanelInstances = (
  response: lib.Response,
  ids: string[],
): lib.Response => ({
  ...response,
  data: {
    ...response.data,
    [PANEL_INSTANCES_KEY]: ids.join(","),
  },
});

const panelRepeatChildren = (
  formItem: lib.TypedFormItem<types.Params, "panel">,
  extra: { response: lib.ResponseSetter },
): string[] =>
  panelInstanceSuffixes(formItem.params.multiple, extra.response.value);

const panelShellStyle = (borderColor: string): CSSProperties => ({
  display: "flex",
  gap: 12,
  paddingLeft: 8,
  borderLeft: `2px solid ${borderColor}`,
});

const PanelBody = ({
  formItem,
  extra,
  borderColor,
  readOnly,
  badge,
}: {
  formItem: lib.TypedFormItem<types.Params, "panel">;
  extra: {
    children: ReactElement[];
    response: lib.ResponseSetter;
    appendix?: ReactNode;
    icon?: ReactNode;
  };
  borderColor: string;
  readOnly: boolean;
  badge: ReactNode;
}) => {
  const multiple = formItem.params.multiple;
  const editable = !readOnly && extra.response.setValue != null;
  const suffixes = panelInstanceSuffixes(multiple, extra.response.value);

  const addInstance = () => {
    if (!extra.response.setValue) return;
    const ids = parsePanelInstanceIds(extra.response.value);
    extra.response.setValue(
      "data",
      withPanelInstances(extra.response.value, [...ids, nextPanelInstanceId(extra.response.value)])
        .data,
    );
  };

  const removeInstance = (instanceId: string) => {
    if (!extra.response.setValue) return;
    const ids = parsePanelInstanceIds(extra.response.value).filter(
      (id) => id !== instanceId,
    );
    extra.response.setValue(
      "data",
      withPanelInstances(extra.response.value, ids.length ? ids : ["0"]).data,
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <strong style={{ fontSize: 14 }}>
          {formItem.params.name || "(panel)"}
          {multiple ? " · multiple" : ""}
        </strong>
        {badge}
        {extra.icon}
      </span>
      {multiple ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {extra.children.map((child, i) => {
            const instanceId = parsePanelInstanceIds(extra.response.value)[i] ?? String(i);
            return (
              <div key={suffixes[i] ?? i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#666" }}>Entry {i + 1}</span>
                  {editable && suffixes.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeInstance(instanceId)}
                      style={{ fontSize: 12, color: "#a40" }}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div style={panelShellStyle(borderColor)}>{child}</div>
              </div>
            );
          })}
          {editable ? (
            <button type="button" onClick={addInstance} style={{ alignSelf: "flex-start" }}>
              + Add entry
            </button>
          ) : null}
        </div>
      ) : (
        <div style={panelShellStyle(borderColor)}>{extra.children}</div>
      )}
      {extra.appendix}
    </div>
  );
};

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
  /** Remark present — unlocked for revise. */
  normal: "#22883e",
  /** Older answer waves (ancient). */
  disabled: "#b0b0b0",
  /** Latest answer wave (recent) — black chrome; bold via fontWeight. */
  highlight: "#111",
};

const STATUS_ANSWER_STYLE: Record<
  lib.ReviewStatus,
  { opacity: number; fontWeight: number; label: string | null }
> = {
  normal: { opacity: 1, fontWeight: 400, label: null },
  disabled: { opacity: 0.55, fontWeight: 400, label: "earlier" },
  highlight: { opacity: 1, fontWeight: 700, label: "new" },
};

const statusLabelBadge = (label: string | null, ancient: boolean) =>
  label ? (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: ancient ? "#888" : "#111",
        border: `1px solid ${ancient ? "#ccc" : "#111"}`,
        borderRadius: 3,
        padding: "1px 5px",
        lineHeight: 1.2,
      }}
    >
      {label}
    </span>
  ) : null;

/** Follow-up chrome — yellow + badge (not error red). Keyed by form `Variants`. */
const FOLLOW_UP_BADGE = (
  <span
    title="Added follow-up"
    aria-label="Added follow-up"
    style={{ color: "#b45309", fontSize: 12, fontWeight: 700, lineHeight: 1 }}
  >
    ✚
  </span>
);

type VariantChrome = {
  border: string;
  background: string;
  badge: ReactNode;
};

const VARIANT_CHROME: Record<"default" | "followUp", VariantChrome> = {
  default: { border: "#ccc", background: "#fff", badge: null },
  followUp: { border: "#e6b800", background: "#fffbeb", badge: FOLLOW_UP_BADGE },
};

const VARIANT_SHELL: Record<"default" | "followUp", CSSProperties> = {
  default: {},
  followUp: {
    padding: 8,
    borderRadius: 6,
    background: VARIANT_CHROME.followUp.background,
    border: `1px solid ${VARIANT_CHROME.followUp.border}`,
  },
};

const fillFieldBorder: Record<
  types.Variants["field"],
  (error: boolean | string | null) => string
> = {
  default: (error) => (error ? "#c00" : VARIANT_CHROME.default.border),
  followUp: () => VARIANT_CHROME.followUp.border,
};

const reviewFieldBorder: Record<
  types.Variants["field"],
  (status: lib.ReviewStatus) => string
> = {
  default: (status) => STATUS_COLOR[status],
  followUp: () => VARIANT_CHROME.followUp.border,
};

const reviewFieldBackground: Record<types.Variants["field"], string> = {
  default: "#fafafa",
  followUp: VARIANT_CHROME.followUp.background,
};

const panelBorder: Record<types.Variants["panel"], string> = {
  default: "#b8d4f0",
  followUp: VARIANT_CHROME.followUp.border,
};

const reviewPanelBorder: Record<
  types.Variants["panel"],
  (status: lib.ReviewStatus) => string
> = {
  default: (status) => STATUS_COLOR[status],
  followUp: () => panelBorder.followUp,
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
  lock: { glyph: "🔒", label: "Locked — add remark to unlock" },
  unlock: { glyph: "🔓", label: "Unlocked by remark — remove remark" },
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
  renderFollowUpGroup: ({ originId: _originId, items }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 8,
        marginLeft: 8,
        paddingLeft: 12,
        paddingTop: 8,
        paddingBottom: 8,
        paddingRight: 8,
        borderLeft: `3px solid ${VARIANT_CHROME.followUp.border}`,
        background: "#fffbeb88",
        borderRadius: "0 6px 6px 0",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#b45309",
        }}
      >
        Follow-up
      </div>
      {items}
    </div>
  ),
};

/** Update/review chrome — follow-ups use Design's `AddFormItem` dropdown. */
export const reviewChrome: lib.FormReviewChrome<types.TypeNames, types.Params> = {
  renderHeader: (header) => (
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 600 }}>{header.title}</h2>
      {header.description ? (
        <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{header.description}</p>
      ) : null}
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#888", fontStyle: "italic" }}>
        Remark unlocks a field (🔓). Use <strong>+ Follow-up</strong> on an answer to attach a
        Field / Heading / Panel (same dropdown as Design). After the student sends again,{" "}
        <strong>new</strong> marks this round&apos;s answers and <strong>earlier</strong> marks
        prior sends.
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
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
        padding: "4px 0",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
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
  renderAddFollowUp: ({ onPick }) => (
    <lib.AddFormItem<types.TypeNames, types.Params>
      span={{ index: -1, sIndex: -1 }}
      menuItems={MENU_ITEMS}
      random={randomId}
      setAddItem={(session) =>
        onPick({
          formItem: session.draft.item,
          children: session.children,
        })
      }
      label="+ Follow-up"
      render={renderAddFormItem}
    />
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
  renderOverlays: ({
    addition,
    deleteCommentId,
    setAddition,
    clearDelete,
    onSubmitComment,
    onConfirmDeleteComment,
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
    viewer: ({ props: { formItem, extra, ctx, variant } }) => {
      const { setDataValue, value } = useFillFieldMethods(
        extra.impRef,
        extra.response,
        formItem.params.required,
        ctx.t("fieldRequired"),
      );
      // String = validate() message (useFillFieldMethods). Boolean true =
      // revise-unlock highlight from SectionResponder — border only, no copy.
      const err = typeof extra.error === "string" ? extra.error : null;
      const chrome = VARIANT_CHROME[variant];
      return (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            ...VARIANT_SHELL[variant],
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {formItem.params.name || "(unnamed field)"}
            {formItem.params.required ? " *" : ""}
            {chrome.badge}
            {extra.icon}
          </span>
          <input
            value={value}
            onChange={(e) => setDataValue(e.target.value)}
            disabled={extra.response.setValue == null}
            style={{
              padding: "6px 8px",
              border: `1px solid ${fillFieldBorder[variant](extra.error)}`,
              borderRadius: 4,
              background: chrome.background,
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
    viewer: ({ props: { formItem, extra, variant } }) => {
      const chrome = VARIANT_CHROME[variant];
      return (
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            ...VARIANT_SHELL[variant],
          }}
        >
          {formItem.params.name || "(heading)"}
          {chrome.badge}
          {extra.appendix}
        </div>
      );
    },
  },
  panel: {
    viewer: ({ props: { formItem, extra, variant } }) => (
      <div style={VARIANT_SHELL[variant]}>
        <PanelBody
          formItem={formItem}
          extra={extra}
          borderColor={panelBorder[variant]}
          readOnly={false}
          badge={VARIANT_CHROME[variant].badge}
        />
      </div>
    ),
    repeatChildren: panelRepeatChildren,
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
    viewer: ({ props: { formItem, extra, variant } }) => {
      const value = extra.response.value.data.value ?? "";
      const chrome = VARIANT_CHROME[variant];
      const tone = STATUS_ANSWER_STYLE[extra.status];
      const newlyAnswered = extra.status === "highlight";
      const ancient = extra.status === "disabled";
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            opacity: extra.parentDeleted ? 0.5 : tone.opacity,
            ...VARIANT_SHELL[variant],
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: tone.fontWeight,
              color: ancient ? "#777" : undefined,
            }}
          >
            <span>
              {formItem.params.name || "(unnamed field)"}
              {formItem.params.required ? " *" : ""}
            </span>
            {statusLabelBadge(tone.label, ancient)}
            {chrome.badge}
            {extra.icon}
          </span>
          <div
            style={{
              padding: "6px 8px",
              border: `1px solid ${reviewFieldBorder[variant](extra.status)}`,
              borderRadius: 4,
              background: newlyAnswered
                ? "#fff"
                : ancient
                  ? "#f0f0f0"
                  : reviewFieldBackground[variant],
              fontWeight: tone.fontWeight,
              color: ancient ? "#666" : undefined,
            }}
          >
            {value || <em style={{ color: "#999", fontWeight: 400 }}>No answer</em>}
          </div>
          {extra.appendix}
        </div>
      );
    },
  },
  heading: {
    viewer: ({ props: { formItem, extra, variant } }) => {
      const chrome = VARIANT_CHROME[variant];
      const tone = STATUS_ANSWER_STYLE[extra.status];
      const ancient = extra.status === "disabled";
      const weight =
        extra.status === "highlight" ? 700 : extra.status === "normal" ? 600 : 400;
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            opacity: tone.opacity,
            ...VARIANT_SHELL[variant],
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: weight,
              color: ancient ? "#777" : undefined,
            }}
          >
            {formItem.params.name || "(heading)"}
            {statusLabelBadge(tone.label, ancient)}
            {chrome.badge}
            {extra.icon}
          </span>
          {extra.appendix}
        </div>
      );
    },
  },
  panel: {
    viewer: ({ props: { formItem, extra, variant } }) => (
      <div style={VARIANT_SHELL[variant]}>
        <PanelBody
          formItem={formItem}
          extra={extra}
          borderColor={reviewPanelBorder[variant](extra.status)}
          readOnly
          badge={VARIANT_CHROME[variant].badge}
        />
      </div>
    ),
    repeatChildren: panelRepeatChildren,
  },
};
