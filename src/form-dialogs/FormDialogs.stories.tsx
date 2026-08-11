import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FORM_ITEM_EDITOR_INITIAL } from "../form-item-editor/demo/fixtures";
import { AllInEditor } from "./demo/AllInEditor";
import { ALL_IN_DEMO_SOURCE } from "./demo/allInDemoHelper";
import type * as types from "./demo/allInDemoTypes.t";

const AllInStory = () => {
  const [
    { heading, phase, flatItems, responses, changes, reviewPending, showDeleted },
    updateArgs,
  ] = useArgs<types.StoryArgs>();
  return (
    <AllInEditor
      heading={heading}
      phase={phase}
      flatItems={flatItems}
      responses={responses}
      changes={changes}
      reviewPending={reviewPending}
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
          "Full lifecycle — **Design** (`makeUseDialogs` + `SectionFormItemHOC` + DnD + Library), **Fill** (`CustomFormResponderHOC`), **Update** (`CustomFormReviewHOC` with the same Library sidebar to pick follow-up question types). Remarks unlock answers; JSON panels show `flatItems` / `responses` / `AdditionalChanges`.",
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
      description: "Flat edit list — Design phase rewrites it.",
      table: { category: "Form data" },
    },
    responses: { control: "object", table: { category: "Form data" } },
    changes: { control: "object", table: { category: "Form data" } },
    reviewPending: { control: "boolean", table: { category: "Update" } },
    showDeleted: { control: "boolean", table: { category: "Update" } },
  },
  args: {
    heading: "All-in lifecycle",
    phase: "design",
    flatItems: FORM_ITEM_EDITOR_INITIAL,
    responses: {},
    changes: {},
    reviewPending: true,
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
