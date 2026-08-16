/**
 * Multi-section review domain for `CustomFormReview` — one text field type,
 * walked through Design → Response → Follow phases in the Storybook demo.
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

export type FieldExtra = lib.ReviewExtra & {
  impRef: Ref<lib.ViewerMethods>;
};

/** Demo walkthrough stage — not part of the library API. */
export type DemoPhase = "design" | "response" | "follow";

export type StoryArgs = {
  heading: string;
  phase: DemoPhase;
  header: lib.FormHeader;
  flatItems: DesignFlatItems;
  sections: ListSection[];
  responses: Record<string, lib.Response>;
  changes: lib.AdditionalChanges<TypeNames, Params>;
  reviewPending: boolean;
  showDeleted: boolean;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
