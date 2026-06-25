import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { RecursiveFormDemo } from "./demo/RecursiveFormDemo";
import {
  DEFAULT_RECURSIVE_FORM_DEMO,
  RECURSIVE_FORM_DEMO_SOURCE,
  type StoryArgs,
} from "./demo/recursiveFormDemoHelper";

const RecursiveFormStory = () => {
  const [{ accent, textVariant, groupVariant, values, items }, updateArgs] =
    useArgs<StoryArgs>();
  return (
    <RecursiveFormDemo
      accent={accent}
      textVariant={textVariant}
      groupVariant={groupVariant}
      values={values}
      items={items}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "recursive-form/Recursive form",
  component: RecursiveFormDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: RECURSIVE_FORM_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Nested recursive items shown twice: skeleton viewers (top) and value-bound inputs (bottom). Controls edit `values` and `items`; canvas input uses `useArgs` to sync back. The code panel shows `recursiveFormDemoTypes.t.ts` (`RecursiveFormItem`, `TheParams`, etc.) and `RecursiveFormDemo.tsx` (viewers + integration) — the same files rendered here.",
      },
    },
  },
  render: RecursiveFormStory,
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
        "Recursive item tree (`header` + `children` slots) — add/remove nodes freely.",
      table: { category: "Form data" },
    },
  },
  args: {
    accent: "#4a90d9",
    textVariant: DEFAULT_RECURSIVE_FORM_DEMO.variants.text,
    groupVariant: DEFAULT_RECURSIVE_FORM_DEMO.variants.group,
    values: DEFAULT_RECURSIVE_FORM_DEMO.values,
    items: DEFAULT_RECURSIVE_FORM_DEMO.items,
  },
};

type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const CompactVariants: Story = {
  args: { textVariant: "compact", groupVariant: "default" },
};

export const SingleInventoryRow: Story = {
  args: {
    values: {
      t: "Alice",
      g: "1",
      "ga:1": "Only item",
      "gb:1": "Red",
      "gga:1:": "Small",
    },
  },
};
