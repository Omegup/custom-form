/**
 * Full section edit factory — viewers + menu + card chrome.
 * Ported from school form-edit-react/SectionFormItem.tsx.
 */
import type {
  ContextDom,
  ExtraDom,
  ParamsDom,
  ReactNode,
  RenderCard,
  SectionDom,
  TheVariants,
  Viewers,
  WithChildren,
} from "./_deps";
import type { AutoFocus } from "../move-actions/autofocus.t";
import type { MenuItemDefinition } from "./_deps";
import type {
  AddFormItemProps,
  EditExtra,
  RenderFormItemArgs,
  SectionExtraDom,
  SectionProps,
} from "./types";
import { createRenderEditFormItem } from "./createRenderEditFormItem";
import { SectionWithMenuItemsHOC } from "./SectionWithMenuItems";

export const SectionFormItemHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends TheVariants<Record<TypeNames, string>>,
  SectionConfig extends SectionDom,
  Extra extends ExtraDom,
  Ctx extends ContextDom,
  SectionExtra extends SectionExtraDom & { items: (id: string) => Extra },
  Meta extends import("./_deps").MetaDom<{ index: number; total: number; sIndex: number }>,
>(args: {
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    WithChildren<Extra & EditExtra>,
    AutoFocus<Ctx, unknown>,
    string
  >;
  useMenuItems: () => MenuItemDefinition<TypeNames, Params>[];
  random: () => string;
  renderEdit: Parameters<
    typeof SectionWithMenuItemsHOC<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      Ctx,
      SectionExtra,
      Meta
    >
  >[0]["renderEdit"];
  renderAddItem: (
    args: AddFormItemProps<TypeNames, Params, AutoFocus<Ctx, unknown>, Meta>,
  ) => ReactNode;
  renderTitle: (
    props: SectionProps<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      AutoFocus<Ctx, unknown>,
      SectionExtra,
      Meta
    >,
  ) => ReactNode;
  renderCard: (
    props: SectionProps<
      TypeNames,
      Params,
      Variants,
      SectionConfig,
      AutoFocus<Ctx, unknown>,
      SectionExtra,
      Meta
    >,
    args: RenderFormItemArgs<TypeNames, Params, Meta>,
  ) => RenderCard<TypeNames, Params, Variants, Extra & EditExtra, AutoFocus<Ctx, unknown>>;
}) => {
  const { viewers, useMenuItems, random, renderEdit, renderAddItem, renderTitle, renderCard } =
    args;
  const renderFormItem = createRenderEditFormItem(viewers);
  return SectionWithMenuItemsHOC<
    TypeNames,
    Params,
    Variants,
    SectionConfig,
    Ctx,
    SectionExtra,
    Meta
  >({
    random,
    renderEdit,
    renderAddItem,
    useMenuItems,
    renderTitle,
    renderFormItem: (props) => (itemArgs) =>
      renderFormItem({
        extra: props.extra,
        variants: props.variants,
        ctx: props.ctx,
        item: itemArgs.item,
        children: itemArgs.children,
        parentDeleted: itemArgs.parentDeleted,
        index: itemArgs.index,
        renderCard: renderCard(props, itemArgs),
      }),
  });
};
