/**
 * All-in composition — school `CustomFormEditor` + `DialogsHOC` (`DialogUi`):
 * one `makeUseDialogs` instance orchestrates every dialog flow over the
 * multi-type list shell:
 * - row "Edit" → item edit session
 * - sidebar catalog → ambiguous insert (`-1/-1`, section picker when >1)
 * - in-slot "+ Add" (section & nested panel columns) → concrete-span insert
 * - section header "Edit" / sidebar "+ Add section" → section session
 */
import {
  FormItemEditor,
  itemName,
} from "../../form-item-editor/demo/FormItemEditorDemo";
import { FormItemEditorFormTest } from "../../form-item-editor/demo/formItemEditorDemoHelper";
import { SectionDialog } from "../../section-edit/demo/SectionEditDemo";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import {
  FormContainer,
  LayoutWithSidebar,
} from "../../side-menu/demo/sideMenuDemoHelper";
import type * as types from "./allInDemoTypes.t";
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
  (args) => <lib.AddFormItem {...args} />,
  () => MENU_ITEMS,
  randomId,
);

const useDialogs = lib.makeUseDialogs<
  types.TypeNames,
  types.Params,
  types.Ctx,
  types.Section
>({
  renderFormItem: ({
    ctx,
    session,
    add,
    setDraft,
    setSIndex,
    sectionOptions,
    commit,
    close,
  }) => (
    <FormItemEditor
      ctx={ctx}
      dialogArgs={lib.branded({
        title: (
          <>
            {session.total === 0 ? "Add" : "Edit"} ·{" "}
            {itemName(ctx, session.draft.item)}
          </>
        ),
        onCancel: close,
      })}
      formItem={session.draft}
      setFormItem={setDraft}
      extra={lib.branded<types.ItemExtra, "item-edit-extra">({
        onCommit: commit,
        /** The label is host business — this demo's `Section` has `title`. */
        sectionPicker: add
          ? {
              sIndex: session.sIndex,
              sections: sectionOptions.map(({ index, header }) => ({
                index,
                title: header.title,
              })),
              setSIndex,
            }
          : undefined,
      })}
    />
  ),
  renderSection: ({ session, add, commit, close }) => (
    <SectionDialog
      title={add ? "Add section" : undefined}
      draft={session.draft}
      onCancel={close}
      onSave={(form) =>
        commit(
          {
            ...session.draft.header,
            title: form.title,
            description: form.description,
          },
          form.cols,
        )
      }
    />
  ),
});

export const AllInEditor = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const ctx: types.Ctx = lib.branded({ flatItems });
  const dialogs = useDialogs({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    ctx,
  });
  const renderAdd = useRenderAddItem(dialogs.setItemSession);

  return (
    <FormContainer title={heading}>
      {dialogs.formItemDialog}
      {dialogs.sectionDialog}
      <FormItemEditorFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        itemName={(header) => itemName(ctx, header)}
        extra={(item) => [
          { label: "Edit", onClick: () => dialogs.openItemEdit(item) },
        ]}
        sectionExtra={(section) => [
          { label: "Edit", onClick: () => dialogs.openSectionEdit(section) },
        ]}
        renderAddItem={renderAdd}
        renderLayout={({ alert, details, sections }) => (
          <LayoutWithSidebar
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
                setAddFormItem={(item) => dialogs.openItemInsert(item)}
                setAddSection={dialogs.openSectionAdd}
              />
            }
          />
        )}
      />
    </FormContainer>
  );
};
