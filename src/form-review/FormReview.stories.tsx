import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FormReviewDemo } from "./demo/FormReviewDemo";
import {
  FORM_REVIEW_DEMO_SOURCE,
  INITIAL_CHANGES,
  INITIAL_HEADER,
  INITIAL_RESPONSES,
  INITIAL_SECTIONS,
} from "./demo/formReviewDemoHelper";
import type * as types from "./demo/formReviewDemoTypes.t";

const FormReviewStory = () => {
  const [
    { heading, header, sections, responses, changes, reviewPending, showDeleted },
    updateArgs,
  ] = useArgs<types.StoryArgs>();
  return (
    <FormReviewDemo
      heading={heading}
      header={header}
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
          "Multi-section review shell — **`CustomFormReviewHOC`**. Maps sections through `SectionReviewHOC`, sharing one `AdditionalChanges` map across the form. Toggle **Review round pending** to see `highlight` vs `disabled` status; toggle `showDeleted` to keep deleted sections visible.",
      },
    },
  },
  render: FormReviewStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    header: { control: "object", table: { category: "Form data" } },
    sections: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
    changes: { control: "object", table: { category: "Form data" } },
    reviewPending: { control: "boolean", table: { category: "Layout" } },
    showDeleted: { control: "boolean", table: { category: "Layout" } },
  },
  args: {
    heading: "Form review",
    header: INITIAL_HEADER,
    sections: INITIAL_SECTIONS,
    responses: INITIAL_RESPONSES,
    changes: INITIAL_CHANGES,
    reviewPending: true,
    showDeleted: false,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
