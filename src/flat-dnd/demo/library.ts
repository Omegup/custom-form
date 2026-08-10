/** Demo-only cross-package imports — see src/README.md import rules. */
export * from "../index";
export * from "../_deps";
export { defaultTheme } from "../../drag-drop-tree";
export type {
  Branded,
  Children,
  ContextDom,
  ExtraDom,
  RenderCard,
  TheVariants,
  VariantsDom,
  ViewerProps,
  Viewers,
} from "../../form";
export { branded } from "../../form";
export type { AutoFocus, AutoFocusState, MoveActions } from "../../move-actions";
export { autofocusCtx } from "../../move-actions";
export type { FlatFormItemEditSession, FlatFormItems, GetActionsArgs, Indexed, SectionMetaDom, SectionWithItems, Clone } from "../../form-edit";
export {
  applyFlatFormItem,
  buildItemSectionDict,
  cloneFlatItems,
  consolidateSections,
  getFormItemMoveActions,
} from "../../form-edit";
export { SectionFormItemHOC } from "../../section-view";
export type { EditExtra, RecursiveEditProps, SectionProps } from "../../section-view";
export type { MenuItemDefinition } from "../../side-menu";
export { AddFormItem, makeUseRenderAddItem } from "../../side-menu";
export { FLAT_DND_INITIAL } from "./fixtures";
