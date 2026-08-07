/**
 * Demo domain = form-item-editor demo types (`field` / `heading` / `panel`)
 * so the same editor stack serves the All-in story.
 */
import type * as itemTypes from "../../form-item-editor/demo/formItemEditorDemoTypes.t";

export type {
  TypeNames,
  Params,
  Section,
  FlatItems,
  Ctx,
  ItemExtra,
} from "../../form-item-editor/demo/formItemEditorDemoTypes.t";

export type StoryArgs = {
  flatItems: itemTypes.FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
