import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    layout: "padded",
    controls: {
      expanded: true,
      matchers: { color: /(background|color|accent)$/i, date: /Date$/i },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
