import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { SectionResponderDemo } from "./demo/SectionResponderDemo";
import {
  INITIAL_FLAT,
  INITIAL_RESPONSES,
  INITIAL_SECTION,
  SECTION_RESPONDER_DEMO_SOURCE,
} from "./demo/sectionResponderDemoHelper";
import type * as types from "./demo/sectionResponderDemoTypes.t";

const SectionResponderStory = () => {
  const [{ heading, phase, flatItems, section, responses }, updateArgs] =
    useArgs<types.StoryArgs>();
  return (
    <SectionResponderDemo
      heading={heading}
      phase={phase}
      flatItems={flatItems}
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
          "Fill-path section shell — **`SectionResponderHOC`**. **Design** is the form-dialogs editor. **Fill** has `ResponseSetter`; **Validate** runs the section `impRef.validate`. JSON dump shows the live response map.",
      },
    },
  },
  render: SectionResponderStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    phase: {
      control: "select",
      options: ["design", "fill"],
      table: { category: "Layout" },
    },
    flatItems: { control: "object", table: { category: "Form data" } },
    section: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
  },
  args: {
    heading: "Section responder",
    phase: "fill",
    flatItems: INITIAL_FLAT,
    section: INITIAL_SECTION,
    responses: INITIAL_RESPONSES,
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
