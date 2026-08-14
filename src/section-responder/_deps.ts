/** Sibling re-exports for section-responder. See src/README.md import rules. */
export type {
  Children,
  ContextDom,
  ExtraDom,
  ParamsDom,
  TypedFormItem,
  VariantsDom,
  Viewers,
  WithChildren,
} from "../form";
export {
  branded,
  FormItemHOC,
  getUseImpRefViewProps,
} from "../form";
export type { MetaDom, RecursiveFormItem } from "../recursive-form";
export type {
  Indexed,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
} from "../form-edit";
export type {
  Response,
  ResponseSetter,
  StrictViewerMethods,
  ViewerMethods,
} from "../response";
export { emptyResponse, itemIdBase } from "../response";
