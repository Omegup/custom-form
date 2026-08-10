/**
 * Demo domain = form-item-editor demo types (`field` / `heading` / `panel`)
 * so the same editor stack serves the All-in story.
 *
 * List shell uses `section-view` (`SectionFormItemHOC` + `WebRecursiveEdit`);
 * dialog sessions still use form-item-editor / section-edit chrome via
 * `makeUseDialogs`.
 */
import type * as itemTypes from "../../form-item-editor/demo/formItemEditorDemoTypes.t";
import type * as lib from "./library";

export type {
  TypeNames,
  Params,
  Variants,
  Section,
  FlatItems,
  Ctx,
  ItemExtra,
  ItemHeader,
  ListItem,
  ListSection,
  ItemMeta,
} from "../../form-item-editor/demo/formItemEditorDemoTypes.t";

/** Inner context before `AutoFocus` wrapping — passed as `Context` to `SectionFormItemHOC`. */
export type BaseCtx = lib.ContextDom & { focused: lib.AutoFocusState };

/** List autofocus ctx — what `SectionFormItemHOC` / move actions consume. */
export type ListCtx = lib.AutoFocus<BaseCtx, boolean>;

/**
 * Per-item viewer extra for the list shell (not the dialog's `ItemExtra`).
 * Move actions + Edit open-handler; display label comes from the form item.
 */
export type ListExtra = lib.ExtraDom & {
  actions: lib.MoveActions;
  onEdit: () => void;
};

export type StoryArgs = {
  flatItems: itemTypes.FlatItems;
  heading: string;
};

export type DemoProps = StoryArgs & {
  updateArgs: (patch: Partial<StoryArgs>) => void;
};
