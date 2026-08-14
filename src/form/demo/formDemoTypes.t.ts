import type {
  ContextDom,
  ExtraDom,
  SomeFormItem,
  TheParams,
  TheVariants,
  TypedFormItem,
} from "../form.t";
import type { Children, Viewers as ViewersType } from "../form-react.t";

export type TypeNames = "text" | "group";

export type Params = TheParams<{
  text: { label: string; showLabel: boolean; template?: boolean };
  group: {
    title: string;
    item: SomeFormItem<TypeNames, Params>;
    name?: TypedFormItem<Params, "text">;
  };
}>;

export type TextVariant = { padding: number };
export type GroupVariant = { showBorder: boolean };

export type Variants = TheVariants<{
  text: TextVariant;
  group: GroupVariant;
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

/** Storybook Controls — name keys map to chrome values at the host boundary. */
export type StoryArgs = Omit<Props, "variants" | "onValueChange"> & {
  textVariant: "default" | "compact";
  groupVariant: "default" | "bordered";
};

export type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

export type ViewerExtra = ItemExtra & Children;

export type Viewers = ViewersType<
  TypeNames,
  Params,
  Variants,
  ViewerExtra,
  ItemExtra,
  Context,
  string
>;
