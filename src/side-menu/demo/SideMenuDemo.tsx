/**
 * Demo: library sidebar (`Side`) + in-slot add dropdown (`AddFormItem`).
 *
 * School `CustomFormEditor` composes both from the same `menuItems` catalog:
 * - `Side` — ambiguous insert (`index/sIndex: -1`) → section picker when needed
 * - `makeUseRenderAddItem` → injected at every list slot (section *and* nested
 *   panel columns) with a concrete span (no picker)
 *
 * "+ Add section" opens the section-edit dialog with an `index: -1` session.
 */
import { useCallback, useMemo, useState } from "react";
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import { FormItemEditorFormTest } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { SectionDialog } from "../../section-edit/demo/SectionEditDemo";
import { MENU_ITEMS, randomId } from "./fixtures";
import * as demo from "./sideMenuDemoHelper";
import type * as types from "./sideMenuDemoTypes.t";
import * as lib from "./library";

const blankSection = (id: string): types.Section => ({
  id,
  deleted: false,
  title: "",
  description: "",
});

const useRenderAddItem = lib.makeUseRenderAddItem<
  types.TypeNames,
  types.Params
>(
  (args) => <lib.AddFormItem {...args} render={demo.renderAddFormItem} />,
  () => MENU_ITEMS,
  randomId,
);

export const SideMenuDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [session, setSession] = useState<types.EditingSession | null>(null);
  const [sectionSession, setSectionSession] =
    useState<types.SectionSession | null>(null);
  const ctx: types.Ctx = lib.branded({ flatItems });
  const renderAdd = useRenderAddItem(setSession);

  /** School `sections.filter(d => !d.header.deleted).map(p => ({ value: p.index, label: p.header.title }))` — `index` is the section marker's flat index. */
  const sectionOptions = useMemo(
    () =>
      lib
        .consolidateSections(flatItems)
        .filter((section) => !section.header.deleted)
        .map((section) => ({
          index: section.meta.index,
          title: section.header.title,
        })),
    [flatItems],
  );

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
            /** Sidebar inserts (`index === -1`) need the picker; slot inserts already have a concrete span. */
            sectionPicker:
              session.index === -1
                ? {
                    sIndex: session.sIndex,
                    sections: sectionOptions,
                    setSIndex: (sIndex) =>
                      setSession((prev) => prev && { ...prev, sIndex }),
                  }
                : undefined,
          })}
        />
      )}
      {sectionSession && (
        <SectionDialog
          title="Add section"
          draft={sectionSession.draft}
          onCancel={() => setSectionSession(null)}
          onSave={(form) => {
            updateArgs({
              flatItems: lib.updateSectionInFlat(
                flatItems,
                sectionSession,
                {
                  ...sectionSession.draft.header,
                  title: form.title,
                  description: form.description,
                },
                form.cols,
              ),
            });
            setSectionSession(null);
          }}
        />
      )}
      <FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        itemName={(header) => itemName(ctx, header)}
        renderAddItem={renderAdd}
        renderLayout={({ alert, details, sections }) => (
          <demo.LayoutWithSidebar
            main={
              <>
                {alert}
                {details}
                {sections}
              </>
            }
            sidebar={
              <lib.Side<types.TypeNames, types.Params, types.Section>
                menuItems={MENU_ITEMS}
                random={randomId}
                blankSection={blankSection}
                render={demo.renderSide}
                renderMenuItem={demo.renderMenuItem}
                setAddFormItem={(item) =>
                  setSession(lib.openFormItemInsertSession(item))
                }
                setAddSection={(section) =>
                  setSectionSession({
                    draft: {
                      header: section.header,
                      cols: section.items.length,
                    },
                    items: section.items,
                    index: section.index,
                    total: section.total,
                  })
                }
              />
            }
          />
        )}
      />
    </demo.FormContainer>
  );
};
