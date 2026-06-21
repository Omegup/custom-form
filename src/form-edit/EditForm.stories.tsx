import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditFormPlayground } from "./EditFormPlayground";

const meta = {
  title: "form-edit/Edit form",
  component: EditFormPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Flat section/field list with move actions. This is the base host other modules compose onto via `EditFormTest` injection props.",
      },
    },
  },
  argTypes: {
    heading: { control: "text" },
  },
  args: {
    heading: "Edit form",
  },
} satisfies Meta<typeof EditFormPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default flat list with two sections and move-action toolbars. */
export const Default: Story = {};
