/**
 * Insert a new item or section into a flat edit list.
 * Logic ported from school form-edit-react/useDialog (add-item flow).
 * See side-menu/README.md.
 */
import type { ParamsDom } from "./_deps";
import type { MetaDom, RecursiveFormItem } from "./_deps";
import type { FlatFormItems, SectionDom } from "./_deps";
import { flatten } from "./_deps";

const sectionFlatIndex = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  sIndex: number,
): number => {
  let count = -1;
  for (let i = 0; i < items.length; i++) {
    const fi = items[i];
    if ("section" in fi) {
      if (++count === sIndex) return i;
    }
  }
  return -1;
};

/** Insert a form item into the flat list (add flow, from useDialog in form-edit-react). */
export const insertFlatFormItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  Meta extends MetaDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  formItem: RecursiveFormItem<TypeNames, Params, Meta>,
  sIndex = -1,
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const list = flatten<TypeNames, Params, SectionConfig, Meta>().formItem(
    formItem,
  );
  const sectionIndex =
    sIndex === -1
      ? items.findIndex((q) => "section" in q && !q.section.deleted)
      : sectionFlatIndex(items, sIndex);
  if (sectionIndex === -1) return items;

  const nextSectionOrMinus1 = items.findIndex(
    (q, i) => i > sectionIndex && "section" in q,
  );
  const nextSection =
    nextSectionOrMinus1 === -1 ? items.length : nextSectionOrMinus1;
  const justAfter = items.findLastIndex(
    (q, i) =>
      i < nextSection && ("section" in q || ("item" in q && !q.item.deleted)),
  );

  return items.toSpliced(justAfter + 1, 0, ...list);
};

/** Append a new section marker at the end of the flat list. */
export const appendFlatSection = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  section: SectionConfig,
): FlatFormItems<TypeNames, Params, SectionConfig> => [...items, { section }];
