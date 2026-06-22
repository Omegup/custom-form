import type { StoryObj } from "@storybook/react-vite";
import { FormDemo } from "./FormDemo";
import {
  DEFAULT_FORM_DEMO,
  FORM_DEMO_SOURCE,
  type StoryArgs,
} from "./formDemoHelper";

export default {
  title: "form/Form",
  component: FormDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: FORM_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "JSON-driven form viewers with nested groups. Controls edit `values` and `items`; canvas input uses `useArgs` to sync back. The code panel shows `formDemoTypes.t.ts` (type definitions with `TheParams`, `TheVariants`, etc.) and `FormDemo.tsx` (viewers + integration) — the same files that run here.",
      },
    },
  },
  render: FormDemo,
  argTypes: {
    accent: { control: "color", table: { category: "Theme" } },
    textVariant: {
      control: "select",
      options: ["default", "compact"],
      table: { category: "Variants" },
    },
    groupVariant: {
      control: "select",
      options: ["default", "bordered"],
      table: { category: "Variants" },
    },
    values: {
      control: "object",
      description:
        "Field values keyed by item id (group rows use `id:row` suffixes).",
      table: { category: "Form data" },
    },
    items: {
      control: "object",
      description:
        "Top-level form item tree — add/remove fields and groups freely.",
      table: { category: "Form data" },
    },
  },
  args: {
    accent: "#4a90d9",
    textVariant: DEFAULT_FORM_DEMO.variants.text,
    groupVariant: DEFAULT_FORM_DEMO.variants.group,
    values: DEFAULT_FORM_DEMO.values,
    items: DEFAULT_FORM_DEMO.items,
  },
};

type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const CompactVariants: Story = {
  args: { textVariant: "compact", groupVariant: "default" },
};
