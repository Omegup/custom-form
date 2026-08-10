/**
 * `flat-dnd` showcase — same composition as `section-view/Section view`
 * (`SectionFormItemHOC` + viewers + in-slot "+ Add"), but with
 * `renderEdit: WebRecursiveEdit` swapped in for `ColumnsEdit` — drag rows to
 * reorder within a column, across sections, or into a nested panel column.
 */
import { useMemo, useState } from "react";
import * as demo from "./flatDndDemoHelper";
import * as types from "./flatDndDemoTypes.t";
import { WebRecursiveEdit } from "./WebRecursiveEdit";
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
  (args) => <lib.AddFormItem {...args} />,
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
  renderTitle: (props) => <strong>{props.section.header.title}</strong>,
  renderEdit: WebRecursiveEdit,
});

export const FlatDndTest = ({ flatItems, updateArgs, renderLayout }: types.ListProps) => {
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);

  const ctx = useMemo(
    () => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused),
    [focused],
  );
  const variants = useMemo(
    (): types.Variants => lib.branded({ field: "default", panel: "default" }),
    [],
  );

  const setItems = (items: types.FlatItems, newCtx: typeof ctx) => {
    if (items !== flatItems) updateArgs({ flatItems: items });
    setFocused(newCtx.focused);
  };

  const sections = useMemo(() => lib.consolidateSections(flatItems), [flatItems]);
  const sectionOfItem = useMemo(() => lib.buildItemSectionDict(flatItems), [flatItems]);

  const jump = true;
  const args = {
    items: flatItems,
    setItems,
    ctx,
    sectionOfItem,
    setToRemove: () => {},
  };
  const itemActions = lib.getFormItemMoveActions(args, cloneFn, jump);

  const renameItem = (id: string, value: string) =>
    setItems(
      flatItems.map((entry) =>
        "item" in entry && entry.item.id === id
          ? { ...entry, item: { ...entry.item, params: { ...entry.item.params, name: value } } }
          : entry,
      ),
      ctx,
    );

  const itemExtraMap = demo.buildItemExtraMap(sections, itemActions, renameItem);
  const itemExtra = (id: string): types.ItemExtra =>
    itemExtraMap.get(id) ??
    lib.branded<types.ItemExtra, "viewer-extra">({
      value: "",
      onChange: () => {},
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
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
    </div>
  );

  if (renderLayout) return renderLayout({ list, toolbar: null });
  return list;
};

export const FlatDndDemo = ({ heading, flatItems, updateArgs }: types.DemoProps) => (
  <demo.FormContainer title={heading}>
    <FlatDndTest flatItems={flatItems} updateArgs={updateArgs} />
  </demo.FormContainer>
);
