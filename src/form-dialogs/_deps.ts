/** Sibling re-exports for form-dialogs. See src/README.md import rules. */
export * from "../form";
export * from "../recursive-form";
export type {
  FlatFormItem,
  FlatFormItems,
  FlatFormItemEditSession,
  Indexed,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SIndexed,
} from "../form-edit";
export {
  applyFlatFormItem,
  consolidateSections,
  openFormItemEditSession,
  openFormItemInsertSession,
} from "../form-edit";
export type { FlatSectionEditSession } from "../section-edit";
export { openSectionEditSession, updateSectionInFlat } from "../section-edit";
