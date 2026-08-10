import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { SectionReviewDemo } from "./demo/SectionReviewDemo";
import {
  INITIAL_CHANGES,
  INITIAL_RESPONSES,
  INITIAL_SECTION,
  SECTION_REVIEW_DEMO_SOURCE,
} from "./demo/sectionReviewDemoHelper";
import type * as types from "./demo/sectionReviewDemoTypes.t";

const SectionReviewStory = () => {
  const [{ heading, section, responses, changes, reviewPending }, updateArgs] =
    useArgs<types.StoryArgs>();
  return (
    <SectionReviewDemo
      heading={heading}
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
          "Read-only teacher review of one section — **`SectionReviewHOC`**. Lock/unlock the reviewer comment, ask a follow-up question, and toggle **Review round pending** to see `highlight` vs `disabled` status. JSON dump shows the live `AdditionalChanges` map.",
      },
    },
  },
  render: SectionReviewStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    section: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
    changes: { control: "object", table: { category: "Form data" } },
    reviewPending: { control: "boolean", table: { category: "Layout" } },
  },
  args: {
    heading: "Section review",
    section: INITIAL_SECTION,
    responses: INITIAL_RESPONSES,
    changes: INITIAL_CHANGES,
    reviewPending: true,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
