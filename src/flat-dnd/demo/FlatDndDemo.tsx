/**
 * `flat-dnd` showcase — same composition as `section-view/Section view`
 * (`SectionFormItemHOC` + viewers + in-slot "+ Add"), but with
 * `renderEdit: WebRecursiveEdit` swapped in for `ColumnsEdit` — drag rows to
 * reorder within a column or into a nested panel column.
 */
import { ConfirmBanner } from "../../demo-utils";
import { pendingRemoveCopy } from "../../form-edit/demo/editFormDemoHelper";
import { renderAddFormItem } from "../../side-menu/demo/sideMenuDemoHelper";
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
  (args) => (
    <lib.AddFormItem
      {...args}
      label="+ Add item"
      render={renderAddFormItem}
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
  renderEdit: WebRecursiveEdit,
});

export const FlatDndTest = ({ flatItems, updateArgs, renderLayout }: types.ListProps) => {
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  const variants: types.Variants = lib.branded({});
  const extras = lib.extrasByItemId(session.sections, (item) =>
    lib.branded<types.ItemExtra, "viewer-extra">({
      actions: session.itemActions(item),
    }),
  );
  const itemExtra = (id: string): types.ItemExtra =>
    extras.get(id) ?? demo.emptyItemExtra();

  const setAddItem = (sessionDraft: lib.FlatFormItemEditSession<types.TypeNames, types.Params>) =>
    updateArgs({
      flatItems: lib.applyFlatFormItem(
        flatItems,
        sessionDraft,
        { header: sessionDraft.draft.item, children: sessionDraft.children },
        sessionDraft.draft.n,
      ),
    });

  const toRemove = session.toRemove;
  const list = (
    <>
      {toRemove ? (
        <ConfirmBanner
          onConfirm={() => {
            toRemove.rm();
            session.setToRemove(null);
          }}
          onCancel={() => session.setToRemove(null)}
        >
          {pendingRemoveCopy(
            toRemove.item,
            (item) => item.params.name,
          )}
        </ConfirmBanner>
      ) : null}
      <demo.SectionsList>
        {session.sections.map((section, sIndex) => (
          <SectionComponent
            key={section.header.id}
            ctx={session.listCtx}
            variants={variants}
            itemExtra={itemExtra}
            renderCard={demo.renderCard}
            args={session.args}
            clone={cloneFn}
            section={section}
            sIndex={sIndex}
            jump
            setAddItem={setAddItem}
          />
        ))}
      </demo.SectionsList>
    </>
  );

  if (renderLayout) return renderLayout({ list, toolbar: null });
  return list;
};

export const FlatDndDemo = ({ heading, flatItems, updateArgs }: types.DemoProps) => (
  <demo.FormContainer title={heading}>
    <FlatDndTest flatItems={flatItems} updateArgs={updateArgs} />
  </demo.FormContainer>
);
