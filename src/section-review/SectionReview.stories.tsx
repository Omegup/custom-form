import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { SectionReviewDemo } from "./demo/SectionReviewDemo";
import {
  INITIAL_CHANGES,
  INITIAL_FLAT,
  INITIAL_RESPONSES,
  INITIAL_SECTION,
  SECTION_REVIEW_DEMO_SOURCE,
} from "./demo/sectionReviewDemoHelper";
import type * as types from "./demo/sectionReviewDemoTypes.t";

const SectionReviewStory = () => {
  const [{ heading, phase, flatItems, section, responses, changes, reviewPending }, updateArgs] =
    useArgs<types.StoryArgs>();
  return (
    <SectionReviewDemo
      heading={heading}
      phase={phase}
      flatItems={flatItems}
      section={section}
      responses={responses}
      changes={changes}
      reviewPending={reviewPending}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "section-review/Section review",
  component: SectionReviewDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: SECTION_REVIEW_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Lifecycle demo for **`SectionReviewHOC`**. **Design** is the form-dialogs editor. **Follow** 💬 opens a follow-up type dropdown. Three JSON panels stay visible for `section`, `responses`, and `AdditionalChanges`.",
      },
    },
  },
  render: SectionReviewStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    phase: {
      control: "select",
      options: ["design", "response", "follow"],
      table: { category: "Layout" },
    },
    section: { control: "object", table: { category: "Form data" } },
    flatItems: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
    changes: { control: "object", table: { category: "Form data" } },
    reviewPending: { control: "boolean", table: { category: "Follow" } },
  },
  args: {
    heading: "Section review lifecycle",
    phase: "follow",
    flatItems: INITIAL_FLAT,
    section: INITIAL_SECTION,
    responses: INITIAL_RESPONSES,
    changes: INITIAL_CHANGES,
    reviewPending: true,
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
