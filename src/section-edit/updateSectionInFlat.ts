/**
 * Save an edited or new section into a flat edit list.
 * Ported from school form-edit-react/useDialog.tsx section `onSave`
 * (pure part only — no setItems / autofocus ctx).
 */
import type {
  FlatFormItems,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionDom,
  SIndexed,
} from "./_deps";
import { flatten, resizeColumns } from "./_deps";

/**
 * Flat span of the section being edited. `index === -1` appends a new
 * section instead of replacing an existing span.
 */
export type SectionEditSpan<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  /** Flat index of the section marker. */
  index: number;
  /** Flat entry count of the section span (marker + content). */
  total: number;
  /** Column grid captured when the session opened. */
  items: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
};

export const updateSectionInFlat = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  flatItems: FlatFormItems<TypeNames, Params, SectionConfig>,
  editing: SectionEditSpan<TypeNames, Params>,
  header: SectionConfig,
  cols: number,
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const items = resizeColumns(cols, editing.items);
  const list = flatten<
    TypeNames,
    Params,
    SectionConfig,
    MetaDom<SIndexed>
  >().section({ header, items });
  if (editing.index === -1) return flatItems.concat(list);
  return flatItems.toSpliced(editing.index, editing.total, ...list);
};
