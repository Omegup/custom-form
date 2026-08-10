import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FlatDndDemo } from "./demo/FlatDndDemo";
import { FLAT_DND_DEMO_SOURCE } from "./demo/flatDndDemoHelper";
import * as types from "./demo/flatDndDemoTypes.t";
import { FLAT_DND_INITIAL } from "./demo/library";

const FlatDndStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return <FlatDndDemo heading={heading} flatItems={flatItems} updateArgs={updateArgs} />;
};

export default {
  title: "flat-dnd/Flat dnd",
  component: FlatDndDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: FLAT_DND_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Web HTML5 drag-and-drop `renderEdit` — `SectionFormItemHOC` (`section-view`) with `renderEdit: WebRecursiveEdit` swapped in for `ColumnsEdit`. All DnD UI comes from the local `drag-drop-tree` package (literal port of school's package); `WebRecursiveEdit` is ~30 lines of demo glue (`toDndTree` → `DnDTreeCore` → `cleanNodes`), same wiring as school's `FlatDnd`. Drag within a column or into nested panel columns. Each section has its own `DnDTreeCore` (school parity). Soft-deleted rows aren't draggable. Pure conversion logic stays in `flat-dnd` (lib); only the demo imports `drag-drop-tree`'s React components.",
      },
    },
  },
  render: FlatDndStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — sections, fields, a 2-column panel, and a deleted field.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Flat DnD",
    flatItems: FLAT_DND_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
