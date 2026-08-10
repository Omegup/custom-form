/** Demo-only cross-package imports — see src/README.md import rules. */
export * from "../index";
export * from "../_deps";
export type { AutoFocus, AutoFocusState, MoveActions } from "../../move-actions";
export { autofocusCtx } from "../../move-actions";
export {
  buildItemSectionDict,
  cloneFlatItems,
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
