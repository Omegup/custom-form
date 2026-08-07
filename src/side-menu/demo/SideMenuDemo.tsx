/**
 * Demo: library sidebar (`Side`) feeding the form-item-editor dialog.
 *
 * Catalog click → `createBlankFormItem` → `openFormItemInsertSession`
 * (`index/sIndex: -1` → end of first non-deleted section) → same editor
 * stack as the form-item-editor demo, decorated with `withSectionPicker` so
 * a form with more than one section asks which one to add into (school
 * `editors/selectSection.tsx`, shown only when `add && sections.length > 1`)
 * → Save commits via `applyFlatFormItem`. "+ Add section" opens the
 * section-edit dialog with an `index: -1` session; save appends via
 * `updateSectionInFlat`.
 */
import { useCallback, useMemo, useState } from "react";
import {
  FormItemEditorWithSectionPicker,
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

export const SideMenuDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [session, setSession] = useState<types.EditingSession | null>(null);
  const [sectionSession, setSectionSession] =
    useState<types.SectionSession | null>(null);
  const ctx: types.Ctx = lib.branded({ flatItems });

  /** School `sections.filter(d => !d.header.deleted).map(p => ({ value: p.index, label: p.header.title }))`. */
  const sectionOptions = useMemo(
    () =>
      lib
        .consolidateSections(flatItems)
        .map((section, index) => ({ index, section }))
        .filter(({ section }) => !section.header.deleted)
        .map(({ index, section }) => ({ index, title: section.header.title })),
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
        <FormItemEditorWithSectionPicker
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
            /** Every side-menu session is an insert (`index === -1`) — always offer the picker. */
            sectionPicker: {
              sIndex: session.sIndex,
              sections: sectionOptions,
              setSIndex: (sIndex) =>
                setSession((prev) => prev && { ...prev, sIndex }),
            },
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
