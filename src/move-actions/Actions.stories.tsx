import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { MoveActionsDemo } from "./demo/MoveActionsDemo";
import {
  DEFAULT_MOVE_ACTIONS_DEMO,
  MOVE_ACTIONS_DEMO_SOURCE,
  MULTIPLE_ITEMS_DEMO,
  type StoryArgs,
} from "./demo/moveActionsDemoHelper";

const MoveActionsStory = () => {
  const [{ items }, updateArgs] = useArgs<StoryArgs>();
  return <MoveActionsDemo items={items} updateArgs={updateArgs} />;
};

export default {
  title: "move-actions/Move actions",
  component: MoveActionsDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: MOVE_ACTIONS_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Editable list wired through `makeActions` — clone, remove, reorder, restore, and autofocus pulse. Controls edit `items`; canvas actions use `useArgs` to sync back. The code panel shows `moveActionsDemoTypes.t.ts` (item and `AutoFocus` context types) and `MoveActionsDemo.tsx` (integration) — the same files rendered here.",
      },
    },
  },
  render: MoveActionsStory,
  argTypes: {
    items: {
      control: "object",
      description: "List rows — each has `name` and optional soft-delete via `del`.",
      table: { category: "List data" },
    },
  },
  args: {
    items: DEFAULT_MOVE_ACTIONS_DEMO.items,
  },
};

type Story = StoryObj<StoryArgs>;

export const Default: Story = {};

export const MultipleItems: Story = {
  args: MULTIPLE_ITEMS_DEMO,
};

