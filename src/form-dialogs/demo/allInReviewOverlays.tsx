import type { CSSProperties } from "react";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

export const actionButtonStyle: CSSProperties = {
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

export const renderActionIcon = (
  kind: "lock" | "unlock" | "edit",
  onClick: () => void,
) => {
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
};

export const renderOverlays: lib.FormReviewChrome<
  types.TypeNames,
  types.Params
>["renderOverlays"] = ({
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
        <p style={{ margin: "0 0 8px" }}>
          Remove this remark? The answer will lock again.
        </p>
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
          <button
            type="button"
            onClick={() => onSubmitComment(addition.text ?? "")}
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
