/**
 * Demo: per-column "+ Add item" dropdown (`AddFormItem`).
 *
 * Each column slot renders the dropdown via `makeUseRenderAddItem`; picking a
 * type opens the form-item-editor dialog with an insert session at that
 * slot's flat index (`getFlatInsertionIndex`, `total: 0`). Save commits via
 * `applyFlatFormItem` — the new item lands at the end of the clicked column.
 */
import { useCallback, useState } from "react";
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import { FormItemEditorFormTest } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import * as demo from "./editSectionDemoHelper";
import type * as types from "./editSectionDemoTypes.t";
import * as lib from "./library";

const useRenderAddItem = lib.makeUseRenderAddItem<
  types.TypeNames,
  types.Params
>(
  (args) => <lib.AddFormItem {...args} />,
  () => MENU_ITEMS,
  randomId,
);

export const EditSectionDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [session, setSession] = useState<types.EditingSession | null>(null);
  const ctx: types.Ctx = lib.branded({ flatItems });

  const commitDraft = useCallback(
    (next: lib.FlatFormItem<types.TypeNames, types.Params>) => {
      if (!session) return;
      updateArgs({
        flatItems: lib.applyFlatFormItem(
          flatItems,
          session,
          { header: next.item, children: session.children },
          next.n,
        ),
      });
      setSession(null);
    },
    [session, flatItems, updateArgs],
  );

  const renderAdd = useRenderAddItem(setSession);

  return (
    <demo.FormContainer title={heading}>
      {session && (
        <FormItemEditor
          ctx={ctx}
          dialogArgs={lib.branded({
            title: <>Add · {itemName(ctx, session.draft.item)}</>,
            onCancel: () => setSession(null),
          })}
          formItem={session.draft}
          setFormItem={(updater) =>
            setSession((prev) => {
              if (!prev) return prev;
              const nextDraft =
                typeof updater === "function" ? updater(prev.draft) : updater;
              return { ...prev, draft: nextDraft };
            })
          }
          extra={lib.branded<types.ItemExtra, "item-edit-extra">({
            onCommit: commitDraft,
          })}
        />
      )}
      <FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        itemName={(header) => itemName(ctx, header)}
        renderAddItem={({ sIndex, insertionIndex }) =>
          renderAdd({ index: insertionIndex, sIndex })
        }
      />
    </demo.FormContainer>
  );
};
