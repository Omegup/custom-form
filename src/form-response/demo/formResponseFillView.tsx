/**
 * Fill viewers + responder chrome. Field methods come from the form-responder demo.
 */
import type { Ref } from "react";
import { followUpVariant as followUpItemVariant } from "../../form-item-editor/demo/itemVariants";
import { formChrome } from "../../form-responder/demo/formResponderDemoHelper";
import { FillFieldViewer, defaultFillVariant } from "../../response/demo/FillFieldViewer";
import {
  headingView,
  panelRepeatChildren,
  panelView,
} from "../../response/demo/nestedItems";
import { PRIOR_BADGE } from "./formResponseDemoHelper";
import type * as types from "./formResponseDemoTypes.t";
import * as lib from "./library";

const defaultVariant: types.FieldVariant = {
  ...defaultFillVariant,
  reviewTone: true,
};

const oldVariant: types.FieldVariant = {
  border: "#9ca3af",
  background: "#f4f4f5",
  badge: PRIOR_BADGE,
  shell: {},
  errorBorder: "#c00",
  reviewTone: true,
};

const followUpVariant: types.FieldVariant = {
  ...followUpItemVariant,
  errorBorder: "#c00",
};

const variants = lib.branded<types.Variants, "variants">(defaultVariant);
const oldVariants = lib.branded<types.Variants, "variants">(oldVariant);
const followUpVariants = lib.branded<types.Variants, "variants">(followUpVariant);

export const responderVariants: Record<lib.ResponderState, types.Variants> = {
  default: variants,
  old: oldVariants,
  change: followUpVariants,
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
    viewer: ({ props: { formItem, extra, variant } }) => (
      <FillFieldViewer
        name={formItem.params.name}
        required={formItem.params.required}
        extra={extra}
        variant={{
          ...variant,
          errorBorder: variant.errorBorder ?? null,
        }}
      />
    ),
  },
  heading: {
    viewer: headingView,
    repeatChildren: () => [""],
  },
  panel: {
    viewer: panelView,
    repeatChildren: panelRepeatChildren,
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
