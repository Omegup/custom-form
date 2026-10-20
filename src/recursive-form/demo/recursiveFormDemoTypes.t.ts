import type React from "react";
import type {
  Children,
  ContextDom,
  ExtraDom,
  FormItemProps,
  GetChild,
  TheParams,
  TheVariants,
  Viewers as ViewersType,
} from "../../form";
import type { RecursiveFormItem } from "../RecursiveFormItem.t";

export type TypeNames = "text" | "group";

export type Params = TheParams<{
  text: { label: string };
  group: { title: string };
}>;

export type Variants = TheVariants<{
  padding: number;
  showBorder: boolean;
}>;

export type Context = ContextDom & { accent: string };

export type Item = RecursiveFormItem<TypeNames, Params, never, 1>;

export type Data = {
  variants: Variants;
  values: Record<string, string>;
  items: Item[];
};

/** Storybook Controls — name keys map to chrome values at the host boundary. */
export type StoryArgs = Omit<Data, "variants"> & {
  accent: string;
  textVariant: "default" | "compact";
  groupVariant: "default" | "bordered";
};

export type ValueExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

export type GetChildExtra<Extra extends ExtraDom = ExtraDom> = Extra & GetChild;

export type ViewerExtra<Extra extends ExtraDom = ExtraDom> = Extra & Children;

export type Viewers<Extra extends ExtraDom = ExtraDom> = ViewersType<
  TypeNames,
  Params,
  Variants,
  ViewerExtra<Extra>,
  Extra,
  Context,
  string
>;

export type ViewersDecorator = <Extra extends ExtraDom>(
  inner: Viewers<Extra>,
) => Viewers<Extra>;

export type FormItemComponent<Extra extends ExtraDom = ExtraDom> = (
  props: FormItemProps<
    Params,
    Variants,
    TypeNames,
    Extra & GetChild,
    ViewerExtra<Extra>,
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
