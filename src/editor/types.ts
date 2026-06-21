import type {
  ContextDom,
  GetActionsArgs,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  RecursiveTypedFormItem,
  SectionDom,
  SectionWithItems,
} from "./_deps";

export type EditFormItem<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
> = RecursiveFormItem<TypeNames, Params, Meta> | null;

export type SectionEditorProps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
  Meta extends MetaDom,
> = {
  actions: GetActionsArgs<TypeNames, Params, Ctx, SectionConfig>;
  sections: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    { section: { index: number; total: number } },
    Meta
  >[];
  setEditFormItem: (item: EditFormItem<TypeNames, Params, Meta>) => void;
  setEditSection: (
    section: SectionWithItems<
      TypeNames,
      Params,
      SectionConfig,
      { section: { index: number; total: number } },
      Meta
    > | null,
  ) => void;
};

export type ItemEditExtraApp<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  K extends TypeNames,
  SectionConfig extends SectionDom,
  Meta extends MetaDom,
> = import("../form-item-editor").ItemEditExtraDom & {
  editFormItem: RecursiveTypedFormItem<TypeNames, Params, K, Meta>;
  setEditFormItem: (
    item: RecursiveTypedFormItem<TypeNames, Params, K, Meta>,
    cols: number,
  ) => void;
  add: boolean;
  sections: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    { section: { index: number; total: number } },
    Meta
  >[];
};

export type ItemEditExtraApps<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  Meta extends MetaDom,
> = {
  [K in TypeNames]: ItemEditExtraApp<TypeNames, Params, K, SectionConfig, Meta>;
};

export type SectionEditDialogArgs<
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  section: { header: SectionConfig; cols: number };
  index: number;
  onSave: (section: { header: SectionConfig; cols: number }) => void;
  onClose: () => void;
  ctx: Ctx;
};
