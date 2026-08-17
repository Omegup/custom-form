/**
 * `section-view` showcase — composes `SectionFormItemHOC` (`ColumnsEdit` +
 * viewers + in-slot "+ Add") into a multi-section, multi-type list, proving
 * the library handles nested panel columns and add-item slots without any
 * FlatDnd/drag-and-drop.
 *
 * Item add commits immediately via `applyFlatFormItem` — this story's job is
 * `section-view` composition, not a second `form-item-editor`/`form-dialogs`.
 */
import { ConfirmBanner } from "../../demo-utils";
import * as sideMenu from "../../side-menu/demo/sideMenuDemoHelper";
import { pendingRemoveCopy } from "../../form-edit/demo/editFormDemoHelper";
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

  if (renderLayout) return renderLayout({ list, sidebar: null });
  return list;
};

export const SectionViewDemo = ({ heading, flatItems, updateArgs }: types.DemoProps) => (
  <demo.FormContainer title={heading}>
    <SectionViewTest flatItems={flatItems} updateArgs={updateArgs} />
  </demo.FormContainer>
);
