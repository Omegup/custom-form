import type { SomeFormItem, TheParams, TheVariants } from "./form.t";

export type FormDemoTypeNames = "text" | "group";

export type FormDemoParams = TheParams<{
  text: { label: string };
  group: { title: string; item: SomeFormItem<FormDemoTypeNames, FormDemoParams> };
}>;

export type FormDemoVariants = TheVariants<{
  text: "default" | "compact";
  group: "default" | "bordered";
}>;

export type FormDemoData = {
  variants: {
    text: FormDemoVariants["text"];
    group: FormDemoVariants["group"];
  };
  values: Record<string, string>;
  items: SomeFormItem<FormDemoTypeNames, FormDemoParams>[];
};

export const DEFAULT_FORM_DEMO: FormDemoData = {
  variants: {
    text: "default",
    group: "bordered",
  },
  values: {
    t: "Alice",
    g: "1,2,3",
    "g:1": "Apple",
    "g:2": "Banana",
    "g:3": "Carrot",
  },
  items: [
    {
      id: "t",
      type: "text",
      deleted: false,
      params: {
        label: "Name",
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
          type: "text",
          deleted: false,
          params: {
            label: "Item",
          },
        },
      },
    },
  ],
};

export const isFormDemoData = (value: unknown): value is FormDemoData =>
  typeof value === "object" &&
  value !== null &&
  "variants" in value &&
  "values" in value &&
  "items" in value &&
  Array.isArray(value.items);
