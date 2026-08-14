/**
 * Fill viewers + responder chrome. Field methods come from the form-responder demo.
 */
import type { Ref } from "react";
import { formChrome } from "../../form-responder/demo/formResponderDemoHelper";
import { useFieldMethods } from "../../form-responder/demo/formResponderDemoHelper";
import { FOLLOW_UP_BADGE } from "./formResponseDemoHelper";
import type * as types from "./formResponseDemoTypes.t";
import * as lib from "./library";

const defaultVariant: types.FieldVariant = {
  border: "#ccc",
  background: "#fff",
  badge: null,
  shell: {},
  errorBorder: "#c00",
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
  errorBorder: "#c00",
  reviewTone: false,
};

const variants = lib.branded<types.Variants, "variants">({ field: defaultVariant });
const followUpVariants = lib.branded<types.Variants, "variants">({
  field: followUpVariant,
});

export const responderVariants: Record<lib.ResponderState, types.Variants> = {
  default: variants,
  old: variants,
  change: followUpVariants,
  error: variants,
};

const fillChrome: lib.FormResponderChrome = {
  ...formChrome,
  renderFollowUpGroup: ({ items }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 8,
        marginLeft: 8,
        padding: "8px 8px 8px 12px",
        borderLeft: `3px solid ${followUpVariant.border}`,
        background: followUpVariant.background,
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

const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.FillExtra & lib.Children,
  lib.ResponderExtra & { impRef: Ref<lib.StrictViewerMethods> },
  lib.SectionResponderContext,
  string
> = {
  field: {
    viewer: ({ props: { formItem, extra, variant } }) => {
      const { setDataValue, value } = useFieldMethods(
        extra.impRef,
        extra.response,
        formItem.params.required,
        formItem.params.name,
      );
      const err = typeof extra.error === "string" ? extra.error : extra.error ? "Invalid" : null;
      const border =
        extra.error && variant.errorBorder ? variant.errorBorder : variant.border;
      return (
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            ...variant.shell,
          }}
        >
          <span>
            {formItem.params.name}
            {formItem.params.required ? " *" : ""}
            {variant.badge}
            {extra.icon}
          </span>
          <input
            value={value}
            onChange={(e) => setDataValue(e.target.value)}
            disabled={extra.response.setValue == null}
            style={{
              padding: "6px 8px",
              border: `1px solid ${border}`,
              borderRadius: 4,
              background: variant.background,
            }}
          />
          {err ? <span style={{ color: "#c00", fontSize: 12 }}>{err}</span> : null}
          {extra.appendix}
        </label>
      );
    },
  },
};

export const FormResponder = lib.CustomFormResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionResponderContext,
  types.Section
>(viewers, fillChrome);

export const fillCtx = lib.branded<lib.SectionResponderContext, "context">({
  t: (term) => (term === "fieldRequired" ? "This field is required" : term),
});
