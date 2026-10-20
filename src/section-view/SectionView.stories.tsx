import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { SectionViewDemo } from "./demo/SectionViewDemo";
import { SECTION_VIEW_DEMO_SOURCE } from "./demo/sectionViewDemoHelper";
import * as types from "./demo/sectionViewDemoTypes.t";
import { SECTION_VIEW_INITIAL } from "./demo/library";

const SectionViewStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <SectionViewDemo heading={heading} flatItems={flatItems} updateArgs={updateArgs} />
  );
};

export default {
  title: "section-view/Section view",
  component: SectionViewDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: SECTION_VIEW_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "`SectionFormItemHOC` (viewers + `createRenderEditFormItem` + `ColumnsEdit`) rendering a multi-section, multi-type list — no FlatDnd. Each section owns its move actions (`getSectionEdit`); each item is a display label + move actions via `renderCard` (same list chrome as side-menu / form-dialogs). Panels recurse into nested columns with their own \"+ Add\" slot (`getFlatInsertionIndex`). Item add commits immediately via `applyFlatFormItem` — this story proves `section-view` composition, not a second item-edit dialog.",
      },
    },
  },
  render: SectionViewStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — sections, fields, and a 2-column panel.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Section view",
    flatItems: SECTION_VIEW_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
