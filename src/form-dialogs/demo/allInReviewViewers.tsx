import type { Ref } from "react";
import { PanelBody, panelRepeatChildren } from "./allInPanel";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

const STATUS_COLOR: Record<lib.ReviewStatus, string> = {
  normal: "#22883e",
  disabled: "#b0b0b0",
  highlight: "#111",
};

const STATUS_ANSWER_STYLE: Record<
  lib.ReviewStatus,
  { fontWeight: number; label: string | null }
> = {
  normal: { fontWeight: 400, label: null },
  disabled: { fontWeight: 400, label: "earlier" },
  highlight: { fontWeight: 700, label: "new" },
};

const MUTED = { label: "#777", value: "#666", valueBg: "#f0f0f0" } as const;

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
      const tone = STATUS_ANSWER_STYLE[extra.status];
      const newlyAnswered = extra.status === "highlight";
      const ancient = extra.status === "disabled";
      const mute = variant.reviewTone && (extra.parentDeleted || ancient);
      const fieldBorder = variant.reviewTone
        ? STATUS_COLOR[extra.status]
        : variant.border;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...variant.shell,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: tone.fontWeight,
                color: mute ? MUTED.label : undefined,
              }}
            >
              <span>
                {formItem.params.name || "(unnamed field)"}
                {formItem.params.required ? " *" : ""}
              </span>
              {statusLabelBadge(tone.label, ancient)}
              {variant.badge}
              {extra.icon}
            </span>
            <div
              style={{
                padding: "6px 8px",
                border: `1px solid ${fieldBorder}`,
                borderRadius: 4,
                background: newlyAnswered
                  ? "#fff"
                  : mute
                    ? MUTED.valueBg
                    : variant.background,
                fontWeight: tone.fontWeight,
                color: mute ? MUTED.value : undefined,
              }}
            >
              {value || (
                <em style={{ color: "#999", fontWeight: 400 }}>No answer</em>
              )}
            </div>
          </div>
          {extra.appendix}
        </div>
      );
    },
  },
  heading: {
    viewer: ({ props: { formItem, extra, variant } }) => {
      const tone = STATUS_ANSWER_STYLE[extra.status];
      const ancient = extra.status === "disabled";
      const weight =
        extra.status === "highlight" ? 700 : extra.status === "normal" ? 600 : 400;
      const mute = variant.reviewTone && (extra.parentDeleted || ancient);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...variant.shell,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: weight,
                color: mute ? MUTED.label : undefined,
              }}
            >
              {formItem.params.name || "(heading)"}
              {statusLabelBadge(tone.label, ancient)}
              {variant.badge}
              {extra.icon}
            </span>
          </div>
          {extra.appendix}
        </div>
      );
    },
  },
  panel: {
    viewer: ({ props: { formItem, extra, variant } }) => {
      const ancient = extra.status === "disabled";
      const mute = variant.reviewTone && (extra.parentDeleted || ancient);
      const border = variant.reviewTone
        ? STATUS_COLOR[extra.status]
        : variant.border;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={variant.shell}>
            <PanelBody
              formItem={formItem}
              extra={{ ...extra, appendix: undefined }}
              borderColor={border}
              readOnly
              badge={variant.badge}
              titleColor={mute ? MUTED.label : undefined}
            />
          </div>
          {extra.appendix}
        </div>
      );
    },
    repeatChildren: panelRepeatChildren,
  },
};
