/**
 * `section-view` showcase — composes `SectionFormItemHOC` (`ColumnsEdit` +
 * viewers + in-slot "+ Add") into a multi-section, multi-type list, proving
 * the library handles nested panel columns and add-item slots without any
 * FlatDnd/drag-and-drop.
 *
 * Item add commits immediately via `applyFlatFormItem` — this story's job is
 * `section-view` composition, not a second `form-item-editor`/`form-dialogs`.
 */
import { useMemo, useState } from "react";
import * as sideMenu from "../../side-menu/demo/sideMenuDemoHelper";
import * as demo from "./sectionViewDemoHelper";
import * as types from "./sectionViewDemoTypes.t";
import * as lib from "./library";

const cloneFn: lib.Clone<types.TypeNames, types.Params, types.Ctx, types.Section> = (
  subItems,
  _,
  allItems,
) =>
  lib.cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    demo.randomId,
    { rename: "first" },
  );

const useRenderAddItem = lib.makeUseRenderAddItem<types.TypeNames, types.Params>(
  (args) => (
    <lib.AddFormItem
      {...args}
      label="+ Add item"
      render={sideMenu.renderAddFormItem}
    />
  ),
  () => demo.MENU_ITEMS,
  demo.randomId,
);

const SectionComponent = lib.SectionFormItemHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Section,
  types.BaseCtx,
  types.ItemExtra
>({
  viewers: demo.viewers,
  useRenderAddItem,
  renderTitle: (props) => props.section.header.title,
  renderEdit: lib.createColumnsEdit(demo.columnsChrome),
});

export const SectionViewTest = ({
  flatItems,
  updateArgs,
  renderLayout,
}: types.ListProps) => {
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);

  const ctx = useMemo(
    () => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused),
    [focused],
  );
  const variants = useMemo(
    (): types.Variants => lib.branded({}),
    [],
  );

  const setItems = (items: types.FlatItems, newCtx: typeof ctx) => {
    if (items !== flatItems) updateArgs({ flatItems: items });
    setFocused(newCtx.focused);
  };

  const sections = useMemo(() => lib.consolidateSections(flatItems), [flatItems]);
  const sectionOfItem = useMemo(() => lib.buildItemSectionDict(flatItems), [flatItems]);

  const jump = true;
  const args: lib.GetActionsArgs<types.TypeNames, types.Params, types.Ctx, types.Section> = {
    items: flatItems,
    setItems,
    ctx,
    sectionOfItem,
    setToRemove: (pending) => pending?.rm(),
  };
  const itemActions = lib.getFormItemMoveActions(args, cloneFn, jump);

  const itemExtraMap = demo.buildItemExtraMap(sections, itemActions);
  const itemExtra = (id: string): types.ItemExtra =>
    itemExtraMap.get(id) ??
    lib.branded<types.ItemExtra, "viewer-extra">({
      actions: {
        up: null,
        down: null,
        clone: null,
        remove: null,
        restore: null,
        isDeleted: false,
      },
    });

  const setAddItem = (session: lib.FlatFormItemEditSession<types.TypeNames, types.Params>) =>
    updateArgs({
      flatItems: lib.applyFlatFormItem(
        flatItems,
        session,
        { header: session.draft.item, children: session.children },
        session.draft.n,
      ),
    });

  const list = (
    <demo.SectionsList>
      {sections.map((section, sIndex) => (
        <SectionComponent
          key={section.header.id}
          ctx={ctx}
          variants={variants}
          itemExtra={itemExtra}
          renderCard={demo.renderCard}
          args={args}
          clone={cloneFn}
          section={section}
          sIndex={sIndex}
          jump={jump}
          setAddItem={setAddItem}
        />
      ))}
    </demo.SectionsList>
  );

  if (renderLayout) return renderLayout({ list, sidebar: null });
  return list;
};

export const SectionViewDemo = ({ heading, flatItems, updateArgs }: types.DemoProps) => (
  <demo.FormContainer title={heading}>
    <SectionViewTest flatItems={flatItems} updateArgs={updateArgs} />
  </demo.FormContainer>
);
