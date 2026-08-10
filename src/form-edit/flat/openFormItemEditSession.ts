/**
 * Snapshot a consolidated item for a single-item edit dialog.
 * Draft = flat header + column count; the span locates the item back in the
 * flat list for `applyFlatFormItem`.
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SomeFormItem } from "./_deps";
import type { FlatEditSpan } from "./applyFlatFormItem";
import type { SIndexed } from "./consolidate";
import type { FlatFormItem } from "./flat-form.t";

export type FlatFormItemEditSession<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = FlatEditSpan & {
  draft: FlatFormItem<TypeNames, Params>;
  children: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
};

export const openFormItemEditSession = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>,
): FlatFormItemEditSession<TypeNames, Params> => ({
  draft: { item: item.header, n: item.children.length },
  children: item.children,
  index: item.meta.index,
  total: item.meta.total,
  sIndex: item.meta.sIndex,
});

/**
 * Session for a *new* item (no flat span yet, `total: 0`).
 * Default span `{ index: -1, sIndex: -1 }` appends to the first non-deleted
 * section (side-menu); an add-item slot passes its concrete insertion index.
 */
export const openFormItemInsertSession = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  item: {
    header: SomeFormItem<TypeNames, Params>;
    children: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
  },
  span: { index: number; sIndex: number } = { index: -1, sIndex: -1 },
): FlatFormItemEditSession<TypeNames, Params> => ({
  draft: { item: item.header, n: item.children.length },
  children: item.children,
  index: span.index,
  total: 0,
  sIndex: span.sIndex,
});
