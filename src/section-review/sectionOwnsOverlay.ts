/**
 * Multi-section: only the section that owns `id` (tree or a follow-up
 * attached to an origin in that tree) mounts the overlay.
 */
import type { MetaDom, ParamsDom, RecursiveFormItem } from "./_deps";
import type { AdditionalChanges } from "./types";

export const idInSectionTree = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
>(
  id: string,
  slots: RecursiveFormItem<TypeNames, Params, Meta>[][],
): boolean =>
  slots.some((items) =>
    items.some(
      (item) =>
        item.header.id === id || idInSectionTree(id, item.children),
    ),
  );

export const sectionOwnsOverlay = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
>(
  id: string,
  slots: RecursiveFormItem<TypeNames, Params, Meta>[][],
  changes: AdditionalChanges<TypeNames, Params>,
): boolean => {
  if (idInSectionTree(id, slots)) return true;
  for (const [originId, change] of Object.entries(changes)) {
    if (
      change.formItems?.some((e) => e.formItem?.id === id) &&
      idInSectionTree(originId, slots)
    )
      return true;
  }
  return false;
};
