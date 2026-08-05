import type { FlatFormItems, ParamsDom, SectionDom } from "./_deps";

export const buildItemSectionDict = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Section extends SectionDom,
>(
  items: FlatFormItems<TypeNames, Params, Section>,
): Record<string, Section> => {
  const dict: Record<string, Section> = {};
  let current: Section | undefined;
  for (const fi of items) {
    if ("section" in fi) current = fi.section;
    else if ("item" in fi && current) dict[fi.item.id] = current;
  }
  return dict;
};
