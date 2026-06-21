/**
 * Replace one section's flat slice — header fields and column layout.
 * Logic from school form-edit-react/useDialog section onSave.
 */
import type { FlatFormItems, MetaDom, ParamsDom, SectionDom } from "./_deps";
import { consolidateSections, flatten, resizeColumns } from "./_deps";

export const updateSectionInFlat = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom & { title: string; description: string },
  Meta extends MetaDom = MetaDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  sectionId: string,
  header: Pick<SectionConfig, "title" | "description">,
  cols: number,
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const sections = consolidateSections(items);
  const section = sections.find((s) => s.header.id === sectionId);
  if (!section) return items;

  const flattener = flatten<TypeNames, Params, SectionConfig, Meta>();
  const nextItems = resizeColumns<TypeNames, Params, Meta>(cols, section.items);
  const nextSection = flattener.section({
    header: { ...section.header, ...header },
    items: nextItems,
  });
  const prevSection = flattener.section(section);

  return items.toSpliced(
    section.meta.index,
    prevSection.length,
    ...nextSection,
  );
};
