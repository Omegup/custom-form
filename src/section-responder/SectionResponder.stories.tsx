import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { SectionResponderDemo } from "./demo/SectionResponderDemo";
import {
  INITIAL_RESPONSES,
  INITIAL_SECTION,
  SECTION_RESPONDER_DEMO_SOURCE,
} from "./demo/sectionResponderDemoHelper";
import type * as types from "./demo/sectionResponderDemoTypes.t";

const SectionResponderStory = () => {
  const [{ heading, section, responses }, updateArgs] =
    useArgs<types.StoryArgs>();
  return (
    <SectionResponderDemo
      heading={heading}
      section={section}
      responses={responses}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "section-responder/Section responder",
  component: SectionResponderDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: SECTION_RESPONDER_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Fill-path section shell — **`SectionResponderHOC`**. One section of fields with `ResponseSetter`; **Validate** runs the section `impRef.validate` (aggregates every item). JSON dump shows the live response map.",
      },
    },
  },
  render: SectionResponderStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    section: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
  },
  args: {
    heading: "Section responder",
    section: INITIAL_SECTION,
    responses: INITIAL_RESPONSES,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
