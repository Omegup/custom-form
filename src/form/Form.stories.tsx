import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FormDemo } from "./FormDemo";
import {
  DEFAULT_FORM_DEMO,
  FORM_DEMO_SOURCE,
  storyArgsToDemoProps,
  type FormStoryArgs,
} from "./formDemoHelper";

function FormDemoStory(args: FormStoryArgs) {
  const [, updateArgs] = useArgs<FormStoryArgs>();
  const demo = storyArgsToDemoProps(args);

  return (
    <FormDemo
      {...demo}
      onValueChange={(id, value) =>
        updateArgs({ values: { ...demo.values, [id]: value } })
      }
    />
  );
}

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
          "JSON-driven form viewers with nested groups. Controls edit `values` and `items`; canvas input uses `useArgs` to sync back. The code panel is the live `FormDemo.tsx` source — the same component rendered here.",
      },
    },
  },
  render: FormDemoStory,
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
      description: "Field values keyed by item id (group rows use `id:row` suffixes).",
      table: { category: "Form data" },
    },
    items: {
      control: "object",
      description: "Top-level form item tree — add/remove fields and groups freely.",
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

type Story = StoryObj<FormStoryArgs>;

export const Default: Story = {};

export const CompactVariants: Story = {
  args: { textVariant: "compact", groupVariant: "default" },
};
