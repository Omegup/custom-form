/**
 * Minimal fill domain for `SectionResponder` — one text field type answering
 * into `Response.data.value`, wrapped in a single section.
 */
import type { Ref } from "react";
import type * as lib from "./library";

export type TypeNames = "field";

export type Params = lib.TheParams<{
  field: { name: string; required: boolean };
}>;

export type Variants = lib.TheVariants<{
  field: "default";
}>;

export type Ctx = lib.SectionResponderContext;

export type Section = lib.SectionResponderHeader;

export type ItemMeta = lib.MetaDom<Record<string, never>>;
export type SectionMeta = lib.SectionMetaDom<lib.Indexed>;

export type ListItem = lib.RecursiveFormItem<TypeNames, Params, ItemMeta>;

export type ListSection = lib.SectionWithItems<
  TypeNames,
  Params,
  Section,
  SectionMeta,
  ItemMeta
>;

/** What the field viewer receives after `getUseImpRefViewProps`. */
export type FieldExtra = lib.ResponderExtra & {
  impRef: Ref<lib.ViewerMethods>;
};

export type StoryArgs = {
  heading: string;
  section: ListSection;
  responses: Record<string, lib.Response>;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
