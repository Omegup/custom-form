import type React from "react";
import type {
  ContextDom,
  ExtraDom,
  FormItemProps,
  GetChild,
  TheParams,
  TheVariants,
  Viewers as ViewersType,
  WithChildren,
  WithGetChild,
} from "../../form";
import type { RecursiveFormItem } from "../RecursiveFormItem.t";

export type TypeNames = "text" | "group";

export type Params = TheParams<{
  text: { label: string };
  group: { title: string };
}>;

export type Variants = TheVariants<{
  text: "default" | "compact";
  group: "default" | "bordered";
}>;

export type Context = ContextDom & { accent: string };

export type Item = RecursiveFormItem<TypeNames, Params, never, 1>;

export type Data = {
  variants: {
    text: Variants["text"];
    group: Variants["group"];
  };
  values: Record<string, string>;
  items: Item[];
};

/** Storybook Controls args — variant dropdowns map to `variants` on RecursiveFormDemo. */
export type StoryArgs = Omit<Data, "variants"> & {
  accent: string;
  textVariant: Variants["text"];
  groupVariant: Variants["group"];
};

export type ValueExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

export type Viewers<Extra extends ExtraDom = ExtraDom> = ViewersType<
  TypeNames,
  Params,
  Variants,
  WithChildren<Extra>,
  Context,
  string
>;

export type FormItemComponent<Extra extends ExtraDom = ExtraDom> = (
  props: FormItemProps<
    Params,
    Variants,
    TypeNames,
    WithGetChild<Extra>,
    Context
  >,
) => React.ReactNode;

export type ItemRender = (item: Item, suffix: string) => React.ReactNode;

export type ExtraFactory<Extra extends ExtraDom = ExtraDom> = (
  formItem: Item,
  render: ItemRender,
  suffix: string,
) => Extra & GetChild;

export type RenderItem = <Extra extends ExtraDom>(
  formItem: Item,
  variants: Variants,
  ctx: Context,
  FormItem: FormItemComponent<Extra>,
  extra: ExtraFactory<Extra>,
) => React.ReactNode;

export type RecursiveFormDemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
