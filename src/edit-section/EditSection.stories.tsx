import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FORM_ITEM_EDITOR_INITIAL } from "../form-item-editor/demo/fixtures";
import { EditSectionDemo } from "./demo/EditSectionDemo";
import { EDIT_SECTION_DEMO_SOURCE } from "./demo/editSectionDemoHelper";
import type * as types from "./demo/editSectionDemoTypes.t";

const EditSectionStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <EditSectionDemo
      heading={heading}
      flatItems={flatItems}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "edit-section/Edit section",
  component: EditSectionDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: EDIT_SECTION_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Column-slot add dropdown (MVP of the full `SectionHOC`). Each section column ends with **+ Add item**; picking a type opens the form-item-editor dialog with an insert session at that slot (`getFlatInsertionIndex`, `total: 0`). Save inserts the new item at the end of the clicked column via `applyFlatFormItem`.",
      },
    },
  },
  render: EditSectionStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — slot adds splice into it.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Edit section",
    flatItems: FORM_ITEM_EDITOR_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
