/** Demo-only cross-package imports — see src/README.md import rules. */
export * from "../index";
export * from "../_deps";
export type { AutoFocusState } from "../../move-actions";
export { autofocusCtx } from "../../move-actions";
export {
  applyFlatFormItem,
  buildItemSectionDict,
  cloneFlatItems,
  consolidateSections,
  getFormItemMoveActions,
} from "../../form-edit";
export type { MenuItemDefinition } from "../../side-menu";
export { AddFormItem, makeUseRenderAddItem } from "../../side-menu";
export type { ColumnsEditChrome } from "../index";
export { SECTION_VIEW_INITIAL } from "./fixtures";
