import type { StoryObj } from "@storybook/react-vite";
import { formatPlaygroundDocsSource } from "../../.storybook/playgroundDocsSource";
import { FormPlayground, type FormPlaygroundProps } from "./FormPlayground";
import { DEFAULT_FORM_DEMO } from "./formDemoFixtures";
import type { FormDemoVariants } from "./formDemoFixtures";

/** Story-only args: variant dropdowns map to `variants` on FormPlayground. */
type FormStoryArgs = Omit<FormPlaygroundProps, "variants"> & {
  textVariant: FormDemoVariants["text"];
  groupVariant: FormDemoVariants["group"];
};

const toPlaygroundProps = ({
  textVariant,
  groupVariant,
  ...rest
}: FormStoryArgs): FormPlaygroundProps => ({
  ...rest,
  variants: { text: textVariant, group: groupVariant },
});

export default {
  title: "form/Form",
  component: FormPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        transform: (_code: string, context: { args: FormStoryArgs }) =>
          formatPlaygroundDocsSource(
            "import { FormPlayground } from './FormPlayground';",
            "FormPlayground",
            toPlaygroundProps(context.args),
          ),
      },
      description: {
        component:
          "Read-only form viewers with nested groups. Pass `variants`, `values`, and `items` — the form tree is fully dynamic. Storybook Controls split variants into dropdowns for convenience; usage below shows the real `FormPlayground` props.",
      },
    },
  },
  render: (args: FormStoryArgs) => <FormPlayground {...toPlaygroundProps(args)} />,
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
