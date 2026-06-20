/**
 * Required-field validation for section title and description.
 */
import type { Errors, SectionEditForm } from "./types";

export type { SectionEditForm, SectionEditDialogProps, UseSectionEditDialog } from "./types";

export const validateSectionForm =
  (errors: Record<"title" | "description", string>) =>
  (values: SectionEditForm): Errors<SectionEditForm> => {
    const e: Errors<SectionEditForm> = {};
    if (!values.title.trim()) {
      e.title = errors.title;
    }
    if (!values.description.trim()) {
      e.description = errors.description;
    }
    return e;
  };
