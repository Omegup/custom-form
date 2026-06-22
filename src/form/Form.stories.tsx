import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormPlayground, type FormPlaygroundProps } from "./FormPlayground";
import { DEFAULT_FORM_DEMO } from "./formDemoFixtures";
import type { FormDemoVariants } from "./formDemoFixtures";

/** Story args: fixed variants as selects; dynamic `values` / `items` stay as JSON objects. */
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

const FormStory = (args: FormStoryArgs) => (
  <FormPlayground {...toPlaygroundProps(args)} />
);

const meta = {
  title: "form/Form",
  component: FormStory,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Read-only form viewers with nested groups. Variants use fixed dropdowns; `values` and `items` are JSON objects for a fully dynamic form tree. Canvas inputs update locally until Controls change.",
      },
    },
  },
  render: (args) => <FormStory {...args} />,
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
} satisfies Meta<FormStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

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
