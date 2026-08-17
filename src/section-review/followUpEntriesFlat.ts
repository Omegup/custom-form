/**
 * Bridge reviewer follow-up entries ↔ a synthetic flat section so a host can
 * reuse the design list editor (`SectionFormItemHOC` + dialogs).
 */
import type {
  FlatFormItems,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionDom,
  SIndexed,
} from "./_deps";
import { branded, consolidateSections, flatten } from "./_deps";
import type { ReviewFormItemEntry } from "./types";

export const followUpEntriesToFlat = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  entries: ReviewFormItemEntry<TypeNames, Params>[],
  section: SectionConfig,
): FlatFormItems<TypeNames, Params, SectionConfig> => {
  const toFlat = flatten<
    TypeNames,
    Params,
    SectionConfig,
    MetaDom<SIndexed>
  >();
  return [
    { section },
    ...entries.flatMap((entry) =>
      entry.formItem
        ? toFlat.formItem({
            header: entry.formItem,
            children: entry.children ?? [],
            meta: branded({ index: 0, total: 0, sIndex: 0 }),
          })
        : [],
    ),
  ];
};

/**
 * Map a flat design list back onto follow-up entries, preserving dates and
 * comment-only rows. Returns `null` when an empty tree would wipe existing
 * form-item entries (DnD/layout sync).
 */
export const syncFollowUpEntriesFromFlat = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  nextFlat: FlatFormItems<TypeNames, Params, SectionConfig>,
  previous: ReviewFormItemEntry<TypeNames, Params>[],
): ReviewFormItemEntry<TypeNames, Params>[] | null => {
  const roots: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[] =
    consolidateSections(nextFlat)[0]?.items.flat() ?? [];
  if (roots.length === 0 && previous.some((entry) => entry.formItem != null)) {
    return null;
  }
  const current = new Map(
    previous.flatMap((entry) =>
      entry.formItem ? [[entry.formItem.id, entry] as const] : [],
    ),
  );
  const commentOnly = previous.filter((entry) => !entry.formItem);
  return [
    ...roots.map((root) => {
      const prior = current.get(root.header.id);
      return {
        comment: prior?.comment ?? null,
        formItem: root.header,
        children: root.children,
        date: prior?.date ?? null,
      };
    }),
    ...commentOnly,
  ];
};

/** Design-list bind for unanswered follow-ups — host still mounts the editor. */
export const followUpDraftsList = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  entries: ReviewFormItemEntry<TypeNames, Params>[],
  setEntries: (entries: ReviewFormItemEntry<TypeNames, Params>[]) => void,
  section: SectionConfig,
): {
  flatItems: FlatFormItems<TypeNames, Params, SectionConfig>;
  setFlatItems: (
    items: FlatFormItems<TypeNames, Params, SectionConfig>,
  ) => void;
} => ({
  flatItems: followUpEntriesToFlat(entries, section),
  setFlatItems: (next) => {
    const synced = syncFollowUpEntriesFromFlat(next, entries);
    if (synced == null) return;
    setEntries(synced);
  },
});
