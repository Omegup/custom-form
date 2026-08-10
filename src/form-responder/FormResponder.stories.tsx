import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { FormResponderDemo } from "./demo/FormResponderDemo";
import {
  FORM_RESPONDER_DEMO_SOURCE,
  INITIAL_HEADER,
  INITIAL_RESPONSES,
  INITIAL_SECTIONS,
} from "./demo/formResponderDemoHelper";
import type * as types from "./demo/formResponderDemoTypes.t";

const FormResponderStory = () => {
  const [{ heading, header, sections, responses, showDeleted }, updateArgs] =
    useArgs<types.StoryArgs>();
  return (
    <FormResponderDemo
      heading={heading}
      header={header}
      sections={sections}
      responses={responses}
      showDeleted={showDeleted}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "form-responder/Form responder",
  component: FormResponderDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: FORM_RESPONDER_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Multi-section fill shell — **`CustomFormResponderHOC`**. Maps sections through `SectionResponderHOC`; **Validate** runs the form `impRef.validate` (skips deleted sections). JSON dump shows the live response map.",
      },
    },
  },
  render: FormResponderStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    header: { control: "object", table: { category: "Form data" } },
    sections: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
    showDeleted: { control: "boolean", table: { category: "Layout" } },
  },
  args: {
    heading: "Form responder",
    header: INITIAL_HEADER,
    sections: INITIAL_SECTIONS,
    responses: INITIAL_RESPONSES,
    showDeleted: false,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
