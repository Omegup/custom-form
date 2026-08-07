import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FORM_ITEM_EDITOR_INITIAL } from "../form-item-editor/demo/fixtures";
import { SideMenuDemo } from "./demo/SideMenuDemo";
import { SIDE_MENU_DEMO_SOURCE } from "./demo/sideMenuDemoHelper";
import type * as types from "./demo/sideMenuDemoTypes.t";

const SideMenuStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <SideMenuDemo
      heading={heading}
      flatItems={flatItems}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "side-menu/Side menu",
  component: SideMenuDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: SIDE_MENU_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "School composition: **Side** sidebar (ambiguous insert + section picker) and **+ Add item** on every list slot — section columns *and* nested panel columns (`makeUseRenderAddItem` / FlatDnd). Same catalog for both. **+ Add section** opens the section-edit dialog (`index: -1` → `updateSectionInFlat`).",
      },
    },
  },
  render: SideMenuStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — adds append to it.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Side menu",
    flatItems: FORM_ITEM_EDITOR_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
