import { useMemo, useState } from "react";
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
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);
  const [toRemove, setToRemove] = useState<types.PendingRemove | null>(null);

  const ctx = useMemo(() => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused), [focused]);

  const applyItems = (newItems: types.FlatItems, newCtx: typeof ctx) => {
    if (newItems !== flatItems) updateArgs({ flatItems: newItems });
    setFocused(newCtx.focused);
  };

  const sections = useMemo(
    () => lib.consolidateSections(flatItems),
    [flatItems],
  );

  // Visibility only — school always jumps deleted neighbors when moving
  // (action.utils `isDeleted`), so active items never land in a deleted section.
  const [showDeleted, setShowDeleted] = useState(true);
  const jump = true;

  const sectionOfItem = useMemo(
    () => lib.buildItemSectionDict(flatItems),
    [flatItems],
  );

  const actionsArgs = {
    items: flatItems,
    setItems: applyItems,
    ctx,
    sectionOfItem,
    setToRemove,
  };

  const itemActions = lib.getFormItemMoveActions(actionsArgs, cloneFn, jump);

  const alert = toRemove && (
    <demo.RemoveAlert
      pending={toRemove}
      onConfirm={() => {
        toRemove.rm();
        setToRemove(null);
      }}
      onCancel={() => setToRemove(null)}
    />
  );
  const details = (
    <button onClick={() => setShowDeleted(!showDeleted)}>
      {showDeleted ? "Hide deleted" : "Show deleted"}
    </button>
  );
  const sectionsNode = (
    <demo.SectionsList>
      {sections.map((section, sIndex) => {
        if (section.header.deleted && !showDeleted) return null;
        const sectionFocused = ctx.autoFocused(section.header.id);
        const sActions = lib.getSectionMoveActions(
          actionsArgs,
          cloneFn,
          section,
          jump,
        );
        const sectionDeleted = section.header.deleted;
        return (
          <demo.SectionPanel
            key={section.header.id}
            title={section.header.title}
            focused={sectionFocused}
            sectionActions={sActions}
            sectionExtra={sectionDeleted ? [] : sectionExtra?.(section) ?? []}
            columns={section.items.map((column, colIndex) => (
              <>
                {column.map((item) => {
                  if (item.header.deleted && !showDeleted) return null;
                  const actions = itemActions(item);
                  const fieldFocused = ctx.autoFocused(item.header.id);
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
                    section,
                    sIndex,
                    colIndex,
                    insertionIndex: lib.getFlatInsertionIndex(
                      section.meta.index,
                      section.items,
                      colIndex,
                    ),
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
    focus: (id) => setFocused({ id, value: true }),
  });
};

export const EditFormDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => (
  <demo.FormContainer title={heading}>
    <EditFormTest flatItems={flatItems} updateArgs={updateArgs} />
  </demo.FormContainer>
);
