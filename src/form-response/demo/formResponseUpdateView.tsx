/**
 * Update viewers + review HOC. Chrome/follow-up button come from the form-review demo.
 */
import {
  defaultVariant,
  followUpVariant,
} from "../../form-item-editor/demo/itemVariants";
import { formChrome } from "../../form-review/demo/formReviewDemoHelper";
import { reviewViewers } from "../../section-review/demo/reviewViewers";
import type * as types from "./formResponseDemoTypes.t";
import * as lib from "./library";

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
>(reviewViewers, formChrome);

export const reviewCtx = lib.branded<lib.SectionReviewContext, "context">({});

export const tCommon = (term: "cancel" | "save" | "delete") =>
  ({ cancel: "Cancel", save: "Save", delete: "Delete" })[term];
