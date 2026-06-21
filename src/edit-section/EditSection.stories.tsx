import type { Meta, StoryObj } from "@storybook/react-vite";
import { EditSectionPlayground } from "./EditSectionPlayground";

const meta = {
  title: "edit-section/Edit section",
  component: EditSectionPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Sections rendered through `SectionFormItemHOC` — field viewers, per-column add-item slots, and section move actions.",
      },
    },
  },
} satisfies Meta<typeof EditSectionPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
