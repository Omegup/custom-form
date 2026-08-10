import { describe, expect, it } from "vitest";
import { consolidateSections, type FlatNestedItem } from "../form-edit";
import type { TheParams } from "./_deps";
import { openSectionEditSession } from "./openSectionEditSession";
import { updateSectionInFlat } from "./updateSectionInFlat";

type TypeNames = "field";
type Params = TheParams<{ field: { name: string } }>;
type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

const sectionHeader = (id: string, title: string): Section => ({
  id,
  deleted: false,
  title,
  description: "",
});

const section = (
  id: string,
  title: string,
): FlatNestedItem<TypeNames, Params, Section> => ({
  section: sectionHeader(id, title),
});

const field = (
  id: string,
  name: string,
  n = 0,
): FlatNestedItem<TypeNames, Params, Section> => ({
  item: { id, type: "field", params: { name }, deleted: false },
  n,
});

const end = (): FlatNestedItem<TypeNames, Params, Section> => ({ end: null });

const flat = (...entries: FlatNestedItem<TypeNames, Params, Section>[]) =>
  entries;

const TWO_SECTIONS = flat(
  section("s1", "Main"),
  field("f1", "Name"),
  end(),
  field("f2", "Email"),
  section("s2", "Details"),
  field("f3", "Notes"),
);

describe("updateSectionInFlat", () => {
  it("replaces the section span when the header changes", () => {
    const sec = consolidateSections(TWO_SECTIONS)[0]!;
    const session = openSectionEditSession(sec);
    expect(session).toMatchObject({ index: 0, total: 4 });
    expect(session.draft.cols).toBe(2);

    const next = updateSectionInFlat(
      TWO_SECTIONS,
      session,
      { ...session.draft.header, title: "Renamed" },
      session.draft.cols,
    );

    expect(next).toEqual(
      flat(
        { section: sectionHeader("s1", "Renamed") },
        field("f1", "Name"),
        end(),
        field("f2", "Email"),
        section("s2", "Details"),
        field("f3", "Notes"),
      ),
    );
    expect(TWO_SECTIONS[0]).toEqual(section("s1", "Main"));
  });

  it("merges columns when cols shrink from 2 to 1", () => {
    const sec = consolidateSections(TWO_SECTIONS)[0]!;
    const session = openSectionEditSession(sec);

    const next = updateSectionInFlat(
      TWO_SECTIONS,
      session,
      session.draft.header,
      1,
    );

    expect(next).toEqual(
      flat(
        section("s1", "Main"),
        field("f1", "Name"),
        field("f2", "Email"),
        section("s2", "Details"),
        field("f3", "Notes"),
      ),
    );
  });

  it("appends a new section when index === -1", () => {
    const next = updateSectionInFlat(
      TWO_SECTIONS,
      { index: -1, total: 0, items: [[]] },
      sectionHeader("s3", "Extra"),
      2,
    );

    expect(next).toEqual(
      flat(
        section("s1", "Main"),
        field("f1", "Name"),
        end(),
        field("f2", "Email"),
        section("s2", "Details"),
        field("f3", "Notes"),
        section("s3", "Extra"),
        end(),
      ),
    );
    const added = consolidateSections(next).at(-1)!;
    expect(added.header.title).toBe("Extra");
    expect(added.items).toHaveLength(2);
  });
});
