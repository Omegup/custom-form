import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          "form",
          "recursive-form",
          "response",
          "move-actions",
          "form-edit",
          "form-item-editor",
          "section-edit",
          "side-menu",
          "section-view",
          "flat-dnd",
          "form-dialogs",
          "section-responder",
          "form-responder",
          "section-review",
          "form-review",
          "form-response",
        ],
      },
    },
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
