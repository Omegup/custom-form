/** Section edit types — see section-edit/README.md. */

export type Errors<T> = { [P in keyof T]?: string };

/** Dialog form values — school `types/edit-form-react` `SectionEditForm`. */
export type SectionEditForm = {
  title: string;
  description: string;
  cols: number;
};
