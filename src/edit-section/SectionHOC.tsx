/**
 * Section edit shell — wires RecursiveEditManager, title, add-item slots, and item renderers.
 * Ported from school form-edit-react/Section.tsx.
 */
import type {
  ContextDom,
  ParamsDom,
  ReactNode,
  SectionDom,
  TheVariants,
} from "./_deps";
import { getSectionEdit } from "./_deps";
import type {
  NodeIndex,
  RecursiveEditProps,
  RenderFormItem,
  SectionExtraDom,
  SectionProps,
} from "./types";
import type { AutoFocus } from "../move-actions/autofocus.t";

export type {
  SectionProps,
  SectionExtraDom,
  RenderFormItemArgs,
  RenderFormItem,
  RecursiveEditProps,
  NodeIndex,
} from "./types";

export const SectionHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends TheVariants<Record<TypeNames, string>>,
  SectionConfig extends SectionDom,
  Ctx extends ContextDom,
  Extra extends SectionExtraDom,
  Meta extends import("./_deps").MetaDom<{ index: number; total: number; sIndex: number }>,
>(args: {
  renderEdit: (
    props: RecursiveEditProps<TypeNames, Params, AutoFocus<Ctx, unknown>, Meta>,
  ) => ReactNode;
  useRenderAddItem: (
    setAddItem: SectionProps<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      AutoFocus<Ctx, unknown>,
      Extra,
      Meta
    >["setAddItem"],
    ctx: AutoFocus<Ctx, unknown>,
  ) => (node: NodeIndex) => ReactNode;
  renderTitle: (
    props: SectionProps<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      AutoFocus<Ctx, unknown>,
      Extra,
      Meta
    >,
  ) => ReactNode;
  renderFormItem: RenderFormItem<
    TypeNames,
    Params,
    Variants,
    SectionConfig,
    AutoFocus<Ctx, unknown>,
    Extra,
    Meta
  >;
}) => {
  const { renderEdit, useRenderAddItem, renderTitle, renderFormItem } = args;
  return (
    props: SectionProps<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      AutoFocus<Ctx, unknown>,
      Extra,
      Meta
    >,
  ) => {
    const { ctx, edit, setAddItem } = props;
    const addItem = useRenderAddItem(setAddItem, ctx);
    return renderEdit({
      edit: getSectionEdit(edit, ctx),
      ctx,
      render: { addItem, node: renderFormItem(props) },
      title: renderTitle(props),
    });
  };
};
