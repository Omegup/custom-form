/**
 * Design-list helpers. `sectionsFromFlat` keeps headings and panels so fill
 * can repeat multiple-panel instances. `flatFromFieldSections` seeds a design
 * list from fill/review fixtures.
 */
import type * as types from "./formDialogsDemoTypes.t";
import * as lib from "./library";

type SeedSection<Meta extends lib.MetaDom, Sec extends types.Section> = {
  header: Sec;
  items: lib.RecursiveFormItem<types.TypeNames, types.Params, Meta>[][];
};

/** Nested design tree — headings and panels included. */
export const sectionsFromFlat = (flatItems: types.FlatItems) =>
  lib.consolidateSections(flatItems);

/** Seed a design list from fill / review fixtures. */
export const flatFromFieldSections = <
  Meta extends lib.MetaDom,
  Sec extends types.Section,
>(
  sections: ReadonlyArray<SeedSection<Meta, Sec>>,
): types.FlatItems => {
  const { section } = lib.flatten<
    types.TypeNames,
    types.Params,
    types.Section,
    Meta
  >();
  return sections.flatMap((s) =>
    section({ header: s.header, items: s.items }).map((entry) => {
      if ("section" in entry) return { section: entry.section };
      if ("end" in entry) return { end: null };
      return { n: entry.n, item: entry.item };
    }),
  );
};
