import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FormItemEditorDemo } from "./demo/FormItemEditorDemo";
import { FORM_ITEM_EDITOR_DEMO_SOURCE } from "./demo/formItemEditorDemoHelper";
import * as types from "./demo/formItemEditorDemoTypes.t";
import { FORM_ITEM_EDITOR_INITIAL } from "./demo/library";

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
          "Click **Edit** on a **field**, **heading**, or **panel** row. Labels come from name `viewers` + `createFormItemByGetChild` (same pattern as `form` demo). Panel embeds child fields and lets you change column count `n` (1↔2); Save commits via `form-edit` `applyFlatFormItem`. Field: required name, max length, duplicate-name check, plus **Required** toggle (`wrapWithRequired` / school `renderRequired`). Editors register `validate` on `impRef`.",
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
    flatItems: FORM_ITEM_EDITOR_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
