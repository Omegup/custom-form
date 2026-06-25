import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { EditFormDemo } from "./demo/EditFormDemo";
import {
  EDIT_FORM_DEMO_SOURCE,
} from "./demo/editFormDemoHelper";
import * as types from "./demo/editFormDemoTypes.t";
import { EDIT_FORM_INITIAL } from "./demo/fixtures";

const EditFormStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <EditFormDemo
      heading={heading}
      flatItems={flatItems}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "form-edit/Edit form",
  component: EditFormDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: EDIT_FORM_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Flat section/field list with move actions. This is the base host other modules compose onto via `EditFormTest` injection props. Controls edit `flatItems`; canvas actions use `useArgs` to sync back. The code panel shows `editFormDemoTypes.t.ts` and `EditFormDemo.tsx` — the same files rendered here.",
      },
    },
  },
  render: EditFormStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    flatItems: {
      control: "object",
      description: "Canonical flat edit representation (`section`, `item`, `end` markers).",
      table: { category: "Form data" },
    },
  },
  args: {
    heading: "Edit form",
    flatItems: EDIT_FORM_INITIAL,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
