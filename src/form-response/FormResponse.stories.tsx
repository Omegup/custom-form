import type { StoryObj } from "@storybook/react-vite";
import { useCallback } from "react";
import { useArgs } from "storybook/preview-api";
import { FormResponseDemo } from "./demo/FormResponseDemo";
import {
  FORM_RESPONSE_DEMO_SOURCE,
  INITIAL_FLAT,
} from "./demo/formResponseDemoHelper";
import type * as types from "./demo/formResponseDemoTypes.t";
import type { Response } from "./demo/library";

/**
 * Storybook's URL args encoder drops empty objects and rejects punctuation.
 * Store FormResponse + fill draft as base64url text at this boundary only.
 */
const encodeArgText = (value: unknown): string => {
  const json = JSON.stringify(value);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const decodeArgText = <T,>(text: string, fallback: T): T => {
  if (!text) return fallback;
  try {
    const padded =
      text.length % 4 === 0 ? text : text + "=".repeat(4 - (text.length % 4));
    const b64 = padded.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return fallback;
  }
};

const EMPTY_RESPONSES_TEXT = encodeArgText({});

const FormResponseStory = () => {
  const [
    { heading, phase, showDeleted, flatItems, responsesText, formResponseText },
    updateArgs,
  ] = useArgs<types.StoryArgs>();

  const responses = decodeArgText<Record<string, Response>>(responsesText, {});
  const formResponse = formResponseText
    ? decodeArgText<types.FormResponseDoc | null>(formResponseText, null)
    : null;

  const updateDemo = useCallback(
    (patch: Parameters<types.DemoProps["updateArgs"]>[0]) => {
      const next: Partial<types.StoryArgs> = {};
      if (patch.heading !== undefined) next.heading = patch.heading;
      if (patch.phase !== undefined) next.phase = patch.phase;
      if (patch.showDeleted !== undefined) next.showDeleted = patch.showDeleted;
      if (patch.flatItems !== undefined) next.flatItems = patch.flatItems;
      if (patch.responses !== undefined) {
        next.responsesText = encodeArgText(patch.responses);
      }
      if ("formResponse" in patch) {
        next.formResponseText = patch.formResponse
          ? encodeArgText(patch.formResponse)
          : "";
      }
      if (Object.keys(next).length) updateArgs(next);
    },
    [updateArgs],
  );

  return (
    <FormResponseDemo
      heading={heading}
      phase={phase}
      flatItems={flatItems}
      responses={responses}
      formResponse={formResponse}
      showDeleted={showDeleted}
      updateArgs={updateDemo}
    />
  );
};

export default {
  title: "form-response/Form response",
  component: FormResponseDemo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: FORM_RESPONSE_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "**FormResponse** document lifecycle. **Design** is the form-dialogs editor. Fill → Send creates the record; Update Save / Request changes / Approve / Reject mutate the same document. 💬 on Update opens a follow-up type dropdown.",
      },
    },
  },
  render: FormResponseStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    phase: {
      control: "select",
      options: ["design", "fill", "update"],
      table: { category: "Layout" },
    },
    showDeleted: { control: "boolean", table: { category: "Update" } },
    flatItems: {
      control: "object",
      description: "Design list — Fill/Update keep headings and panels.",
      table: { category: "Form data" },
    },
    responsesText: {
      control: "text",
      description: "Fill draft — base64url(JSON of Record<id, Response>).",
      table: { category: "Fill session" },
    },
    formResponseText: {
      control: "text",
      description:
        "FormResponse — base64url(JSON), or empty string when null (before first Send).",
      table: { category: "FormResponse" },
    },
  },
  args: {
    heading: "Form response",
    phase: "fill",
    showDeleted: false,
    flatItems: INITIAL_FLAT,
    responsesText: EMPTY_RESPONSES_TEXT,
    formResponseText: "",
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

export const Update: Story = {
  args: { phase: "update" },
};
