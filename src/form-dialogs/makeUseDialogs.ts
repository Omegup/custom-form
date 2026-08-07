/**
 * Dialog orchestrator — port of school form-edit-react `makeUseDialogs`
 * (`useDialog.tsx`), pure-mutation parts already extracted to
 * `form-edit/applyFlatFormItem` and `section-edit/updateSectionInFlat`.
 *
 * The factory takes render callbacks (school's `renderSection` /
 * `renderDelete` seam, extended to the item dialog since `FormItemEdit` is
 * already built by `form-item-editor` in this repo); the hook owns the two
 * sessions and the commit wiring. Delete confirmation stays with the list
 * shell (`setToRemove` in `form-edit` demos) — not orchestrated here.
 */
import { useCallback, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import type {
  ContextDom,
  FlatFormItem,
  FlatFormItemEditSession,
  FlatFormItems,
  FlatSectionEditSession,
  Indexed,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  SIndexed,
  SomeFormItem,
} from "./_deps";
import {
  applyFlatFormItem,
  consolidateSections,
  openFormItemEditSession,
  openFormItemInsertSession,
  openSectionEditSession,
  updateSectionInFlat,
} from "./_deps";

/**
 * Live section an ambiguous insert can target — school `selectSection`
 * option (`value: p.index`, the section marker's **flat** index). The label
 * is host business: `SectionDom` guarantees no display fields, so the whole
 * header is exposed instead of a hardcoded `title`.
 */
export type SectionOption<SectionConfig extends SectionDom> = {
  index: number;
  header: SectionConfig;
};

/** Args handed to `renderFormItem` — everything the item dialog needs. */
export type ItemDialogArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  ctx: Ctx;
  session: FlatFormItemEditSession<TypeNames, Params>;
  /**
   * School `add: editFormItem.index === -1` — sidebar insert with no target
   * section yet, so the dialog should offer the section picker. Slot inserts
   * and edits carry a concrete span (`index !== -1`) and never show it.
   */
  add: boolean;
  setDraft: Dispatch<SetStateAction<FlatFormItem<TypeNames, Params>>>;
  /** Retarget an ambiguous insert (`sectionOptions[n].index`). */
  setSIndex: (sIndex: number) => void;
  sectionOptions: SectionOption<SectionConfig>[];
  /** Validated draft → `applyFlatFormItem` + close. */
  commit: (next: FlatFormItem<TypeNames, Params>) => void;
  close: () => void;
};

/** Args handed to `renderSection` — everything the section dialog needs. */
export type SectionDialogArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = {
  session: FlatSectionEditSession<TypeNames, Params, SectionConfig>;
  /** `index === -1` — "+ Add section" (append) instead of editing a span. */
  add: boolean;
  /** Edited header + column count → `updateSectionInFlat` + close. */
  commit: (header: SectionConfig, cols: number) => void;
  close: () => void;
};

export const makeUseDialogs =
  <
    TypeNames extends string,
    Params extends ParamsDom<TypeNames>,
    Ctx extends ContextDom,
    SectionConfig extends SectionDom,
  >(args: {
    renderFormItem: (
      dialog: ItemDialogArgs<TypeNames, Params, Ctx, SectionConfig>,
    ) => ReactNode;
    renderSection: (
      dialog: SectionDialogArgs<TypeNames, Params, SectionConfig>,
    ) => ReactNode;
  }) =>
  ({
    flatItems,
    setFlatItems,
    ctx,
  }: {
    flatItems: FlatFormItems<TypeNames, Params, SectionConfig>;
    setFlatItems: (
      items: FlatFormItems<TypeNames, Params, SectionConfig>,
    ) => void;
    ctx: Ctx;
  }) => {
    const { renderFormItem, renderSection } = args;
    const [itemSession, setItemSession] = useState<FlatFormItemEditSession<
      TypeNames,
      Params
    > | null>(null);
    const [sectionSession, setSectionSession] =
      useState<FlatSectionEditSession<TypeNames, Params, SectionConfig> | null>(
        null,
      );

    const sectionOptions = useMemo(
      () =>
        consolidateSections(flatItems)
          .filter((section) => !section.header.deleted)
          .map((section) => ({
            index: section.meta.index,
            header: section.header,
          })),
      [flatItems],
    );

    const commitItem = useCallback(
      (next: FlatFormItem<TypeNames, Params>) => {
        if (!itemSession) return;
        setFlatItems(
          applyFlatFormItem(
            flatItems,
            itemSession,
            { header: next.item, children: itemSession.children },
            next.n,
          ),
        );
        setItemSession(null);
      },
      [itemSession, flatItems, setFlatItems],
    );

    const commitSection = useCallback(
      (header: SectionConfig, cols: number) => {
        if (!sectionSession) return;
        setFlatItems(
          updateSectionInFlat(flatItems, sectionSession, header, cols),
        );
        setSectionSession(null);
      },
      [sectionSession, flatItems, setFlatItems],
    );

    return {
      /** Row "Edit" — consolidated item → edit session. */
      openItemEdit: (
        item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>,
      ) => setItemSession(openFormItemEditSession(item)),
      /**
       * New item (sidebar `NewFormItem` or any `{ header, children }`).
       * Omit `span` for the ambiguous sidebar insert (`-1/-1` → picker);
       * slot inserts pass their concrete `{ index, sIndex }`.
       */
      openItemInsert: (
        item: {
          header: SomeFormItem<TypeNames, Params>;
          children: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
        },
        span?: { index: number; sIndex: number },
      ) => setItemSession(openFormItemInsertSession(item, span)),
      /** Raw session setter — plug into `makeUseRenderAddItem(setItemSession)`. */
      setItemSession,
      /** Section header "Edit" — consolidated section → edit session. */
      openSectionEdit: (
        section: SectionWithItems<
          TypeNames,
          Params,
          SectionConfig,
          SectionMetaDom<Indexed>,
          MetaDom<SIndexed>
        >,
      ) => setSectionSession(openSectionEditSession(section)),
      /** "+ Add section" — `useSide.addSection`'s `NewSection` shape (`index: -1`). */
      openSectionAdd: (section: {
        header: SectionConfig;
        index: number;
        total: number;
        items: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
      }) =>
        setSectionSession({
          draft: { header: section.header, cols: section.items.length },
          items: section.items,
          index: section.index,
          total: section.total,
        }),
      sectionOptions,
      formItemDialog:
        itemSession &&
        renderFormItem({
          ctx,
          session: itemSession,
          add: itemSession.index === -1,
          setDraft: (updater) =>
            setItemSession(
              (prev) =>
                prev && {
                  ...prev,
                  draft:
                    typeof updater === "function"
                      ? updater(prev.draft)
                      : updater,
                },
            ),
          setSIndex: (sIndex) =>
            setItemSession((prev) => prev && { ...prev, sIndex }),
          sectionOptions,
          commit: commitItem,
          close: () => setItemSession(null),
        }),
      sectionDialog:
        sectionSession &&
        renderSection({
          session: sectionSession,
          add: sectionSession.index === -1,
          commit: commitSection,
          close: () => setSectionSession(null),
        }),
    };
  };
