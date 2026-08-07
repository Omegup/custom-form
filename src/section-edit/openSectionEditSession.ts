/**
 * Snapshot a consolidated section for the edit dialog.
 * Draft = header + column count; the span locates the section back in the
 * flat list for `updateSectionInFlat`.
 */
import type {
  Indexed,
  MetaDom,
  ParamsDom,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SIndexed,
} from "./_deps";
import type { SectionEditSpan } from "./updateSectionInFlat";

export type FlatSectionEditSession<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = SectionEditSpan<TypeNames, Params> & {
  draft: { header: SectionConfig; cols: number };
};

export const openSectionEditSession = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  section: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMetaDom<Indexed>,
    MetaDom<SIndexed>
  >,
): FlatSectionEditSession<TypeNames, Params, SectionConfig> => ({
  draft: { header: section.header, cols: section.items.length },
  items: section.items,
  index: section.meta.index,
  total: section.meta.total,
});
