/** Demo-only cross-package imports — see src/README.md import rules. */
export * from "../index";
export type {
  ContextDom,
  ExtraDom,
  TheParams,
  TheVariants,
  TypedFormItem,
  Children,
  Viewers,
} from "../../form";
export { branded } from "../../form";
export type { MetaDom, RecursiveFormItem } from "../../recursive-form";
export type {
  Indexed,
  SectionMetaDom,
  SectionWithItems,
} from "../../form-edit";
export type {
  Response,
  ResponseSetter,
  StrictViewerMethods,
  ViewerMethods,
} from "../../response";
export { emptyResponse } from "../../response";
