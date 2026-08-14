/**
 * Design-list ↔ field-only sections. Fill / review HOCs stay field-only;
 * headings and panels remain on the form-dialogs editor list.
 */
import type * as types from "./formDialogsDemoTypes.t";
import * as lib from "./library";

type FieldParams = lib.TheParams<{ field: { name: string; required: boolean } }>;

type FieldNode<Meta extends lib.MetaDom> = lib.RecursiveFormItem<
  "field",
  FieldParams,
  Meta
>;

type FieldSection<Meta extends lib.MetaDom, Sec extends types.Section> = {
  header: Sec;
  items: FieldNode<Meta>[][];
};

export type FieldOnlyItem = {
  header: lib.TypedFormItem<FieldParams, "field">;
  meta: Record<string, never>;
  children: FieldOnlyItem[][];
};

export type FieldOnlySection = {
  meta: lib.Indexed;
  header: types.Section;
  items: FieldOnlyItem[][];
};

const fieldItem = (item: types.ListItem): FieldOnlyItem[] => {
  if (item.header.type !== "field")
    return item.children.flatMap((slot) => slot.flatMap(fieldItem));
  return [
    {
      header: lib.branded({
        id: item.header.id,
        type: "field",
        deleted: item.header.deleted,
        params: item.header.params,
      }),
      meta: {},
      children: [],
    },
  ];
};

/** Lift fields out of a design list (skip headings; unwrap panels). */
export const toFieldSections = (flatItems: types.FlatItems): FieldOnlySection[] =>
  lib.consolidateSections(flatItems).map((section) => ({
    meta: section.meta,
    header: section.header,
    items: section.items.map((col) => col.flatMap(fieldItem)),
  }));

/** Seed a design list from field-only review / fill fixtures. */
export const flatFromFieldSections = <
  Meta extends lib.MetaDom,
  Sec extends types.Section,
>(
  sections: ReadonlyArray<FieldSection<Meta, Sec>>,
): types.FlatItems => {
  const { section } = lib.flatten<"field", FieldParams, types.Section, Meta>();
  return sections.flatMap((s) =>
    section({ header: s.header, items: s.items }).map((entry) => {
      if ("section" in entry) return { section: entry.section };
      if ("end" in entry) return { end: null };
      return {
        n: entry.n,
        item: {
          id: entry.item.id,
          type: "field" as const,
          deleted: entry.item.deleted,
          params: entry.item.params,
        },
      };
    }),
  );
};
