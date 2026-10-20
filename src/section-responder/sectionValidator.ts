import type { StrictViewerMethods } from "./_deps";
import type { SectionValidator } from "./types";

export const sectionValidator = (
  validators: Record<string, StrictViewerMethods | null>,
): SectionValidator => ({
  validate: (values) => {
    const errors: Record<string, string | null> = {};
    for (const qId in validators) {
      const ref = validators[qId];
      if (!ref) continue;
      const error = ref.validate(values[qId]);
      if (error) errors[qId] = error;
    }
    return errors;
  },
  update: (values) =>
    Object.entries(validators).reduce(
      (acc, [key, validator]) =>
        validator ? { ...acc, [key]: validator.update(acc[key]) } : acc,
      values,
    ),
  getKeys: () =>
    Object.entries(validators).flatMap(([k, v]) => (v ? [k] : [])),
});
