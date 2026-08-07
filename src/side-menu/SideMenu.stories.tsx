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
          "Library sidebar. Click a catalog row — the form-item-editor dialog opens with a **new-item session** (`index/sIndex: -1`); Save appends it to the end of the first non-deleted section via `applyFlatFormItem`. **+ Add section** opens the section-edit dialog with an `index: -1` session; save appends via `updateSectionInFlat`. The search box filters the catalog (accent-insensitive).",
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
