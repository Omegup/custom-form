import type * as lib from "./library";

export type TypeNames = "field";
export type Params = lib.TheParams<{ field: { name: string } }>;
/** Demo's own header shape — `title`/`description` are this host's choice, not a library requirement. */
export type Section = {
  id: string;
  deleted: boolean;
  title: string;
  description: string;
};

export type FlatItems = lib.FlatFormItems<TypeNames, Params, Section>;

/**
 * Dialog form values — concrete to *this demo's* `Section`, not a library
 * type. There's no reusable "section form" shape to abstract: any host
 * dialog has its own header fields, so this — and its validation — lives
 * with the host, same as `SectionDialog` itself (see section-edit/README.md).
 */
export type SectionForm = { title: string; description: string; cols: number };

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
