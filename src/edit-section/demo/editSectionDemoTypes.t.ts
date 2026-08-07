/**
 * Demo domain = form-item-editor demo types (`field` / `heading` / `panel`);
 * the catalog is shared with the side-menu demo (`side-menu/demo/fixtures`).
 */
import type * as itemTypes from "../../form-item-editor/demo/formItemEditorDemoTypes.t";

export type {
  TypeNames,
  Params,
  Section,
  FlatItems,
  Ctx,
  ItemExtra,
  EditingSession,
} from "../../form-item-editor/demo/formItemEditorDemoTypes.t";

export type StoryArgs = {
  flatItems: itemTypes.FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
