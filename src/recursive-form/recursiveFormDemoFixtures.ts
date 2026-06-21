import type { TheParams, TheVariants } from "../form";
import type { RecursiveFormItem } from "./RecursiveFormItem.t";

export type RecursiveFormDemoTypeNames = "text" | "group";

export type RecursiveFormDemoParams = TheParams<{
  text: { label: string };
  group: { title: string };
}>;

export type RecursiveFormDemoVariants = TheVariants<{
  text: "default" | "compact";
  group: "default" | "bordered";
}>;

export type RecursiveFormDemoData = {
  variants: {
    text: RecursiveFormDemoVariants["text"];
    group: RecursiveFormDemoVariants["group"];
  };
  values: Record<string, string>;
  items: RecursiveFormItem<RecursiveFormDemoTypeNames, RecursiveFormDemoParams, never, 1>[];
};

export const DEFAULT_RECURSIVE_FORM_DEMO: RecursiveFormDemoData = {
  variants: {
    text: "default",
    group: "bordered",
  },
  values: {
    t: "Alice",
    g: "1,2,3",
    "ga:1": "Apple",
    "ga:2": "Banana",
    "ga:3": "Carrot",
    "gb:1": "Red",
    "gb:2": "Green",
    "gb:3": "Blue",
    "gga:1:": "Small",
    "gga:2:": "Medium",
    "gga:3:": "Large",
  },
  items: [
    {
      header: {
        id: "t",
        type: "text",
        deleted: false,
        params: {
          label: "Name",
        },
      },
      children: [],
    },
    {
      header: {
        id: "g",
        type: "group",
        deleted: false,
        params: {
          title: "Inventory",
        },
      },
      children: [
        [
          {
            header: {
              id: "ga",
              type: "text",
              deleted: false,
              params: {
                label: "Item",
              },
            },
            children: [],
          },
          {
            header: {
              id: "gb",
              type: "text",
              deleted: false,
              params: {
                label: "Color",
              },
            },
            children: [],
          },
        ],
        [
          {
            header: {
              id: "gg",
              type: "group",
              deleted: false,
              params: {
                title: "Attributes",
              },
            },
            children: [
              [
                {
                  header: {
                    id: "gga",
                    type: "text",
                    deleted: false,
                    params: {
                      label: "Size",
                    },
                  },
                  children: [],
                },
              ],
            ],
          },
        ],
      ],
    },
  ],
};
