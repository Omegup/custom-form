import type { StoryObj } from "@storybook/react-vite";
import { useArgs, useCallback } from "storybook/preview-api";
import { FORM_ITEM_EDITOR_INITIAL } from "../form-item-editor/demo/fixtures";
import { AllInEditor } from "./demo/AllInEditor";
import { ALL_IN_DEMO_SOURCE } from "./demo/allInDemoHelper";
import type * as types from "./demo/allInDemoTypes.t";
import type { Response } from "./demo/library";

/**
 * Storybook's URL args encoder:
 * - drops empty objects (`changes: {}` vanishes on reload)
 * - rejects strings outside `[a-zA-Z0-9 _-]` (emails, ISO dates, JSON punctuation)
 *
 * Keep one source of truth in args by storing documents as **base64url text**
 * (charset-safe), and decode/encode at this story boundary only.
 */
type StoryArgs = {
  flatItems: types.FlatItems;
  heading: string;
  phase: types.DemoPhase;
  showDeleted: boolean;
  /** base64url(JSON) of fill-session draft `Record<id, Response>`. */
  responsesText: string;
  /** base64url(JSON) of `FormResponseDoc`, or `""` when null. */
  formResponseText: string;
};

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

const AllInStory = () => {
  const [
    { heading, phase, flatItems, showDeleted, responsesText, formResponseText },
    updateArgs,
  ] = useArgs<StoryArgs>();

  const responses = decodeArgText<Record<string, Response>>(
    responsesText,
    {},
  );
  const formResponse = formResponseText
    ? decodeArgText<types.FormResponseDoc | null>(formResponseText, null)
    : null;

  const updateDemo = useCallback(
    (patch: Parameters<types.DemoProps["updateArgs"]>[0]) => {
      const next: Partial<StoryArgs> = {};
      if (patch.heading !== undefined) next.heading = patch.heading;
      if (patch.phase !== undefined) next.phase = patch.phase;
      if (patch.flatItems !== undefined) next.flatItems = patch.flatItems;
      if (patch.showDeleted !== undefined) next.showDeleted = patch.showDeleted;
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
    <AllInEditor
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
  title: "form-dialogs/All-in",
  component: AllInEditor,
  tags: ["autodocs"],
  parameters: {
    docs: {
      source: {
        code: ALL_IN_DEMO_SOURCE,
        language: "tsx",
      },
      description: {
        component:
          "Lifecycle over **two school documents**: CustomForm (`flatItems`) + FormResponse. Design / Fill / Update are views. Fill draft + FormResponse are stored as base64url text args (`responsesText` / `formResponseText`) so Storybook URL sync preserves empty `changes: {}` and emails/ISO dates.",
      },
    },
  },
  render: AllInStory,
  argTypes: {
    heading: { control: "text", table: { category: "Layout" } },
    phase: {
      control: "select",
      options: ["design", "fill", "update"],
      table: { category: "Layout" },
    },
    flatItems: {
      control: "object",
      description: "CustomForm design (flat edit list).",
      table: { category: "CustomForm" },
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
    showDeleted: { control: "boolean", table: { category: "Update view" } },
  },
  args: {
    heading: "All-in lifecycle",
    phase: "design",
    flatItems: FORM_ITEM_EDITOR_INITIAL,
    responsesText: EMPTY_RESPONSES_TEXT,
    formResponseText: "",
    showDeleted: false,
  },
};

type Story = StoryObj<StoryArgs>;

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
