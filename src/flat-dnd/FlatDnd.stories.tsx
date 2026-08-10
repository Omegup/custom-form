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
          "Web HTML5 drag-and-drop `renderEdit` — `SectionFormItemHOC` (`section-view`) with `renderEdit: WebRecursiveEdit` swapped in for `ColumnsEdit`. `WebRecursiveEdit` + the `dndTreeUi` engine are ported **as-is** from school's real `drag-drop-tree` UI components (`DnDTreeCore`, `RecursiveTreeNode`, `Indicator`) and `recursive-edit-ui` (`FlatDnd`/`RecursiveEdit`), restyled with plain inline styles (no JSS/`school-style` dependency here) and driven by the headless `drag-drop-tree` + `flat-dnd` packages instead of school's own copies — proving those packages' APIs are a drop-in match. Drag a row to reorder it within a column, or move it into the 'Address' panel's columns — verified end-to-end (Playwright) in addition to the unit tests. Each section runs its own DnD engine instance (one per `RecursiveEditManager`, same as school's `FlatDnd`), so dragging is scoped to a section; moving an item to a *different* section goes through the sidebar/dialog insert flow instead (`section-edit`/`form-dialogs`). Soft-deleted rows aren't draggable; toggle 'Show deleted' per section to hide them from the drag surface entirely (see `flat-dnd/README.md` on that trade-off). Library code (`drag-drop-tree`, `flat-dnd`) has no React/HTML5 — only this Storybook demo does.",
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
