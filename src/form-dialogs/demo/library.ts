/** Demo-only cross-package imports — see src/README.md import rules. */
export * from "../index";
export * from "../_deps";
export type { AutoFocus, AutoFocusState, MoveActions } from "../../move-actions";
export { autofocusCtx } from "../../move-actions";
export {
  buildItemSectionDict,
  cloneFlatItems,
  consolidateSections,
  getFormItemMoveActions,
} from "../../form-edit";
export type { Clone } from "../../form-edit";
export {
  SectionFormItemHOC,
  type ColumnsEditChrome,
  type EditExtra,
  type SectionProps,
} from "../../section-view";
export type { FlatNestedItem } from "../../form-edit";
export { AddFormItem, makeUseRenderAddItem, Side } from "../../side-menu";
export type {
  Response,
  ResponseSetter,
  StrictViewerMethods,
  ViewerMethods,
} from "../../response";
export { emptyResponse } from "../../response";
export type {
  ResponderExtra,
  SectionResponderChrome,
  SectionResponderContext,
  SectionValidator,
} from "../../section-responder";
export { SectionResponderHOC } from "../../section-responder";
export type { FormResponderChrome } from "../../form-responder";
export { CustomFormResponderHOC } from "../../form-responder";
export type {
  Addition,
  AdditionalChanges,
  ReviewExtra,
  ReviewStatus,
  SectionReviewChrome,
  SectionReviewContext,
} from "../../section-review";
export type { FormReviewChrome } from "../../form-review";
export { CustomFormReviewHOC } from "../../form-review";
export type { Children, SomeFormItem, Viewers, ViewerProps } from "../../form";
export { branded } from "../../form";
