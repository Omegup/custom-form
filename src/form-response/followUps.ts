import type {
  AdditionalChanges,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  Response,
  SIndexed,
} from "./_deps";
import { formResponseValues } from "./values";
import type { FormResponseDoc } from "./types";

export const followUpItemIds = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
): Set<string> => {
  const ids = new Set<string>();
  for (const change of Object.values(changes)) {
    for (const entry of change.formItems ?? []) {
      if (entry.formItem) ids.add(entry.formItem.id);
    }
  }
  return ids;
};

export const followUpsByOrigin = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  changes: AdditionalChanges<TypeNames, Params>,
): Record<string, RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[]> => {
  const map: Record<
    string,
    RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[]
  > = {};
  for (const [originId, change] of Object.entries(changes)) {
    const items =
      change.formItems?.flatMap((entry) =>
        entry.formItem
          ? [
              {
                header: entry.formItem,
                children: entry.children ?? [],
                meta: { index: 0, total: 1, sIndex: 0 },
              },
            ]
          : [],
      ) ?? [];
    if (!items.length) continue;
    map[originId] = items;
  }
  return map;
};

export const unansweredFollowUpIds = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  doc: FormResponseDoc<TypeNames, Params> | null,
  followUpIds: Iterable<string>,
): Set<string> => {
  const answered = doc ? formResponseValues(doc) : {};
  const ids = new Set<string>();
  for (const id of followUpIds) {
    const res: Response | undefined = answered[id];
    if (!res || Object.keys(res.data).length === 0) ids.add(id);
  }
  return ids;
};
