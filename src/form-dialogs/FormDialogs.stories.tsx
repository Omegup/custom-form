import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FORM_ITEM_EDITOR_INITIAL } from "../form-item-editor/demo/fixtures";
import { AllInEditor } from "./demo/AllInEditor";
import { ALL_IN_DEMO_SOURCE } from "./demo/allInDemoHelper";
import type * as types from "./demo/allInDemoTypes.t";

const AllInStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <AllInEditor
      heading={heading}
      flatItems={flatItems}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "form-dialogs/All-in",
  component: AllInEditor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: ALL_IN_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "School `CustomFormEditor` + `DialogsHOC` composition on **`makeUseDialogs`**: row **Edit** (item dialog), sidebar catalog (ambiguous insert + section picker), in-slot **+ Add** on every column, section header **Edit** and **+ Add section** (section dialog). All commits flow through `applyFlatFormItem` / `updateSectionInFlat`.",
      },
    },
  },
  render: AllInStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — every dialog save rewrites it.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "All-in editor",
    flatItems: FORM_ITEM_EDITOR_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
