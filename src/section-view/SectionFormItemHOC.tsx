/**
 * Thin compose — school `SectionFormItemHOC` equivalent: wires viewers
 * (`createRenderEditFormItem`) and an injected `useRenderAddItem` (e.g.
 * `side-menu`'s `makeUseRenderAddItem(...)`, composed by the caller) into
 * `SectionHOC`, defaulting the layout to `ColumnsEdit`.
 */
import type { ReactNode } from "react";
import type {
  AutoFocus,
  Children,
  ContextDom,
  ExtraDom,
  FlatFormItemEditSession,
  ParamsDom,
  SectionDom,
  VariantsDom,
  Viewers,
} from "./_deps";
import { ColumnsEdit } from "./ColumnsEdit";
import { createRenderEditFormItem } from "./createRenderEditFormItem";
import { SectionHOC } from "./SectionHOC";
import type { EditExtra, NodeIndex, RecursiveEditProps, SectionProps } from "./types";

export const SectionFormItemHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  SectionConfig extends SectionDom,
  Context extends ContextDom,
  Extra extends ExtraDom,
>(args: {
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    Extra & EditExtra & Children,
    Extra & EditExtra,
    AutoFocus<Context, boolean>,
    string
  >;
  useRenderAddItem: (
    setAddItem: (session: FlatFormItemEditSession<TypeNames, Params>) => void,
  ) => (node: NodeIndex) => ReactNode;
  renderTitle: (
    props: SectionProps<TypeNames, Params, Variants, SectionConfig, Context, Extra>,
  ) => ReactNode;
  /** Defaults to `ColumnsEdit` (no DnD). */
  renderEdit?: (
    props: RecursiveEditProps<TypeNames, Params, SectionConfig>,
  ) => ReactNode;
}) =>
  SectionHOC<TypeNames, Params, Variants, SectionConfig, Context, Extra>({
    renderEdit: args.renderEdit ?? ColumnsEdit,
    useRenderAddItem: args.useRenderAddItem,
    renderTitle: args.renderTitle,
    renderFormItem: createRenderEditFormItem<TypeNames, Params, Variants, Extra, Context>(
      args.viewers,
    ),
  });
