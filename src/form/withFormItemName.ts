import type { ParamsDom, SomeFormItem } from "./form.t";

/**
 * Set shared `params.name` on any item without a per-type switch.
 * `Params` must include `{ name: string }` on every type (same constraint as
 * `cloneFlatItems`). New item types need no update here — only viewers/editors.
 */
export const withFormItemName = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames, { name: string }>,
>(
  item: SomeFormItem<TypeNames, Params>,
  name: string,
): SomeFormItem<TypeNames, Params> => ({
  ...item,
  params: { ...item.params, name },
});
