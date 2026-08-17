/**
 * Fill viewers + responder chrome. Field methods come from the form-responder demo.
 */
import { FollowUpRail } from "../../demo-utils";
import { followUpVariant as followUpItemVariant } from "../../form-item-editor/demo/itemVariants";
import { formChrome } from "../../form-responder/demo/formResponderDemoHelper";
import { defaultFillVariant } from "../../response/demo/FillFieldViewer";
import { fillViewers } from "../../response/demo/nestedItems";
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
    <FollowUpRail
      border={followUpVariant.border}
      background={followUpVariant.background}
      label="Follow-up"
    >
      {items}
    </FollowUpRail>
  ),
};

export const FormResponder = lib.CustomFormResponderHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionResponderContext,
  types.Section
>(fillViewers, fillChrome);

export const fillCtx = lib.branded<lib.SectionResponderContext, "context">({
  t: (term) => (term === "fieldRequired" ? "This field is required" : term),
});
