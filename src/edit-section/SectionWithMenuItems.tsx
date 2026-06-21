/**
 * SectionHOC + menu-driven add-item slots.
 * Ported from school form-edit-react/SectionWithMenuItems.tsx.
 */
import type {
  ContextDom,
  ParamsDom,
  ReactNode,
  SectionDom,
  TheVariants,
} from "./_deps";
import type { AutoFocus } from "../move-actions/autofocus.t";
import type { MenuItemDefinition } from "./_deps";
import type { AddFormItemProps, RenderFormItem, SectionExtraDom, SectionProps } from "./types";
import { SectionHOC } from "./SectionHOC";
import { makeUseRenderAddItem } from "./makeUseRenderAddItem";

export const SectionWithMenuItemsHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends TheVariants<Record<TypeNames, string>>,
  SectionConfig extends SectionDom,
  Context extends ContextDom,
  Extra extends SectionExtraDom,
  Meta extends import("./_deps").MetaDom<{ index: number; total: number; sIndex: number }>,
>(args: {
  random: () => string;
  renderEdit: Parameters<
    typeof SectionHOC<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      Context,
      Extra,
      Meta
    >
  >[0]["renderEdit"];
  renderAddItem: (
    args: AddFormItemProps<TypeNames, Params, AutoFocus<Context, unknown>, Meta>,
  ) => ReactNode;
  useMenuItems: () => MenuItemDefinition<TypeNames, Params>[];
  renderTitle: (
    props: SectionProps<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      AutoFocus<Context, unknown>,
      Extra,
      Meta
    >,
  ) => ReactNode;
  renderFormItem: RenderFormItem<
    TypeNames,
    Params,
    Variants,
    SectionConfig,
    AutoFocus<Context, unknown>,
    Extra,
    Meta
  >;
}) => {
  const { random, renderEdit, renderAddItem, useMenuItems, renderTitle, renderFormItem } =
    args;
  return SectionHOC<
    TypeNames,
    Params,
    Variants,
    SectionConfig,
    Context,
    Extra,
    Meta
  >({
    renderEdit,
    useRenderAddItem: makeUseRenderAddItem(renderAddItem, useMenuItems, random),
    renderTitle,
    renderFormItem,
  });
};
