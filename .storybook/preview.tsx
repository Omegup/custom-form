import type { Preview } from "@storybook/react-vite";
import {
  Controls,
  Description,
  Primary,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: {
      expanded: true,
      matchers: { color: /(background|color|accent)$/i, date: /Date$/i },
    },
    docs: {
      toc: true,
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
        </>
      ),
    },
  },
};

export default preview;
