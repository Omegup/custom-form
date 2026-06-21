import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormPlayground } from "./FormPlayground";
import { DEFAULT_FORM_DEMO } from "./formDemoFixtures";

const meta = {
  title: "form/Form",
  component: FormPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Read-only form viewers with nested groups. Use Controls to edit variants, values, and item labels; canvas inputs update locally until Controls change.",
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
    "values.g:1": { control: "text", name: "Item 1", table: { category: "Values" } },
    "values.g:2": { control: "text", name: "Item 2", table: { category: "Values" } },
    "values.g:3": { control: "text", name: "Item 3", table: { category: "Values" } },
    items: { control: "object", table: { category: "Structure" } },
    "items.0.params.label": {
      control: "text",
      name: "Name label",
      table: { category: "Structure" },
    },
    "items.1.params.title": {
      control: "text",
      name: "Group title",
      table: { category: "Structure" },
    },
  } as Meta<typeof FormPlayground>["argTypes"],
  args: {
    accent: "#4a90d9",
    ...DEFAULT_FORM_DEMO,
  },
} satisfies Meta<typeof FormPlayground>;

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
    values: { ...DEFAULT_FORM_DEMO.values, t: "" },
  },
};

export const SingleInventoryRow: Story = {
  args: {
    values: {
      ...DEFAULT_FORM_DEMO.values,
      g: "1",
      "g:1": "Only item",
      "g:2": "",
      "g:3": "",
    },
  },
};
