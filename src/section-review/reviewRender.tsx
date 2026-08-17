/**
 * Review slot walk — originals and answered follow-ups share one item
 * renderer; unanswered follow-ups are host-owned (`renderFormItemsEditor`).
 */
import { Fragment, type ReactNode } from "react";
import type {
  ExtraDom,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  Response,
  SomeFormItem,
  VariantsDom,
} from "./_deps";
import { branded, emptyResponse } from "./_deps";
import {
  followUpEntryAsItem,
  partitionFollowUpEntries,
} from "./followUpPartition";
import { withFormItemEntry, withUnansweredFormItems } from "./reviewChanges";
import { isAnsweredResponse, reviewItemState } from "./reviewStatus";
import type {
  AdditionalChanges,
  Addition,
  ReviewExtra,
  ReviewFormItemsEditorArgs,
  ReviewVariantState,
  SectionReviewChrome,
} from "./types";

type ReviewChrome<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = Pick<
  SectionReviewChrome<TypeNames, Params>,
  | "renderItemShell"
  | "renderComment"
  | "renderFormItemAppendix"
  | "renderAddFollowUp"
  | "renderActionIcon"
  | "renderFollowUpMark"
>;

type ReviewItemExtra = ExtraDom &
  ReviewExtra & {
    getChild: (suffix: string) => ReactNode;
    impRef: null;
  };

type ReviewLive<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
> = {
  responses: Record<string, Response>;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  setAddition: (addition: Addition | null) => void;
  setDeleteCommentId: (id: string | null) => void;
  lastPending: Date | null;
  variants: Record<ReviewVariantState, Variants>;
  renderFormItemsEditor: (
    args: ReviewFormItemsEditorArgs<TypeNames, Params>,
  ) => ReactNode;
  renderFormItem: (args: {
    formItem: SomeFormItem<TypeNames, Params>;
    variant: Variants;
    extra: ReviewItemExtra;
  }) => ReactNode;
};

const withIdSuffix = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Meta extends MetaDom,
>(
  item: RecursiveFormItem<TypeNames, Params, Meta>,
  idSuffix: string,
): RecursiveFormItem<TypeNames, Params, Meta> =>
  idSuffix
    ? { ...item, header: { ...item.header, id: item.header.id + idSuffix } }
    : item;

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
): ReactNode[] => {
  const {
    renderItemShell,
    renderComment,
    renderFormItemAppendix,
    renderAddFollowUp,
    renderActionIcon,
    renderFollowUpMark,
  } = chrome;
  const {
    responses,
    changes,
    setChanges,
    setAddition,
    setDeleteCommentId,
    lastPending,
    variants,
    renderFormItemsEditor,
    renderFormItem,
  } = live;

  const isAnswered = (id: string) => isAnsweredResponse(responses, id);

  const renderSlots = (
    cols: RecursiveFormItem<TypeNames, Params, Meta>[][],
    idSuffix: string,
    deleted: boolean,
  ): ReactNode[] =>
    cols.map((items, col) => (
      <Fragment key={col}>
        {items
          .filter(({ header }) => !header.deleted || isAnswered(header.id))
          .map((item) => withIdSuffix(item, idSuffix))
          .map((item, index) => (
            <Fragment key={item.header.id}>
              {renderItem(item, index, deleted, false)}
            </Fragment>
          ))}
      </Fragment>
    ));

  const renderItem = (
    item: RecursiveFormItem<TypeNames, Params, Meta>,
    index: number,
    itemParentDeleted: boolean,
    fromFollowUpTree: boolean,
  ): ReactNode => {
    const q = item.header;
    const { unlocked, designingFollowUps, variant, status } = reviewItemState({
      id: q.id,
      changes,
      responses,
      lastPending,
      isAnswered,
    });
    const appendix = appendixFor(q.id);
    const showFollowUpMark =
      fromFollowUpTree && !unlocked && !designingFollowUps;

    return renderItemShell({
      id: q.id,
      action: designingFollowUps
        ? null
        : renderAddFollowUp({
            originId: q.id,
            onPick: (payload) =>
              setChanges(
                withFormItemEntry(
                  changes,
                  q.id,
                  { ...payload, date: lastPending },
                  null,
                ),
              ),
          }),
      children: renderFormItem({
        formItem: q,
        variant: variants[variant],
        extra: branded({
          getChild: (suffix: string) => (
            <>
              {renderSlots(
                item.children,
                suffix,
                q.deleted || itemParentDeleted,
              )}
            </>
          ),
          error: null,
          parentDeleted: itemParentDeleted,
          index,
          icon: (
            <>
              {showFollowUpMark ? renderFollowUpMark() : null}
              {renderActionIcon(unlocked ? "unlock" : "lock", () => {
                if (unlocked) setDeleteCommentId(q.id);
                else setAddition({ originId: q.id });
              })}
            </>
          ),
          response: {
            setValue: null,
            value: responses[q.id] ?? emptyResponse(),
          },
          appendix: appendix.length
            ? renderFormItemAppendix(appendix)
            : undefined,
          status,
          impRef: null,
        }),
      }),
    });
  };

  const appendixFor = (originId: string): ReactNode[] => {
    const change = changes[originId];
    if (!change) return [];

    const nodes: ReactNode[] = [];
    if (change.comment) {
      nodes.push(
        <Fragment key="comment">
          {renderComment({
            text: change.comment,
            onEdit: () =>
              setAddition({ originId, text: change.comment }),
          })}
        </Fragment>,
      );
    }

    const { answered, unanswered } = partitionFollowUpEntries(
      change.formItems ?? [],
      isAnswered,
    );

    for (const entry of answered) {
      const followUp = followUpEntryAsItem(entry);
      if (!followUp) continue;
      nodes.push(
        <Fragment key={followUp.header.id}>
          {renderItem(followUp, 0, false, true)}
        </Fragment>,
      );
    }

    if (unanswered.length) {
      nodes.push(
        <Fragment key="form-items-editor">
          {renderFormItemsEditor({
            entries: unanswered.map(({ entry }) => entry),
            setEntries: (nextUnanswered) =>
              setChanges(
                withUnansweredFormItems(
                  changes,
                  originId,
                  nextUnanswered,
                  isAnswered,
                ),
              ),
          })}
        </Fragment>,
      );
    }

    return nodes;
  };

  return renderSlots(slots, "", parentDeleted);
};
