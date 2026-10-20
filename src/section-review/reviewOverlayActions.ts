/**
 * Overlay submit — host-owned dialog writes into `AdditionalChanges`.
 * Not mounted by `SectionReviewHOC`; the call site wires chrome + these actions.
 */
import type { ParamsDom } from "./_deps";
import { withComment, withoutComment } from "./reviewChanges";
import type {
  Addition,
  AdditionalChanges,
  ReviewOverlayActions,
} from "./types";

export const reviewOverlayActions = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(args: {
  addition: Addition | null;
  deleteCommentId: string | null;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  setAddition: (addition: Addition | null) => void;
  setDeleteCommentId: (id: string | null) => void;
}): ReviewOverlayActions => {
  const {
    addition,
    deleteCommentId,
    changes,
    setChanges,
    setAddition,
    setDeleteCommentId,
  } = args;

  return {
    addition,
    deleteCommentId,
    setAddition,
    clearDelete: () => setDeleteCommentId(null),
    onSubmitComment: (text: string) => {
      if (!addition) return;
      setChanges(withComment(changes, addition.originId, text));
      setAddition(null);
    },
    onConfirmDeleteComment: () => {
      if (!deleteCommentId) return;
      setChanges(withoutComment(changes, deleteCommentId));
      setDeleteCommentId(null);
    },
  };
};
