/**
 * Minimal fill domain — one text field type answering into `Response.data.value`.
 */
import type { ReactNode, Ref } from "react";
import type * as lib from "./library";

export type TypeNames = "field";

export type Params = lib.TheParams<{
  field: { name: string; required: boolean };
}>;

export type Variants = lib.TheVariants<{
  field: "default";
}>;

export type Ctx = lib.ContextDom;

export type Item = lib.TypedFormItem<Params, "field">;

/** Shared viewer bag (no impRef — that is layered by host vs `getUseImpRefViewProps`). */
export type FieldBaseExtra = lib.ExtraDom & {
  response: lib.ResponseSetter;
  error: string | null;
};

/** What the field viewer receives after `getUseImpRefViewProps`. */
export type FieldExtra = FieldBaseExtra & {
  impRef: Ref<lib.ViewerMethods>;
};

/** What the host passes before the transform. */
export type FieldExtraView = FieldBaseExtra & {
  impRef: Ref<lib.StrictViewerMethods>;
  getChild: (suffix: string, index: number) => ReactNode;
};

export type StoryArgs = {
  heading: string;
  items: Item[];
  responses: Record<string, lib.Response>;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
