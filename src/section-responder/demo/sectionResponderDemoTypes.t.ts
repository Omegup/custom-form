/**
 * Minimal fill domain for `SectionResponder` — one text field type answering
 * into `Response.data.value`, wrapped in a single section.
 */
import type { CSSProperties, ReactNode, Ref } from "react";
import type { FlatItems as DesignFlatItems } from "../../form-dialogs/demo/formDialogsDemoTypes.t";
import type * as lib from "./library";

export type TypeNames = "field" | "heading" | "panel";

export type Params = lib.TheParams<{
  field: { name: string; required: boolean };
  heading: { name: string };
  panel: { name: string; multiple: boolean };
}>;

/** Host-owned chrome value (not a name key). */
export type FieldVariant = {
  border: string;
  background: string;
  badge: ReactNode;
  shell: CSSProperties;
  errorBorder?: string;
};

export type Variants = lib.TheVariants<{
  field: FieldVariant;
  heading: FieldVariant;
  panel: FieldVariant;
}>;

export type Ctx = lib.SectionResponderContext;

export type Section = lib.SectionResponderHeader;

export type ItemMeta = lib.MetaDom<lib.SIndexed | Record<string, never>>;
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

export type DemoPhase = "design" | "fill";

export type StoryArgs = {
  heading: string;
  phase: DemoPhase;
  flatItems: DesignFlatItems;
  section: ListSection;
  responses: Record<string, lib.Response>;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
