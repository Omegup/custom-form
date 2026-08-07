/**
 * Catalog definition → blank item stub.
 * School section-edit-ui `FormMenuItem` `mapMenu` + `Array(n).fill([])`;
 * span meta (`index` / `sIndex`) is supplied by the caller — sidebar clicks
 * default to `-1`, slot dropdowns pass a concrete insertion index.
 */
import type {
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SIndexed,
  SomeFormItem,
} from "./_deps";
import type { MenuItemDefinition } from "./MenuItemDefinition.t";

/** New item without a flat span yet — feeds `openFormItemInsertSession`. */
export type NewFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  header: SomeFormItem<TypeNames, Params>;
  children: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
};

export const createBlankFormItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  definition: MenuItemDefinition<TypeNames, Params>,
  random: () => string,
): NewFormItem<TypeNames, Params> => ({
  header: { ...definition.header, id: random(), deleted: false },
  children: Array.from({ length: definition.n ?? 0 }, () => []),
});
