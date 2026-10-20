import type { ReactNode } from "react";
import type { ParamsDom, VariantsDom } from "./_deps";
import { withFormItemEntry } from "./reviewChanges";
import type { ReviewLive, ReviewWalk } from "./reviewWalk.t";
import type { ReviewFollowUpPick } from "./types";

export const appendFollowUp = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
>(
  live: ReviewLive<TypeNames, Params, Variants>,
  originId: string,
  payload: ReviewFollowUpPick<TypeNames, Params>,
) =>
  live.setChanges(
    withFormItemEntry(
      live.changes,
      originId,
      { ...payload, date: live.lastPending },
      null,
    ),
  );

export const openUnlockOrDelete = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
>(
  live: ReviewLive<TypeNames, Params, Variants>,
  originId: string,
  unlocked: boolean,
) => {
  if (unlocked) live.setDeleteCommentId(originId);
  else live.setAddition({ originId, text: null });
};

/** Hide +Follow-up while the host editor is already open under this item. */
export const renderReviewAddAction = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
>(
  walk: ReviewWalk<TypeNames, Params, Variants>,
  originId: string,
  designingFollowUps: boolean,
): ReactNode =>
  designingFollowUps
    ? null
    : walk.chrome.renderAddFollowUp({
        originId,
        onPick: (payload) => appendFollowUp(walk.live, originId, payload),
      });

/** ✚ on settled answered follow-ups; lock/unlock always. */
export const renderReviewItemIcon = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
>(
  walk: ReviewWalk<TypeNames, Params, Variants>,
  args: {
    originId: string;
    unlocked: boolean;
    fromFollowUpTree: boolean;
    designingFollowUps: boolean;
  },
): ReactNode => {
  const showMark =
    args.fromFollowUpTree && !args.unlocked && !args.designingFollowUps;
  return (
    <>
      {showMark ? walk.chrome.renderFollowUpMark() : null}
      {walk.chrome.renderActionIcon(args.unlocked ? "unlock" : "lock", () =>
        openUnlockOrDelete(walk.live, args.originId, args.unlocked),
      )}
    </>
  );
};
