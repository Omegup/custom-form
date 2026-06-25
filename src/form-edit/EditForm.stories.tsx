import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { EditFormDemo } from "./demo/EditFormDemo";
import {
  DEFAULT_EDIT_FORM_DEMO,
  EDIT_FORM_DEMO_SOURCE,
  type StoryArgs,
} from "./demo/editFormDemoHelper";

const EditFormStory = () => {
  const [{ heading, flatItems }, updateArgs] = useArgs<StoryArgs>();
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
    flatItems: DEFAULT_EDIT_FORM_DEMO.flatItems,
  },
};

type Story = StoryObj<StoryArgs>;

export const Default: Story = {
  args: {
    flatItems: [{
      "section": {
        "id": "s1",
        "deleted": false,
        "title": "Personal",
        "description": "Your info"
      }
    }, {
      "item": {
        "id": "f1",
        "type": "field",

        "params": {
          "name": "Namxe"
        },

        "deleted": false
      },

      "n": 0
    }, {
      "end": null
    }, {
      "item": {
        "id": "f3",
        "type": "field",

        "params": {
          "name": "Notes"
        },

        "deleted": false
      },

      "n": 0
    }, {
      "item": {
        "id": "f2",
        "type": "field",

        "params": {
          "name": "Emccail"
        },

        "deleted": false
      },

      "n": 0
    }, {
      "item": {
        "id": "id_oyz1u",
        "type": "field",

        "params": {
          "name": "Email (copy)"
        },

        "deleted": false
      },

      "n": 0
    }, {
      "section": {
        "id": "s2",
        "deleted": false,
        "title": "Details",
        "description": "More fields"
      }
    }, {
      "item": {
        "id": "id_7ff7s",
        "type": "field",

        "params": {
          "name": "Email (copy) (copy)"
        },

        "deleted": false
      },

      "n": 0
    }]
  }
};
