import type {
  ContextDom,
  ExtraDom,
  SomeFormItem,
  TheParams,
  TheVariants,
  TypedFormItem,
} from "./form.t";
import type { Viewers as ViewersType, WithChildren } from "./form-react.t";

export type TypeNames = "text" | "group";

export type Params = TheParams<{
  text: { label: string; showLabel: boolean; template?: boolean };
  group: {
    title: string;
    item: SomeFormItem<TypeNames, Params>;
    name?: TypedFormItem<Params, "text">;
  };
}>;

export type Variants = TheVariants<{
  text: "default" | "compact";
  group: "default" | "bordered";
}>;

export type Context = ContextDom & { accent: string };

export type Item = SomeFormItem<TypeNames, Params>;

export type Data = {
  variants: {
    text: Variants["text"];
    group: Variants["group"];
  };
  values: Record<string, string>;
  items: SomeFormItem<TypeNames, Params>[];
};

export type Props = Data & {
  accent: string;
  onValueChange: (id: string, value: string) => void;
};

/** Storybook Controls args — variant dropdowns map to `variants` on FormDemo. */
export type StoryArgs = Omit<Props, "variants" | "onValueChange"> & {
  textVariant: Variants["text"];
  groupVariant: Variants["group"];
};

type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

export type Extra = WithChildren<ItemExtra>;

export type Viewers = ViewersType<
  TypeNames,
  Params,
  Variants,
  Extra,
  Context,
  string
>;
