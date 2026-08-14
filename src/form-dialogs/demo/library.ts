/** Demo-only cross-package imports — see src/README.md import rules. */
export * from "../index";
export * from "../_deps";
export type { AutoFocus, AutoFocusState, MoveActions } from "../../move-actions";
export { autofocusCtx } from "../../move-actions";
export {
  buildItemSectionDict,
  cloneFlatItems,
  consolidateSections,
  flatten,
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
export type { NewFormItem } from "../../side-menu/createBlankFormItem";
export type {
  Response,
  ResponseSetter,
  StrictViewerMethods,
  ViewerMethods,
} from "../../response";
export { emptyResponse, itemIdBase } from "../../response";
export {
  PANEL_INSTANCES_KEY,
  parsePanelInstanceIds,
  panelInstanceSuffixes,
  nextPanelInstanceId,
  withPanelInstances,
} from "../../response";
export {
  followUpEntriesToFlat,
  syncFollowUpEntriesFromFlat,
} from "../../section-review";
export {
  appendFeedback,
  buildSend,
  canSend,
  formResponseValues,
  lastAnsweredAt,
  remarkOnlyChanges,
  saveAdditionalQuestions,
  stampAnswerHistory,
  toFormResponseEntries,
  unansweredFollowUpIds,
  useFormResponseReview,
  useFormResponseSend,
  followUpsByOrigin,
  withoutUnlockComments,
} from "../../form-response";
export type {
  FeedbackHistoryItem,
  FeedbackStatus,
  FormResponseDoc,
  FormResponseEntry,
  FormResponseValidator,
} from "../../form-response";
export type {
  ResponderAdditionalChanges,
  ResponderExtra,
  ResponderState,
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
  ReviewFormItemEntry,
  ReviewFormItemsEditorArgs,
  ReviewStatus,
  ReviewVariantState,
  SectionReviewChrome,
  SectionReviewContext,
} from "../../section-review";
export type { FormReviewChrome } from "../../form-review";
export { CustomFormReviewHOC } from "../../form-review";
export type { Children, SomeFormItem, TypedFormItem, Viewers, ViewerProps } from "../../form";
export { branded } from "../../form";
