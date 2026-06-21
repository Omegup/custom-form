import type {
  Branded,
  ContextDom,
  MetaDom,
  ParamsDom,
  ReactNode,
  RecursiveEditManager,
  RecursiveFormItem,
  SectionDom,
  SectionEditArgs,
  SectionWithItems,
  MenuItemDefinition,
} from "./_deps";
import type { AutoFocus } from "../move-actions/autofocus.t";
import type { TheVariants } from "../form";

export type EditFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
> = RecursiveFormItem<TypeNames, Params, Meta> | null;

export type SectionExtraDom = Branded<unknown, "section-extra">;

export type SectionProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends TheVariants<Record<TypeNames, string>>,
  SectionConfig extends SectionDom,
  Context extends AutoFocus<ContextDom, unknown>,
  Extra extends SectionExtraDom,
  Meta extends MetaDom<{ index: number; total: number; sIndex: number }> = MetaDom<{
    index: number;
    total: number;
    sIndex: number;
  }>,
> = {
  ctx: Context;
  extra: Extra;
  variants: Variants;
  edit: SectionEditArgs<
    TypeNames,
    Params,
    Context,
    SectionConfig,
    { section: { index: number; total: number } },
    Meta
  >;
  setAddItem: (q: EditFormItem<TypeNames, Params, Meta>) => void;
};

export type RenderFormItemArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
> = {
  item: RecursiveFormItem<TypeNames, Params, Meta>;
  children: ReactNode;
  parentDeleted: boolean;
  index: number;
};

export type RenderFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends TheVariants<Record<TypeNames, string>>,
  SectionConfig extends SectionDom,
  Context extends AutoFocus<ContextDom, unknown>,
  Extra extends SectionExtraDom,
  Meta extends MetaDom<{ index: number; total: number; sIndex: number }> = MetaDom<{
    index: number;
    total: number;
    sIndex: number;
  }>,
> = (
  props: SectionProps<TypeNames, Params, Variants, SectionConfig, Context, Extra, Meta>,
) => (args: RenderFormItemArgs<TypeNames, Params, Meta>) => ReactNode;

export type EditExtra = { parentDeleted: boolean; index: number };

export type NodeIndex = { index: number; sIndex: number };

export type AddFormItemProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context extends ContextDom,
  Meta extends MetaDom = MetaDom,
> = {
  item: NodeIndex;
  ctx: Context;
  menuItems: MenuItemDefinition<TypeNames, Params>[];
  random: () => string;
  setAddItem: (
    item: EditFormItem<TypeNames, Params, Meta>,
    ctx: (previous: Context) => Context,
  ) => void;
};

export type RecursiveEditProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Context,
  Meta extends MetaDom<{ index: number; total: number; sIndex: number }>,
> = {
  edit: RecursiveEditManager<TypeNames, Params, Meta>;
  title: ReactNode;
  ctx: Context;
  render: {
    addItem: (node: NodeIndex) => ReactNode;
    node: (args: RenderFormItemArgs<TypeNames, Params, Meta>) => ReactNode;
  };
};

export type { SectionEditArgs, SectionWithItems };
