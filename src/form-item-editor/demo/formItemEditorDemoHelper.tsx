import type { ReactNode } from "react";
import { withFileHeader, ConfirmBanner, EditorDialog, RequiredToggle, MultipleToggle, SelectField, TextField } from "../../demo-utils";
import {
  SectionsList,
  pendingRemoveCopy,
  renderListCard,
} from "../../form-edit/demo/editFormDemoHelper";
import { listViewers } from "./listViewers";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import { renderAddFormItem } from "../../side-menu/demo/sideMenuDemoHelper";
import { columnsChrome } from "../../section-view/demo/sectionViewDemoHelper";
import type * as types from "./formItemEditorDemoTypes.t";
import formItemEditorDemoSource from "./FormItemEditorDemo.tsx?raw";
import formItemEditorDemoTypesSource from "./formItemEditorDemoTypes.t.ts?raw";
import { defaultVariants } from "./itemVariants";
import * as lib from "./library";

export type { StoryArgs } from "./formItemEditorDemoTypes.t";
export { EditorDialog, TextField };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

export const FORM_ITEM_EDITOR_DEMO_SOURCE = [
  withFileHeader("formItemEditorDemoTypes.t.ts", formItemEditorDemoTypesSource),
  "",
  withFileHeader("FormItemEditorDemo.tsx", formItemEditorDemoSource),
].join("\n");

// ── Edit dialog + field chrome (orthogonal to the HOC showcase) ─────────────

export const NameField = ({
  value,
  error,
  onChange,
}: {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}) => (
  <TextField
    label="Name"
    value={value}
    error={error}
    multiline={false}
    onChange={onChange}
  />
);

export { RequiredToggle, MultipleToggle };

/**
 * School `question()` slice for required — wrap a field editor so the
 * Required toggle sits below the domain fields (same seam as
 * `props.render(renderRequired())`).
 */
export const wrapWithRequired =
  (
    Editor: (props: types.FieldEditorProps) => ReactNode,
  ): ((props: types.FieldEditorProps) => ReactNode) =>
  (props) => (
    <>
      <Editor {...props} />
      <RequiredToggle
        checked={props.flatFormItem.item.params.required}
        onChange={(required) =>
          props.setFormItemParam(() => ["required", required])
        }
      />
    </>
  );

/** School panel `multiple` — student may add many answer rows. */
export const wrapWithMultiple =
  (
    Editor: (props: types.PanelEditorProps) => ReactNode,
  ): ((props: types.PanelEditorProps) => ReactNode) =>
  (props) => (
    <>
      <Editor {...props} />
      <MultipleToggle
        checked={props.flatFormItem.item.params.multiple}
        onChange={(multiple) =>
          props.setFormItemParam(() => ["multiple", multiple])
        }
      />
    </>
  );

const MAX_NAME_LEN = 10;

export { MAX_NAME_LEN };

const MIN_HEADING_LEN = 3;

export { MIN_HEADING_LEN };

export const PANEL_COL_OPTIONS = [1, 2] as const;

/** School `editors/selectSection.tsx` `<Select>` — visible only when there's more than one section to choose from. */
export const SelectSection = ({
  sections,
  value,
  error,
  onChange,
}: {
  sections: types.SectionOption[];
  value: number;
  error: string | null;
  onChange: (index: number) => void;
}) => (
  <SelectField
    label="Section"
    value={value}
    error={error}
    placeholder="Choose a section…"
    options={sections}
    onChange={onChange}
  />
);

const MIN_PANEL_TITLE_LEN = 2;

export { MIN_PANEL_TITLE_LEN };

// ── List shell (`SectionFormItemHOC` + ColumnsEdit) ───────────────────────────

type CardExtra = types.ListExtra & lib.EditExtra & lib.Children;

const cloneFn: lib.Clone<
  types.TypeNames,
  types.Params,
  types.ListCtx,
  types.Section
> = (subItems, _, allItems) =>
  lib.cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    randomId,
    { rename: "first" },
  );

const useRenderAddItem = lib.makeUseRenderAddItem<types.TypeNames, types.Params>(
  (args) => (
    <lib.AddFormItem
      {...args}
      label="+ Add item"
      render={renderAddFormItem}
    />
  ),
  () => MENU_ITEMS,
  randomId,
);

const renderCard = (
  view: ReactNode,
  viewProps: lib.ViewerProps<
    types.Params,
    types.Variants,
    types.TypeNames,
    CardExtra,
    types.ListCtx
  >,
) => {
  const { extra, ctx, formItem } = viewProps;
  return renderListCard(view, {
    focused: ctx.autoFocused(formItem.id),
    actions: extra.actions,
    parentDeleted: extra.parentDeleted,
    nested: extra.children.length > 0 ? extra.children : null,
    extra: extra.parentDeleted ? [] : extra.extra,
  });
};

const SectionComponent = lib.SectionFormItemHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Section,
  types.ListBaseCtx,
  types.ListExtra
>({
  viewers: listViewers,
  useRenderAddItem,
  renderTitle: (props) => props.section.header.title,
  renderEdit: lib.createColumnsEdit(columnsChrome),
});

const emptyListExtra = (): types.ListExtra =>
  lib.branded<types.ListExtra, "viewer-extra">({
    actions: {
      up: null,
      down: null,
      clone: null,
      remove: null,
      restore: null,
      isDeleted: false,
    },
    extra: [],
  });

export const FormItemEditorFormTest = ({
  flatItems,
  updateArgs,
  extra,
}: {
  flatItems: types.FlatItems;
  updateArgs: (patch: Partial<types.StoryArgs>) => void;
  extra: (item: types.ListItem) => types.ExtraAction[];
}) => {
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  const extras = lib.extrasByItemId(session.sections, (item) =>
    lib.branded<types.ListExtra, "viewer-extra">({
      actions: session.itemActions(item),
      extra: extra(item),
    }),
  );
  const itemExtra = (id: string): types.ListExtra =>
    extras.get(id) ?? emptyListExtra();
  const setAddItem = (
    sessionDraft: lib.FlatFormItemEditSession<types.TypeNames, types.Params>,
  ) =>
    updateArgs({
      flatItems: lib.applyFlatFormItem(
        flatItems,
        sessionDraft,
        { header: sessionDraft.draft.item, children: sessionDraft.children },
        sessionDraft.draft.n,
      ),
    });
  const toRemove = session.toRemove;
  return (
    <>
      {toRemove ? (
        <ConfirmBanner
          onConfirm={() => {
            toRemove.rm();
            session.setToRemove(null);
          }}
          onCancel={() => session.setToRemove(null)}
        >
          {pendingRemoveCopy(toRemove.item, (item) => item.params.name)}
        </ConfirmBanner>
      ) : null}
      <SectionsList>
        {session.sections.map((section, sIndex) => (
          <SectionComponent
            key={section.header.id}
            ctx={session.listCtx}
            variants={defaultVariants}
            itemExtra={itemExtra}
            renderCard={renderCard}
            args={session.args}
            clone={cloneFn}
            section={section}
            sIndex={sIndex}
            jump
            setAddItem={setAddItem}
          />
        ))}
      </SectionsList>
    </>
  );
};
