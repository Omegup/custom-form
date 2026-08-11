import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FORM_ITEM_EDITOR_INITIAL } from "../form-item-editor/demo/fixtures";
import { AllInEditor } from "./demo/AllInEditor";
import { ALL_IN_DEMO_SOURCE } from "./demo/allInDemoHelper";
import type * as types from "./demo/allInDemoTypes.t";

const AllInStory = () => {
  const [
    { heading, phase, flatItems, responses, formResponse, showDeleted },
    updateArgs,
  ] = useArgs<types.StoryArgs>();
  return (
    <AllInEditor
      heading={heading}
      phase={phase}
      flatItems={flatItems}
      responses={responses}
      formResponse={formResponse}
      showDeleted={showDeleted}
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
          "Lifecycle over **two school documents**: CustomForm (`flatItems`) + FormResponse (`responses` / `changes` / `feedbackHistory`). Design / Fill / Update are views — Send creates the FormResponse; teacher Update mutates that same doc.",
      },
    },
  },
  render: AllInStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    phase: {
      control: "select",
      options: ["design", "fill", "update"],
      table: { category: "Layout" },
    },
    flatItems: {
      control: "object",
      description: "CustomForm design (flat edit list).",
      table: { category: "CustomForm" },
    },
    responses: {
      control: "object",
      description: "Fill draft answers (formik) until Send.",
      table: { category: "Fill session" },
    },
    formResponse: {
      control: "object",
      description:
        "School FormResponse document — null until Send; Update edits this same object.",
      table: { category: "FormResponse" },
    },
    showDeleted: { control: "boolean", table: { category: "Update view" } },
  },
  args: {
    heading: "All-in lifecycle",
    phase: "design",
    flatItems: FORM_ITEM_EDITOR_INITIAL,
    responses: {},
    formResponse: null,
    showDeleted: false,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};

export const Design: Story = {
  args: { phase: "design" },
};

export const Fill: Story = {
  args: { phase: "fill" },
};

export const Update: Story = {
  args: { phase: "update" },
};
