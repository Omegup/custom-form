/**
 * Update viewers + review HOC. Chrome/follow-up button come from the form-review demo.
 */
import { formChrome } from "../../form-review/demo/formReviewDemoHelper";
import { reviewVariants, reviewViewers } from "../../section-review/demo/reviewViewers";
import { tCommon } from "../../section-review/demo/sectionReviewDemoHelper";
import type * as types from "./formResponseDemoTypes.t";
import * as lib from "./library";

export { reviewVariants, tCommon };

export const FormReview = lib.CustomFormReviewHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  lib.SectionReviewContext,
  types.Section
>(reviewViewers, formChrome);

export const reviewCtx = lib.branded<lib.SectionReviewContext, "context">({});
