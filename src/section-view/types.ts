/** section-view types — see section-view/README.md. */
import type { ReactNode } from "react";
import type {
  AutoFocus,
  Children,
  Clone,
  ContextDom,
  ExtraDom,
  FlatFormItemEditSession,
  GetActionsArgs,
  Indexed,
  MetaDom,
  ParamsDom,
  RecursiveEditManager,
  RecursiveFormItem,
  RenderCard,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SIndexed,
  VariantsDom,
} from "./_deps";

/**
 * Add-item slot address — flat insertion index + owning section ordinal.
 * Same shape as side-menu's `AddFormItem` `span` / `AddItemSlot` in demos.
 */
export type NodeIndex = { index: number; sIndex: number };

/**
 * Fields `createRenderEditFormItem` adds to every item's viewer `extra` —
 * school `types/edit-form-react` `EditExtra`.
 */
export type EditExtra = { parentDeleted: boolean; index: number };

export type RenderNodeArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = {
  item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>;
  children: ReactNode;
  parentDeleted: boolean;
  index: number;
};

/**
 * What a `renderEdit` implementation (e.g. `ColumnsEdit`) needs to draw one
 * section — school `RecursiveEditProps`.
 */
export type RecursiveEditProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = {
  edit: RecursiveEditManager<TypeNames, Params, SectionConfig>;
  title: ReactNode;
  render: {
    addItem: (node: NodeIndex) => ReactNode;
    node: (args: RenderNodeArgs<TypeNames, Params>) => ReactNode;
  };
};

/**
 * Props `SectionHOC` threads through to `renderTitle` / `renderFormItem`.
 *
 * Deliberately flatter than school's `SectionProps`: no branded
 * `SectionExtraDom` bag and no `SectionEditArgs` wrapper bundling
 * `{ clone, actions, sections, section, i }` — `getSectionEdit` here only
 * needs `args` + `clone` + `section` + `sIndex` + `jump` (it rewrites the
 * flat list directly instead of rebuilding it from a `sections` array), so
 * those are carried as plain sibling fields instead.
 */
export type SectionProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  SectionConfig extends SectionDom,
  Context extends ContextDom,
  Extra extends ExtraDom,
> = {
  ctx: AutoFocus<Context, boolean>;
  variants: Variants;
  /** Per-item viewer extra (domain data) — combined with `EditExtra` + `getChild` by `createRenderEditFormItem`. */
  itemExtra: (id: string) => Extra;
  /**
   * Item chrome — receives viewer output plus `EditExtra` and `children`
   * (`createFormItemByGetChild` always materializes `extra.children`, even when
   * empty). Hosts should place nested columns **below** the row header, not
   * inside a horizontal name slot.
   */
  renderCard: RenderCard<
    TypeNames,
    Params,
    Variants,
    Extra & EditExtra & Children,
    AutoFocus<Context, boolean>
  >;
  args: GetActionsArgs<TypeNames, Params, AutoFocus<Context, boolean>, SectionConfig>;
  clone: Clone<TypeNames, Params, AutoFocus<Context, boolean>, SectionConfig>;
  section: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMetaDom<Indexed>,
    MetaDom<SIndexed>
  >;
  /** This section's ordinal position among consolidated sections. */
  sIndex: number;
  jump: boolean;
  /** Plug into `makeUseRenderAddItem(setAddItem)` (side-menu) at the call site. */
  setAddItem: (session: FlatFormItemEditSession<TypeNames, Params>) => void;
};

export type RenderFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  SectionConfig extends SectionDom,
  Context extends ContextDom,
  Extra extends ExtraDom,
> = (
  props: SectionProps<TypeNames, Params, Variants, SectionConfig, Context, Extra>,
) => (args: RenderNodeArgs<TypeNames, Params>) => ReactNode;
