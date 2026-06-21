/**
 * Dialog orchestrator — delete, form-item, and section dialogs.
 * Ported from school form-edit-react/useDialog.tsx (makeUseDialogs).
 */
import { applyFlatFormItem } from "./applyFlatFormItem";
import { saveSectionInFlat } from "./saveSectionInFlat";
import type { ReactNode, RefObject } from "./_deps";
import type {
  ContextDom,
  DialogArgsDom,
  Editors,
  ItemEditStateDom,
  ParamsDom,
  RecursiveFormItem,
  RecursiveTypedFormItem,
  SectionDom,
  SetAutoFocus,
  UseFormItemEditor,
} from "./_deps";
import type { FormItemEditorValidate } from "../form-item-editor";
import { createFormItemEditorWrapper } from "./_deps";
import type {
  EditFormItem,
  ItemEditExtraApps,
  SectionEditDialogArgs,
  SectionEditorProps,
} from "./types";

type EditorStateWithImpRef<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  State extends Record<TypeNames, ItemEditStateDom>,
> = {
  [K in TypeNames]: State[K] & {
    impRef: RefObject<FormItemEditorValidate<Params, K> | null>;
  };
};

export type {
  EditFormItem,
  ItemEditExtraApp,
  ItemEditExtraApps,
  SectionEditDialogArgs,
  SectionEditorProps,
} from "./types";

export const makeUseDialogs = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom & { title: string; description: string },
  DialogArgs extends DialogArgsDom,
  State extends Record<TypeNames, ItemEditStateDom>,
  Meta extends import("./_deps").MetaDom<{ index: number; total?: number; sIndex?: number }>,
>(args: {
  editors: Editors<
    TypeNames,
    Params,
    SetAutoFocus<Ctx>,
    DialogArgs & { onClose: () => void },
    ItemEditExtraApps<TypeNames, Params, SectionConfig, Meta>,
    EditorStateWithImpRef<TypeNames, Params, State>
  >;
  useFormItemEditor: UseFormItemEditor<
    TypeNames,
    Params,
    SetAutoFocus<Ctx>,
    DialogArgs & { onClose: () => void },
    ItemEditExtraApps<TypeNames, Params, SectionConfig, Meta>,
    State
  >;
  renderDialog: <K extends TypeNames>(
    extra: DialogArgs & { onClose: () => void },
    state: State[K],
    children: ReactNode,
  ) => ReactNode;
}) => {
  const { editors, useFormItemEditor, renderDialog } = args;
  const FormItemEdit = createFormItemEditorWrapper<
    TypeNames,
    Params,
    SetAutoFocus<Ctx>,
    DialogArgs & { onClose: () => void },
    ItemEditExtraApps<TypeNames, Params, SectionConfig, Meta>,
    State
  >(editors, useFormItemEditor, renderDialog);

  return (props: {
    editFormItem: EditFormItem<TypeNames, Params, Meta>;
    editSection: import("./_deps").SectionWithItems<
      TypeNames,
      Params,
      SectionConfig,
      { section: { index: number; total: number } },
      Meta
    > | null;
    ctx: SetAutoFocus<Ctx>;
    toRemove: { rm: () => void } | null;
    editor: SectionEditorProps<TypeNames, Params, SetAutoFocus<Ctx>, SectionConfig, Meta>;
    renderDelete: (
      args: Record<"handleClose" | "handleConfirm", () => void>,
    ) => ReactNode;
    renderSection: (
      args: SectionEditDialogArgs<SetAutoFocus<Ctx>, SectionConfig>,
    ) => ReactNode;
    dialogArgs: DialogArgs;
  }) => {
    const {
      toRemove,
      editFormItem,
      editSection,
      ctx,
      editor,
      renderDelete,
      dialogArgs,
      renderSection,
    } = props;
    const { actions, sections, setEditFormItem, setEditSection } = editor;
    const { setToRemove, setItems, items: formItems } = actions;
    const closeEditForm = () => setEditFormItem(null);

    const setEditFormItemX = <K extends TypeNames>(
      editing: RecursiveFormItem<TypeNames, Params, Meta>,
      item: RecursiveTypedFormItem<TypeNames, Params, K, Meta>,
      cols: number,
    ) => {
      setItems(
        applyFlatFormItem(formItems, editing, item, cols),
        (editing.meta.total ? ctx : ctx.setAutoFocus(item.header.id)) as SetAutoFocus<Ctx>,
      );
    };

    const deleteDialog =
      toRemove &&
      renderDelete({
        handleClose: () => setToRemove(null),
        handleConfirm: toRemove.rm,
      });

    const formItemDialog = editFormItem && (
      <FormItemEdit
        {...({
          dialogArgs: { ...dialogArgs, onClose: closeEditForm },
          ctx,
          extra: {
            editFormItem,
            setEditFormItem: (
              item: RecursiveTypedFormItem<TypeNames, Params, TypeNames, Meta>,
              cols: number,
            ) => setEditFormItemX(editFormItem, item, cols),
            add: editFormItem.meta.index === -1,
            sections,
          },
        } as Parameters<typeof FormItemEdit>[0])}
      />
    );

    const sectionDialog =
      editSection &&
      renderSection({
        ctx,
        onClose: () => setEditSection(null),
        index: editSection.meta.index,
        section: {
          header: editSection.header,
          cols: editSection.items.length,
        },
        onSave: ({ header: sectionHeader, cols }) => {
          setItems(
            saveSectionInFlat(formItems, editSection, {
              header: sectionHeader,
              cols,
            }),
            ctx.setAutoFocus(sectionHeader.id) as SetAutoFocus<Ctx>,
          );
          setEditSection(null);
        },
      });

    return { deleteDialog, formItemDialog, sectionDialog };
  };
};
