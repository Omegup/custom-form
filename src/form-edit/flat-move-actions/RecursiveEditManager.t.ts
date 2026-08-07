/**
 * Section-edit manager types — school `types/edit-tree` (`RecursiveEditManager<T>`).
 * Consumed by `section-view`'s `RecursiveEditProps`/`SectionHOC`.
 */
import type { MetaDom, MoveActions, ParamsDom, RecursiveFormItem, SectionDom, SIndexed } from "./_deps";

/**
 * A section's own item grid, addressed like a node so add-item slots can be
 * computed the same way as any nested panel column. Mirrors school
 * `Recursive<T, null>` (edit-tree) minus the unused `header: null`.
 */
export type SectionNodes<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  /** Flat index of the section marker. */
  index: number;
  /** Flat entry count of the section span (marker + content). */
  total: number;
  /** This section's ordinal position among consolidated sections. */
  sIndex: number;
  children: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
};

/** Everything a section-edit UI needs — school `RecursiveEditManager<T>` (edit-tree). */
export type RecursiveEditManager<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = {
  item: SectionConfig;
  autofocus: boolean | null;
  resetAutofocus: () => void;
  actions: MoveActions;
  nodes: SectionNodes<TypeNames, Params>;
  setNodes: (nodes: SectionNodes<TypeNames, Params>) => void;
};
