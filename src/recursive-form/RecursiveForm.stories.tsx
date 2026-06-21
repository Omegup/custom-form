import type { Meta, StoryObj } from "@storybook/react-vite";
import { RecursiveFormPlayground } from "./RecursiveFormPlayground";
import { DEFAULT_RECURSIVE_FORM_DEMO } from "./recursiveFormDemoFixtures";

const meta = {
  title: "recursive-form/Recursive form",
  component: RecursiveFormPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Nested recursive items shown twice: skeleton viewers (top) and value-bound inputs (bottom). Use Controls to edit variants, values, and item labels.",
      },
    },
  },
  argTypes: {
    accent: { control: "color", table: { category: "Theme" } },
    variants: { control: "object", table: { category: "Structure" } },
    "variants.text": {
      control: "select",
      options: ["default", "compact"],
      name: "Text variant",
      table: { category: "Structure" },
    },
    "variants.group": {
      control: "select",
      options: ["default", "bordered"],
      name: "Group variant",
      table: { category: "Structure" },
    },
    values: { control: "object", table: { category: "Values" } },
    "values.t": { control: "text", name: "Name value", table: { category: "Values" } },
    "values.g": {
      control: "text",
      name: "Inventory row ids",
      table: { category: "Values" },
    },
    "values.ga:1": { control: "text", name: "Item 1", table: { category: "Values" } },
    "values.ga:2": { control: "text", name: "Item 2", table: { category: "Values" } },
    "values.ga:3": { control: "text", name: "Item 3", table: { category: "Values" } },
    items: { control: "object", table: { category: "Structure" } },
    "items.0.header.params.label": {
      control: "text",
      name: "Name label",
      table: { category: "Structure" },
    },
    "items.1.header.params.title": {
      control: "text",
      name: "Group title",
      table: { category: "Structure" },
    },
  } as Meta<typeof RecursiveFormPlayground>["argTypes"],
  args: {
    accent: "#4a90d9",
    ...DEFAULT_RECURSIVE_FORM_DEMO,
  },
} satisfies Meta<typeof RecursiveFormPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactVariants: Story = {
  args: {
    variants: { text: "compact", group: "default" },
  },
};

export const EmptyName: Story = {
  args: {
    values: { ...DEFAULT_RECURSIVE_FORM_DEMO.values, t: "" },
  },
};

export const SingleInventoryRow: Story = {
  args: {
    values: {
      ...DEFAULT_RECURSIVE_FORM_DEMO.values,
      g: "1",
      "ga:1": "Only item",
      "ga:2": "",
      "ga:3": "",
      "gb:1": "Red",
      "gb:2": "",
      "gb:3": "",
      "gga:1:": "Small",
      "gga:2:": "",
      "gga:3:": "",
    },
  },
};
