import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { EDIT_FORM_INITIAL } from "../form-edit/demo/fixtures";
import { SectionEditDemo } from "./demo/SectionEditDemo";
import { SECTION_EDIT_DEMO_SOURCE } from "./demo/sectionEditDemoHelper";
import type * as types from "./demo/sectionEditDemoTypes.t";

const SectionEditStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <SectionEditDemo
      heading={heading}
      flatItems={flatItems}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "section-edit/Section edit",
  component: SectionEditDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: SECTION_EDIT_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Click **Edit** on a section header. The dialog edits **title**, **description**, and **column count** (1–3); `validateSectionForm` requires non-empty title and description. Save re-flattens the section via `updateSectionInFlat` (`resizeColumns` + `flatten().section` + `toSpliced`). Decreasing columns merges trailing slots into the last kept column.",
      },
    },
  },
  render: SectionEditStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — save replaces the section span.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Section edit",
    flatItems: EDIT_FORM_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
