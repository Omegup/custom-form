/**
 * Section review domain — Design → Response → Follow walkthrough for one
 * section (same phases as the form-review demo, narrowed to a single section).
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

export type FieldVariant = {
  border: string;
  background: string;
  badge: ReactNode;
  shell: CSSProperties;
  reviewTone: boolean;
};

export type Variants = lib.TheVariants<FieldVariant>;

export type Ctx = lib.SectionReviewContext;

export type Section = lib.SectionReviewHeader;

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
export type FieldExtra = lib.ReviewExtra & {
  impRef: Ref<lib.ViewerMethods>;
};

/** Demo walkthrough stage — not part of the library API. */
export type DemoPhase = "design" | "response" | "follow";

export type StoryArgs = {
  heading: string;
  phase: DemoPhase;
  flatItems: DesignFlatItems;
  section: ListSection;
  responses: Record<string, lib.Response>;
  changes: lib.AdditionalChanges<TypeNames, Params>;
  reviewPending: boolean;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
