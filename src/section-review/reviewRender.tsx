/**
 * Review slot walk — originals and answered follow-ups share one item
 * renderer; unanswered follow-ups are host-owned (`renderFormItemsEditor`).
 */
import { Fragment, type ReactNode } from "react";
import type {
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  VariantsDom,
} from "./_deps";
import { emptyResponse } from "./_deps";
import {
  followUpEntryAsItem,
  partitionFollowUpEntries,
} from "./followUpPartition";
import { withUnansweredFormItems } from "./reviewChanges";
import {
  renderReviewAddAction,
  renderReviewItemIcon,
  reviewViewerExtra,
} from "./reviewItemChrome";
import { isAnsweredResponse, reviewItemState } from "./reviewStatus";
import { usefulForReview, withIdSuffix } from "./reviewVisibleItems";
import type { ReviewChrome, ReviewLive, ReviewWalk } from "./reviewWalk.t";

const renderReviewItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  walk: ReviewWalk<TypeNames, Params, Variants>,
  item: RecursiveFormItem<TypeNames, Params, Meta>,
  index: number,
  parentDeleted: boolean,
  fromFollowUpTree: boolean,
): ReactNode => {
  const q = item.header;
  const { live, chrome } = walk;
  const state = reviewItemState({
    id: q.id,
    changes: live.changes,
    responses: live.responses,
    lastPending: live.lastPending,
    isAnswered: walk.isAnswered,
  });
  const appendix = renderReviewAppendix(walk, q.id);

  return chrome.renderItemShell({
    id: q.id,
    action: renderReviewAddAction(walk, q.id, state.designingFollowUps),
    children: live.renderFormItem({
      formItem: q,
      variant: live.variants[state.variant],
      extra: reviewViewerExtra({
        getChild: (suffix: string) => (
          <>
            {renderReviewSlots(
              walk,
              item.children,
              suffix,
              q.deleted || parentDeleted,
            )}
          </>
        ),
        parentDeleted,
        index,
        icon: renderReviewItemIcon(walk, {
          originId: q.id,
          unlocked: state.unlocked,
          fromFollowUpTree,
          designingFollowUps: state.designingFollowUps,
        }),
        appendix: appendix.length
          ? chrome.renderFormItemAppendix(appendix)
          : undefined,
        status: state.status,
        value: live.responses[q.id] ?? emptyResponse(),
      }),
    }),
  });
};

/** Remark card + answered follow-up items + unanswered host editor. */
const renderReviewAppendix = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
>(
  walk: ReviewWalk<TypeNames, Params, Variants>,
  originId: string,
): ReactNode[] => {
  const change = walk.live.changes[originId];
  if (!change) return [];

  const nodes: ReactNode[] = [];
  if (change.comment) {
    nodes.push(
      <Fragment key="comment">
        {walk.chrome.renderComment({
          text: change.comment,
          onEdit: () =>
            walk.live.setAddition({ originId, text: change.comment }),
        })}
      </Fragment>,
    );
  }

  const { answered, unanswered } = partitionFollowUpEntries(
    change.formItems ?? [],
    walk.isAnswered,
  );

  for (const entry of answered) {
    const followUp = followUpEntryAsItem(entry);
    if (!followUp) continue;
    nodes.push(
      <Fragment key={followUp.header.id}>
        {renderReviewItem(walk, followUp, 0, false, true)}
      </Fragment>,
    );
  }

  if (unanswered.length) {
    nodes.push(
      <Fragment key="form-items-editor">
        {walk.live.renderFormItemsEditor({
          entries: unanswered.map(({ entry }) => entry),
          setEntries: (nextUnanswered) =>
            walk.live.setChanges(
              withUnansweredFormItems(
                walk.live.changes,
                originId,
                nextUnanswered,
                walk.isAnswered,
              ),
            ),
        })}
      </Fragment>,
    );
  }

  return nodes;
};

const renderReviewSlots = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  walk: ReviewWalk<TypeNames, Params, Variants>,
  cols: RecursiveFormItem<TypeNames, Params, Meta>[][],
  idSuffix: string,
  deleted: boolean,
): ReactNode[] =>
  cols.map((items, col) => (
    <Fragment key={col}>
      {items
        .filter((item) => usefulForReview(item, walk.isAnswered))
        .map((item, index) => (
          <Fragment key={item.header.id + idSuffix}>
            {renderReviewItem(
              walk,
              withIdSuffix(item, idSuffix),
              index,
              deleted,
              false,
            )}
          </Fragment>
        ))}
    </Fragment>
  ));

export const renderReviewColumns = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  chrome: ReviewChrome<TypeNames, Params>,
  live: ReviewLive<TypeNames, Params, Variants>,
  slots: RecursiveFormItem<TypeNames, Params, Meta>[][],
  parentDeleted: boolean,
): ReactNode[] =>
  renderReviewSlots(
    {
      chrome,
      live,
      isAnswered: (id) => isAnsweredResponse(live.responses, id),
    },
    slots,
    "",
    parentDeleted,
  );
