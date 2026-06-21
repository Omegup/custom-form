import type { Meta, StoryObj } from "@storybook/react-vite";
import { SideMenuPlayground } from "./SideMenuPlayground";

const meta = {
  title: "side-menu/Side menu",
  component: SideMenuPlayground,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Edit-form host with a searchable library sidebar. Add fields or sections from the panel; items insert into the flat list via `insertFlatFormItem` / `appendFlatSection`.",
      },
    },
  },
  argTypes: {
    heading: { control: "text" },
    libraryTitle: { control: "text" },
    sidebarWidth: { control: { type: "range", min: 180, max: 360, step: 10 } },
  },
  args: {
    heading: "Side menu",
    libraryTitle: "Library",
    sidebarWidth: 240,
  },
} satisfies Meta<typeof SideMenuPlayground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NarrowSidebar: Story = {
  args: { sidebarWidth: 200 },
};
