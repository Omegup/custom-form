/**
 * Update viewers + review HOC. Chrome/follow-up button come from the form-review demo.
 */
import type { Ref } from "react";
import {
  defaultVariant,
  followUpVariant,
} from "../../form-item-editor/demo/itemVariants";
import { formChrome } from "../../form-review/demo/formReviewDemoHelper";
import { ReviewFieldViewer } from "../../section-review/demo/ReviewFieldViewer";
import {
  headingView,
  panelRepeatChildren,
  panelView,
} from "../../response/demo/nestedItems";
import type * as types from "./formResponseDemoTypes.t";
import * as lib from "./library";

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
    viewer: ({ props: { formItem, extra, variant } }) => (
      <ReviewFieldViewer
        name={formItem.params.name}
        required={formItem.params.required}
        extra={extra}
        variant={variant}
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

const variants = lib.branded<types.Variants, "variants">(defaultVariant);
const followUpVariants = lib.branded<types.Variants, "variants">(followUpVariant);

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

export const tCommon = (term: "cancel" | "save" | "delete") =>
  ({ cancel: "Cancel", save: "Save", delete: "Delete" })[term];
