import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FormItemEditorDemo } from "./demo/FormItemEditorDemo";
import { FORM_ITEM_EDITOR_DEMO_SOURCE } from "./demo/formItemEditorDemoHelper";
import * as types from "./demo/formItemEditorDemoTypes.t";
import { EDIT_FORM_INITIAL } from "./demo/library";

const FormItemEditorStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <FormItemEditorDemo
      heading={heading}
      flatItems={flatItems}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "form-item-editor/Form item editor",
  component: FormItemEditorDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: FORM_ITEM_EDITOR_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Click **Edit** on a field row to open `createFormItemEditorWrapper`. **Save** calls `validate` from the wrapper: the editor registers rules on `impRef` (required name, max length); `useHook` adds a duplicate-name check before commit. The `render()` slot shows a live character counter. Try clearing the name, exceeding 30 characters, or reusing an existing name.",
      },
    },
  },
  render: FormItemEditorStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Flat edit list — save updates the matching `item` entry.",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Form item editor",
    flatItems: EDIT_FORM_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
