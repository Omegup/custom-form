import type * as lib from "./library";

export type TypeNames = "field";
export type Params = lib.TheParams<{ field: { name: string } }>;
export type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;

/** Open section session — `section-edit` shape: draft + column grid + flat span. */
export type EditingSession = lib.FlatSectionEditSession<
  TypeNames,
  Params,
  Section
>;

export type StoryArgs = {
  flatItems: FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
