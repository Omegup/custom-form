import type { ReactNode } from "react";
import type {
  ContextDom,
  ExtraDom,
  SomeFormItem,
  TheParams,
  TheVariants,
  TypedFormItem,
} from "./form.t";
import type { GetChild, Viewers, WithChildren } from "./form-react.t";
import { branded } from "./branded";
import formDemoSource from "./FormDemo.tsx?raw";

// ── Types ─────────────────────────────────────────────────────────────────────

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

export type FormDemoData = {
  variants: {
    text: Variants["text"];
    group: Variants["group"];
  };
  values: Record<string, string>;
  items: SomeFormItem<TypeNames, Params>[];
};

export type Props = FormDemoData & {
  accent: string;
  onValueChange: (id: string, value: string) => void;
};

/** Storybook Controls args — variant dropdowns map to `variants` on FormDemo. */
export type FormStoryArgs = Omit<Props, "variants" | "onValueChange"> & {
  textVariant: Variants["text"];
  groupVariant: Variants["group"];
};

type ItemExtra = ExtraDom & {
  value: string;
  onChange: (value: string) => void;
};

export type Extra = WithChildren<ItemExtra>;

// ── Fixture ───────────────────────────────────────────────────────────────────

export const DEFAULT_FORM_DEMO: FormDemoData = {
  variants: {
    text: "default",
    group: "bordered",
  },
  values: {
    t: "Alice",
    g: "1,2",
    "g:1": "1,2,3",
    "g_name:1": "Eating",
    "g:1:1": "Apple",
    "g:1:2": "Banana",
    "g:1:3": "Carrot",
    "g:2": "1,2,3",
    "g_name:2": "Drinking",
    "g:2:1": "Soda",
    "g:2:2": "Water",
    "g:2:3": "Juice",
  },
  items: [
    {
      id: "t",
      type: "text",
      deleted: false,
      params: {
        label: "Name",
        showLabel: true,
      },
    },
    {
      id: "g",
      type: "group",
      deleted: false,
      params: {
        title: "Inventory",
        item: {
          id: "g",
          type: "group",
          deleted: false,
          params: {
            title: "Slot",
            name: {
              id: "g_name",
              type: "text",
              deleted: false,
              params: {
                label: "Name",
                showLabel: false,
              },
            },
            item: {
              id: "g",
              type: "text",
              deleted: false,
              params: {
                label: "Item {{id}}",
                showLabel: true,
                template: true,
              },
            },
          },
        },
      },
    },
  ],
};

// ── Storybook docs (sole `?raw` import) ─────────────────────────────────────

export const FORM_DEMO_SOURCE = formDemoSource;

// ── Story arg mapping ─────────────────────────────────────────────────────────

export const storyArgsToDemoProps = ({
  textVariant,
  groupVariant,
  ...rest
}: FormStoryArgs): Omit<Props, "onValueChange"> => ({
  ...rest,
  variants: { text: textVariant, group: groupVariant },
});

// ── Demo helpers (typing lives here, not in FormDemo.tsx) ─────────────────────

export const defineFormDemoViewers = (
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    Extra,
    Context,
    string
  >,
) => viewers;

export const formDemoLabel = (
  formItem: SomeFormItem<TypeNames, Params>,
) => {
  if (formItem.type !== "text") return "";
  const { label, template } = formItem.params;
  return template
    ? label.replace("{{id}}", formItem.id.split(":").pop() ?? "")
    : label;
};

export const Card = ({children}: {children: ReactNode}) => (
  <div style={{ background: "#f5f5f5", borderRadius: 4 }}>{children}</div>
);

export const bindFormDemoExtra = (
  formItem: SomeFormItem<TypeNames, Params>,
  suffix: string,
  values: Record<string, string>,
  onValueChange: (id: string, value: string) => void,
  render: (
    item: SomeFormItem<TypeNames, Params>,
    suffix: string,
  ) => ReactNode,
) =>
  branded<ItemExtra & GetChild, "viewer-extra">({
    value: values[formItem.id + suffix] ?? "",
    onChange: (value: string) => onValueChange(formItem.id + suffix, value),
    getChild: (childSuffix: string, index: number) => {
      if (formItem.type !== "group") return null;
      if (index === 0 && formItem.params.name)
        return render(formItem.params.name, suffix);
      return render(formItem.params.item, `${suffix}:${childSuffix}`);
    },
  });
