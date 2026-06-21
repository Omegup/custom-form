import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormItemEditorPlayground } from "./FormItemEditorPlayground";

const meta = {
  title: "form-item-editor/Form item editor",
  component: FormItemEditorPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Click **Edit** on a field row to open the `createFormItemEditorWrapper` dialog. Save patches the flat item list in place.",
      },
    },
  },
  argTypes: {
    heading: { control: "text" },
  },
  args: {
    heading: "Form item editor",
  },
} satisfies Meta<typeof FormItemEditorPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
