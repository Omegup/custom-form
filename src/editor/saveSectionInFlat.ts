/**
 * Save an edited section into the flat list.
 * Delegates to section-edit/updateSectionInFlat.
 */
import type {
  FlatFormItems,
  MetaDom,
  ParamsDom,
  SectionDom,
  SectionWithItems,
} from "./_deps";
import { updateSectionInFlat } from "./_deps";

export const saveSectionInFlat = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom & { title: string; description: string },
  Meta extends MetaDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  _editing: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    { section: { index: number; total: number } },
    Meta
  >,
  saved: { header: SectionConfig; cols: number },
): FlatFormItems<TypeNames, Params, SectionConfig> =>
  updateSectionInFlat(items, saved.header.id, {
    title: saved.header.title,
    description: saved.header.description,
  }, saved.cols);
