/**
 * Replace one section's flat slice — header fields and column layout.
 */
import type { ParamsDom } from "../form";
import { consolidateSections } from "../form-edit/consolidateSections";
import type { FlatFormItems, SectionDom } from "../form-edit/flat-item-raw-actions";
import { flatten } from "../form-edit/section-actions/flatten";
import type { MetaDom } from "../recursive-form";
import { changeSectionCols } from "./changeSectionCols";

export const updateFlatSection = <
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

  const flat = flatten<TypeNames, Params, SectionConfig, Meta>();
  const nextItems = changeSectionCols<TypeNames, Params, Meta>(cols, section.items);
  const nextSection = flat.section({
    header: { ...section.header, ...header },
    items: nextItems,
  });
  const prevSection = flat.section(section);

  return items.toSpliced(
    section.meta.index,
    prevSection.length,
    ...nextSection,
  );
};
