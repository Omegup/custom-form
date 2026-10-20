import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FORM_ITEM_EDITOR_INITIAL } from "../form-item-editor/demo/fixtures";
import { FormDialogsDemo } from "./demo/FormDialogsDemo";
import { FORM_DIALOGS_DEMO_SOURCE } from "./demo/formDialogsDemoHelper";
import type * as types from "./demo/formDialogsDemoTypes.t";

const FormDialogsStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <FormDialogsDemo
      heading={heading}
      flatItems={flatItems}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "form-dialogs/Form dialogs",
  component: FormDialogsDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: FORM_DIALOGS_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "**`makeUseDialogs`** owns item/section edit sessions and commits. Same Side + list + editors as earlier stories; the new idea is the orchestrator instead of hand-wired `useState`.",
      },
    },
  },
  render: FormDialogsStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — dialogs commit back into it.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Form dialogs",
    flatItems: FORM_ITEM_EDITOR_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
