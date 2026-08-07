/**
 * Demo domain = form-item-editor demo types (`field` / `heading` / `panel`)
 * so one editor stack serves the side-menu story.
 */
import type * as itemTypes from "../../form-item-editor/demo/formItemEditorDemoTypes.t";
import type * as lib from "./library";

export type {
  TypeNames,
  Params,
  Section,
  FlatItems,
  Ctx,
  ItemExtra,
  EditingSession,
} from "../../form-item-editor/demo/formItemEditorDemoTypes.t";

/** Library catalog entry for the demo domain. */
export type DemoMenuItem = lib.MenuItemDefinition<
  itemTypes.TypeNames,
  itemTypes.Params
>;

/** Open "+ Add section" session — shape the section-edit dialog/save consume. */
export type SectionSession = lib.FlatSectionEditSession<
  itemTypes.TypeNames,
  itemTypes.Params,
  itemTypes.Section
>;

export type StoryArgs = {
  flatItems: itemTypes.FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
