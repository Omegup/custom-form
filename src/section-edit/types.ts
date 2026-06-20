/** Section edit dialog types — form shape, props, hook return type. */
import type { SubmitEvent } from "react";
import type { ContextDom } from "./_deps";
import type { SectionDom } from "./_deps";

export type Errors<Form> = { [P in keyof Form]?: string };

export type SectionEditForm = {
  title: string;
  description: string;
  cols: number;
};

export type SectionEditDialogProps<
  SectionConfig extends SectionDom,
  Context extends ContextDom,
> = {
  section: { header: SectionConfig; cols: number };
  onSave: (section: { header: SectionConfig; cols: number }) => void;
  onClose: () => void;
  title: string;
  ctx: Context;
};

export type UseSectionEditDialog<
  SectionConfig extends SectionDom,
  Form extends SectionEditForm,
  Context extends ContextDom,
> = (
  props: SectionEditDialogProps<SectionConfig, Context>,
  args: {
    validate: (section: Form) => Errors<Form>;
  },
) => {
  section: Form;
  setValue: <K extends keyof Form>(key: K, value: Form[K]) => void;
  onSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
  isValid: (key: "title" | "description") => boolean;
};
