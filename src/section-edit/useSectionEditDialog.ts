/**
 * Section edit dialog state — form values, validation, submit handler.
 * See section-edit/README.md.
 */
import type { SubmitEvent } from "react";
import type { ContextDom, SectionDom } from "./_deps";
import type {
  Errors,
  SectionEditDialogProps,
  SectionEditForm,
  UseSectionEditDialog,
} from "./types";
import { useState } from "../side-menu/_deps";

export const useSectionEditDialog = <
  SectionConfig extends SectionDom & { title: string; description: string },
  Context extends ContextDom,
>(
  props: SectionEditDialogProps<SectionConfig, Context>,
  args: {
    validate: (section: SectionEditForm) => Errors<SectionEditForm>;
  },
): ReturnType<
  UseSectionEditDialog<SectionConfig, SectionEditForm, Context>
> => {
  const {
    section: { header, cols },
    onSave,
  } = props;

  const [section, setSection] = useState<SectionEditForm>({
    title: header.title,
    description: header.description,
    cols,
  });
  const [errors, setErrors] = useState<Errors<SectionEditForm>>({});

  const setValue = <K extends keyof SectionEditForm>(
    key: K,
    value: SectionEditForm[K],
  ) => {
    setSection((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const isValid = (key: "title" | "description") => !errors[key];

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = args.validate(section);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave({
        header: {
          ...header,
          title: section.title,
          description: section.description,
        },
        cols: section.cols,
      });
    }
  };

  return { section, setValue, onSubmit, isValid };
};
