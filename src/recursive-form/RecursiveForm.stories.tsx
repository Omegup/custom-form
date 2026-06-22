import type { StoryObj } from "@storybook/react-vite";
import { formatPlaygroundDocsSource } from "../../.storybook/playgroundDocsSource";
import {
  RecursiveFormPlayground,
  type RecursiveFormPlaygroundProps,
} from "./RecursiveFormPlayground";
import {
  DEFAULT_RECURSIVE_FORM_DEMO,
  type RecursiveFormDemoVariants,
} from "./recursiveFormDemoFixtures";

/** Story-only args: variant dropdowns map to `variants` on RecursiveFormPlayground. */
type RecursiveFormStoryArgs = Omit<RecursiveFormPlaygroundProps, "variants"> & {
  textVariant: RecursiveFormDemoVariants["text"];
  groupVariant: RecursiveFormDemoVariants["group"];
};

const toPlaygroundProps = ({
  textVariant,
  groupVariant,
  ...rest
}: RecursiveFormStoryArgs): RecursiveFormPlaygroundProps => ({
  ...rest,
  variants: { text: textVariant, group: groupVariant },
});

export default {
  title: "recursive-form/Recursive form",
  component: RecursiveFormPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        transform: (_code: string, context: { args: RecursiveFormStoryArgs }) =>
          formatPlaygroundDocsSource(
            "import { RecursiveFormPlayground } from './RecursiveFormPlayground';",
            "RecursiveFormPlayground",
            toPlaygroundProps(context.args),
          ),
      },
      description: {
        component:
          "Nested recursive items shown twice: skeleton viewers (top) and value-bound inputs (bottom). Pass `variants`, `values`, and `items` — the tree is fully dynamic. Storybook Controls split variants into dropdowns for convenience; usage below shows the real `RecursiveFormPlayground` props.",
      },
    },
  },
  render: (args: RecursiveFormStoryArgs) => (
    <RecursiveFormPlayground {...toPlaygroundProps(args)} />
  ),
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
      description: "Recursive item tree (`header` + `children` slots) — add/remove nodes freely.",
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

type Story = StoryObj<RecursiveFormStoryArgs>;

export const Default: Story = {};

export const CompactVariants: Story = {
  args: { textVariant: "compact", groupVariant: "default" },
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
