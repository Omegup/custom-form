/** Sibling re-exports for form-dialogs. See src/README.md import rules. */
export * from "../form";
export * from "../recursive-form";
export type {
  FlatFormItem,
  FlatFormItems,
  FlatFormItemEditSession,
  FlatNestedItem,
  Indexed,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SIndexed,
  Clone,
  FlatInsertSpan,
} from "../form-edit";
export {
  applyFlatFormItem,
  buildItemSectionDict,
  consolidateSections,
  extrasByItemId,
  getFormItemMoveActions,
  openFormItemEditSession,
  openFormItemInsertSession,
  patchFormItemEditSession,
  AMBIGUOUS_INSERT_SPAN,
} from "../form-edit";
export type { AutoFocus, AutoFocusState } from "../move-actions";
export { autofocusCtx } from "../move-actions";
export type { FlatSectionEditSession } from "../section-edit";
export { openSectionEditSession, updateSectionInFlat } from "../section-edit";
