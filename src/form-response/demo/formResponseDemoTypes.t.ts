/**
 * FormResponse lifecycle domain — same item types as the design editor
 * (`field` / `heading` / `panel`).
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
  errorBorder?: string;
  reviewTone: boolean;
};

export type Variants = lib.TheVariants<FieldVariant>;

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

export type FillExtra = lib.ResponderExtra & {
  impRef: Ref<lib.ViewerMethods>;
};

export type ReviewExtra = lib.ReviewExtra & {
  impRef: Ref<lib.ViewerMethods>;
};

export type FormResponseDoc = lib.FormResponseDoc<TypeNames, Params>;

export type DemoPhase = "design" | "fill" | "update";

export type StoryArgs = {
  heading: string;
  phase: DemoPhase;
  showDeleted: boolean;
  flatItems: DesignFlatItems;
  responsesText: string;
  formResponseText: string;
};

export type DemoProps = {
  heading: string;
  phase: DemoPhase;
  showDeleted: boolean;
  flatItems: DesignFlatItems;
  responses: Record<string, lib.Response>;
  formResponse: FormResponseDoc | null;
  updateArgs: (
    patch: Partial<{
      heading: string;
      phase: DemoPhase;
      showDeleted: boolean;
      flatItems: DesignFlatItems;
      responses: Record<string, lib.Response>;
      formResponse: FormResponseDoc | null;
    }>,
  ) => void;
};
