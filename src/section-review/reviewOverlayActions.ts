/**
 * Overlay submit — host-owned dialog writes into `AdditionalChanges`.
 * Not mounted by `SectionReviewHOC`; the call site wires chrome + these actions.
 */
import type { MetaDom, ParamsDom, RecursiveFormItem, SIndexed, SomeFormItem } from "./_deps";
import {
  withComment,
  withFormItemEntry,
  withoutComment,
} from "./reviewChanges";
import type {
  Addition,
  AdditionalChanges,
  ReviewOverlayArgs,
} from "./types";

export const reviewOverlayActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(args: {
  addition: Addition<TypeNames, Params> | null;
  deleteCommentId: string | null;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  setAddition: (addition: Addition<TypeNames, Params> | null) => void;
  setDeleteCommentId: (id: string | null) => void;
  lastPending: Date | null;
}): Omit<ReviewOverlayArgs<TypeNames, Params>, "tCommon"> => {
  const {
    addition,
    deleteCommentId,
    changes,
    setChanges,
    setAddition,
    setDeleteCommentId,
    lastPending,
  } = args;

  return {
    addition,
    deleteCommentId,
    setAddition,
    clearDelete: () => setDeleteCommentId(null),
    onSubmitComment: (text: string) => {
      if (!addition || addition.mode !== "comment") return;
      setChanges(withComment(changes, addition.originId, text));
      setAddition(null);
    },
    onConfirmDeleteComment: () => {
      if (!deleteCommentId) return;
      setChanges(withoutComment(changes, deleteCommentId));
      setDeleteCommentId(null);
    },
    onSubmitFormItem: (payload: {
      comment?: string;
      formItem?: SomeFormItem<TypeNames, Params>;
      children?: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
    }) => {
      if (!addition || addition.mode !== "formItem") return;
      setChanges(
        withFormItemEntry(
          changes,
          addition.originId,
          { ...payload, date: lastPending },
          addition.replace != null ? addition.replace.index : null,
        ),
      );
      setAddition(null);
    },
  };
};
