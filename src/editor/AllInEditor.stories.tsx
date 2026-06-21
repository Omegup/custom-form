import type { Meta, StoryObj } from "@storybook/react-vite";
import { AllInEditor } from "./AllInEditor";

const meta = {
  title: "editor/All-in",
  component: AllInEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full composed editor: library sidebar, field/section dialogs, move actions, and column add slots. Try adding from the library or column **Add item** buttons.",
      },
    },
  },
} satisfies Meta<typeof AllInEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
