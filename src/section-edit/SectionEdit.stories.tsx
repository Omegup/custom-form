import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionEditPlayground } from "./SectionEditPlayground";

const meta = {
  title: "section-edit/Section edit",
  component: SectionEditPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Click **Edit** on a section header to open the section dialog. Save runs `updateSectionInFlat` (title, description, column count).",
      },
    },
  },
  argTypes: {
    heading: { control: "text" },
  },
  args: {
    heading: "Section edit",
  },
} satisfies Meta<typeof SectionEditPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
