import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FormReviewDemo } from "./demo/FormReviewDemo";
import {
  FORM_REVIEW_DEMO_SOURCE,
  INITIAL_CHANGES,
  INITIAL_FLAT,
  INITIAL_HEADER,
  INITIAL_RESPONSES,
  INITIAL_SECTIONS,
} from "./demo/formReviewDemoHelper";
import type * as types from "./demo/formReviewDemoTypes.t";

const FormReviewStory = () => {
  const [
    {
      heading,
      phase,
      header,
      flatItems,
      sections,
      responses,
      changes,
      reviewPending,
      showDeleted,
    },
    updateArgs,
  ] = useArgs<types.StoryArgs>();
  return (
    <FormReviewDemo
      heading={heading}
      phase={phase}
      header={header}
      flatItems={flatItems}
      sections={sections}
      responses={responses}
      changes={changes}
      reviewPending={reviewPending}
      showDeleted={showDeleted}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "form-review/Form review",
  component: FormReviewDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: FORM_REVIEW_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Lifecycle demo for **`CustomFormReviewHOC`**. **Design** is the form-dialogs editor (library, add/edit, DnD). **Follow** 💬 opens a follow-up type dropdown. Three JSON panels stay visible so you can compare `sections`, `responses`, and `AdditionalChanges`.",
      },
    },
  },
  render: FormReviewStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    phase: {
      control: "select",
      options: ["design", "response", "follow"],
      table: { category: "Layout" },
    },
    header: { control: "object", table: { category: "Form data" } },
    flatItems: { control: "object", table: { category: "Form data" } },
    sections: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
    changes: { control: "object", table: { category: "Form data" } },
    reviewPending: { control: "boolean", table: { category: "Follow" } },
    showDeleted: { control: "boolean", table: { category: "Follow" } },
  },
  args: {
    heading: "Form review lifecycle",
    phase: "follow",
    header: INITIAL_HEADER,
    flatItems: INITIAL_FLAT,
    sections: INITIAL_SECTIONS,
    responses: INITIAL_RESPONSES,
    changes: INITIAL_CHANGES,
    reviewPending: true,
    showDeleted: false,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};

export const Design: Story = {
  args: { phase: "design" },
};

export const Response: Story = {
  args: { phase: "response" },
};

export const Follow: Story = {
  args: { phase: "follow" },
};
