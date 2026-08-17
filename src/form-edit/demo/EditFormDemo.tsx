import { useState } from "react";
import { ConfirmBanner, DemoPage, ShowDeleted } from "../../demo-utils";
import * as demo from "./editFormDemoHelper";
import * as types from "./editFormDemoTypes.t";
import * as lib from "./library";

const cloneFn: types.DemoClone = (subItems, _, allItems) =>
  lib.cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    () => `id_${Math.random().toString(36).slice(2, 7)}`,
    { rename: "first" },
  );

export const EditFormTest = ({
  flatItems,
  updateArgs,
  extra,
  sectionExtra,
  renderAddItem,
  renderLayout,
}: types.EditFormTestProps) => {
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  // Visibility only — school always jumps deleted neighbors when moving
  // (action.utils `isDeleted`), so active items never land in a deleted section.
  const [showDeleted, setShowDeleted] = useState(true);
  const toRemove = session.toRemove;

  const alert = toRemove && (
    <ConfirmBanner
      onConfirm={() => {
        toRemove.rm();
        session.setToRemove(null);
      }}
      onCancel={() => session.setToRemove(null)}
    >
      {demo.pendingRemoveCopy(toRemove.item, (item) => item.params.name)}
    </ConfirmBanner>
  );
  const details = (
    <ShowDeleted checked={showDeleted} onChange={setShowDeleted} />
  );
  const sectionsNode = (
    <demo.SectionsList>
      {session.sections.map((section, sIndex) => {
        if (section.header.deleted && !showDeleted) return null;
        const sectionFocused = session.listCtx.autoFocused(section.header.id);
        const sActions = lib.getSectionMoveActions(
          session.args,
          cloneFn,
          section,
          true,
        );
        const sectionDeleted = section.header.deleted;
        return (
          <demo.SectionPanel
            key={section.header.id}
            title={section.header.title}
            focused={sectionFocused}
            sectionActions={sActions}
            sectionExtra={sectionDeleted ? [] : sectionExtra?.(section) ?? []}
            headerExtra={null}
            columns={section.items.map((column, colIndex) => (
              <>
                {column.map((item) => {
                  if (item.header.deleted && !showDeleted) return null;
                  const actions = session.itemActions(item);
                  const fieldFocused = session.listCtx.autoFocused(
                    item.header.id,
                  );
                  return (
                    <demo.FieldRow
                      key={item.header.id}
                      name={item.header.params.name}
                      focused={fieldFocused}
                      actions={actions}
                      extra={sectionDeleted ? [] : extra?.(item) ?? []}
                      parentDeleted={sectionDeleted}
                    />
                  );
                })}
                {!sectionDeleted &&
                  renderAddItem?.({
                    index: lib.getFlatInsertionIndex(
                      section.meta.index,
                      section.items,
                      colIndex,
                    ),
                    sIndex,
                  })}
              </>
            ))}
          />
        );
      })}
    </demo.SectionsList>
  );

  if (!renderLayout)
    return (
      <>
        {alert}
        {details}
        {sectionsNode}
      </>
    );
  return renderLayout({
    alert,
    details,
    sections: sectionsNode,
    setFlatItems: (update) =>
      updateArgs({
        flatItems: typeof update === "function" ? update(flatItems) : update,
      }),
    focus: (id) => session.setFocused({ id, value: true }),
  });
};

export const EditFormDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => (
  <DemoPage title={heading}>
    <EditFormTest flatItems={flatItems} updateArgs={updateArgs} />
  </DemoPage>
);
