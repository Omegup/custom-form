/**
 * Update viewers + review HOC. Chrome/follow-up button come from the form-review demo.
 */
import type { Ref } from "react";
import { formChrome } from "../../form-review/demo/formReviewDemoHelper";
import { FOLLOW_UP_BADGE } from "./formResponseDemoHelper";
import type * as types from "./formResponseDemoTypes.t";
import * as lib from "./library";

const STATUS_COLOR: Record<lib.ReviewStatus, string> = {
  normal: "#22883e",
  disabled: "#ccc",
  highlight: "#333",
};

const defaultVariant: types.FieldVariant = {
  border: "#ccc",
  background: "#fafafa",
  badge: null,
  shell: {},
  reviewTone: true,
};

const followUpVariant: types.FieldVariant = {
  border: "#e6b800",
  background: "#fffbeb",
  badge: FOLLOW_UP_BADGE,
  shell: {
    padding: 8,
    borderRadius: 6,
    background: "#fffbeb",
    border: "1px solid #e6b800",
  },
  reviewTone: false,
};

const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.ReviewExtra & lib.Children,
  lib.ReviewExtra & { impRef: Ref<lib.StrictViewerMethods> },
  lib.SectionReviewContext,
  string
> = {
  field: {
    viewer: ({ props: { formItem, extra, variant } }) => {
      const value = extra.response.value.data.value ?? "";
      const newlyAnswered = extra.status === "highlight";
      const mute = variant.reviewTone && extra.parentDeleted;
      const border = variant.reviewTone
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
                fontWeight: newlyAnswered ? 700 : 400,
                color: mute ? "#777" : undefined,
              }}
            >
              {newlyAnswered ? (
                <strong>{formItem.params.name}</strong>
              ) : (
                <span>{formItem.params.name}</span>
              )}
              {variant.badge}
              {extra.icon}
            </span>
            <div
              style={{
                padding: "6px 8px",
                border: `1px solid ${border}`,
                borderRadius: 4,
                background: mute ? "#f0f0f0" : variant.background,
                fontWeight: newlyAnswered ? 700 : 400,
                color: mute ? "#666" : undefined,
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
};

const variants = lib.branded<types.Variants, "variants">({ field: defaultVariant });
const followUpVariants = lib.branded<types.Variants, "variants">({
  field: followUpVariant,
});

export const reviewVariants: Record<lib.ReviewVariantState, types.Variants> = {
  default: variants,
  change: followUpVariants,
};

export const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionReviewContext,
  types.Section
>(viewers, formChrome);

export const reviewCtx = lib.branded<lib.SectionReviewContext, "context">({});

export const tCommon = (term: "add" | "cancel" | "save" | "delete") =>
  ({ add: "Add", cancel: "Cancel", save: "Save", delete: "Delete" })[term];
