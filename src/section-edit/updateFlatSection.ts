/**
 * Patch one `{ section }` marker in a flat list by section id.
 */
import type { ParamsDom } from "../form";
import type { FlatFormItems, SectionDom } from "../form-edit/flat-item-raw-actions";

export const updateFlatSection = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom & { title: string; description: string },
>(
  items: FlatFormItems<TypeNames, Params, SectionConfig>,
  sectionId: string,
  header: Pick<SectionConfig, "title" | "description">,
): FlatFormItems<TypeNames, Params, SectionConfig> =>
  items.map((fi) =>
    "section" in fi && fi.section.id === sectionId
      ? { section: { ...fi.section, ...header } }
      : fi,
  );
