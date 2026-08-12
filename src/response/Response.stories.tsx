import type { StoryObj } from "@storybook/react-vite";
import { useArgs } from "storybook/preview-api";
import { ResponseDemo } from "./demo/ResponseDemo";
import {
  INITIAL_ITEMS,
  INITIAL_RESPONSES,
  RESPONSE_DEMO_SOURCE,
} from "./demo/responseDemoHelper";
import type * as types from "./demo/responseDemoTypes.t";

const ResponseStory = () => {
  const [{ heading, items, responses }, updateArgs] = useArgs<types.StoryArgs>();
  return (
    <ResponseDemo
      heading={heading}
      items={items}
      responses={responses}
      updateArgs={updateArgs}
    />
  );
};

export default {
  title: "response/Response",
  component: ResponseDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: RESPONSE_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Fill-path foundation — **`Response` / `ResponseSetter`** plus **`FormItemHOC(…, getUseImpRefViewProps)`**. Each field writes `data.value`; **Validate** runs every item's `impRef.validate` (required name fails when empty). JSON dump shows the live response map.",
      },
    },
  },
  render: ResponseStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    items: { control: "object", table: { category: "Form data" } },
    responses: { control: "object", table: { category: "Form data" } },
  },
  args: {
    heading: "Fill responses",
    items: INITIAL_ITEMS,
    responses: INITIAL_RESPONSES,
  },
};

type Story = StoryObj<types.StoryArgs>;

export const Default: Story = {};
