import type { Meta, StoryObj } from "@storybook/react-vite";
import { MoveActionsPlayground } from "./MoveActionsPlayground";

const meta = {
  title: "move-actions/Move actions",
  component: MoveActionsPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "List rows wired through `makeActions` — clone, remove, reorder, restore, and autofocus pulse.",
      },
    },
  },
  argTypes: {
    initialItemNames: {
      control: "object",
      description: "Labels for the starting list rows",
    },
  },
  args: {
    initialItemNames: ["Item 1"],
  },
} satisfies Meta<typeof MoveActionsPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleItem: Story = {};

export const MultipleItems: Story = {
  args: { initialItemNames: ["Alpha", "Beta", "Gamma"] },
};

export const EmptyStart: Story = {
  args: { initialItemNames: [] },
};
