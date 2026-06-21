/**
 * Save an edited or new form item into the flat list.
 * Logic from school form-edit-react/useDialog setEditFormItemX.
 */
import type {
  FlatFormItems,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionDom,
} from "./_deps";
import { flatten, insertFlatFormItem, resizeColumns } from "./_deps";

export const applyFlatFormItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  Meta extends MetaDom<{ index: number; total?: number; sIndex?: number }>,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  editing: RecursiveFormItem<TypeNames, Params, Meta> | null,
  item: RecursiveFormItem<TypeNames, Params, Meta>,
  cols: number,
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const children = resizeColumns<TypeNames, Params, Meta>(cols, item.children);
  const next = { ...item, children };
  const list = flatten<TypeNames, Params, SectionConfig, Meta>().formItem(next);

  if (editing && editing.meta.index !== -1) {
    return items.toSpliced(editing.meta.index, editing.meta.total ?? 0, ...list);
  }

  const sIndex = editing?.meta.sIndex ?? next.meta.sIndex ?? -1;
  return insertFlatFormItem(items, next, sIndex);
};
