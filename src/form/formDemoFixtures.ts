import type {
  SomeFormItem,
  TheParams,
  TheVariants,
  TypedFormItem,
} from "./form.t";

export type FormDemoTypeNames = "text" | "group";

export type FormDemoParams = TheParams<{
  text: { label: string; showLabel: boolean, template?: boolean };
  group: {
    title: string;
    item: SomeFormItem<FormDemoTypeNames, FormDemoParams>;
    name?: TypedFormItem<FormDemoParams, "text">;
  };
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
