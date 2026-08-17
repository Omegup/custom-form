/**
 * Slot walk + appendix chrome — originals and answered follow-ups share
 * `renderReviewableItem`; unanswered follow-ups go through the host design
 * editor (`renderFormItemsEditor`).
 */
import { Fragment, type ReactNode } from "react";
import type {
  ExtraDom,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  Response,
  SIndexed,
  SomeFormItem,
  VariantsDom,
} from "./_deps";
import { branded, emptyResponse } from "./_deps";
import { partitionFollowUpEntries } from "./followUpPartition";
import { withFormItemEntry, withUnansweredFormItems } from "./reviewChanges";
import {
  hasUnansweredFollowUps,
  hasUnlockRemark,
  isAnsweredResponse,
  reviewStatusFor,
  reviewVariantState,
} from "./reviewStatus";
import type {
  AdditionalChanges,
  Addition,
  ReviewExtra,
  ReviewFormItemsEditorArgs,
  ReviewStatus,
  ReviewVariantState,
  SectionReviewChrome,
} from "./types";

type ReviewChrome<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
> = Pick<
  SectionReviewChrome<TypeNames, Params>,
  | "renderItemShell"
  | "renderAppendix"
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

export type ReviewRenderLive<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
> = {
  responses: Record<string, Response>;
  changes: AdditionalChanges<TypeNames, Params>;
  setChanges: (changes: AdditionalChanges<TypeNames, Params>) => void;
  setAddition: (addition: Addition<TypeNames, Params> | null) => void;
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

export const makeReviewRender =
  <
    TypeNames extends string,
    Params extends ParamsDom<TypeNames>,
    Variants extends VariantsDom,
  >() =>
  (chrome: ReviewChrome<TypeNames, Params>) => {
  const {
    renderItemShell,
    renderAppendix,
    renderComment,
    renderFormItemAppendix,
    renderAddFollowUp,
    renderActionIcon,
    renderFollowUpMark,
  } = chrome;

  return <Meta extends MetaDom>(live: ReviewRenderLive<
    TypeNames,
    Params,
    Variants
  >) => {
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

    const variantFor = (
      id: string,
      isUnansweredFollowUpEntry: boolean,
    ): Variants =>
      variants[
        reviewVariantState({
          id,
          isUnansweredFollowUpEntry,
          changes,
          isAnswered,
        })
      ];

    const addFollowUpUnder = (
      originId: string,
      payload: {
        comment?: string;
        formItem: SomeFormItem<TypeNames, Params>;
        children?: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
      },
    ) => {
      setChanges(
        withFormItemEntry(
          changes,
          originId,
          {
            comment: payload.comment,
            formItem: payload.formItem,
            children: payload.children,
            date: lastPending,
          },
          null,
        ),
      );
    };

    const buildAppendix = (originId: string): ReactNode[] => {
      const change = changes[originId];
      if (!change) return [];

      const nodes: ReactNode[] = [];

      if (change.comment) {
        nodes.push(
          <Fragment key="comment">
            {renderComment({
              text: change.comment,
              onEdit: () =>
                setAddition({ originId, mode: "comment", text: change.comment }),
            })}
          </Fragment>,
        );
      }

      const entries = change.formItems ?? [];
      const { answered, unanswered } = partitionFollowUpEntries(
        entries,
        isAnswered,
      );

      for (const entry of answered) {
        if (!entry.formItem) continue;
        const item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>> = {
          header: entry.formItem,
          children: entry.children ?? [],
          meta: { index: 0, total: 1, sIndex: 0 },
        };
        nodes.push(
          <Fragment key={entry.formItem.id}>
            {renderReviewableItem(item, 0, false, true)}
          </Fragment>,
        );
      }

      if (unanswered.length) {
        const formItemNodes: ReactNode[] = [];
        unanswered.forEach(({ entry: sq, sourceIndex }, subIndex) => {
          if (sq.formItem) {
            formItemNodes.push(
              <Fragment key={subIndex}>
                {renderItemShell({
                  id: sq.formItem.id,
                  action: renderActionIcon("edit", () =>
                    setAddition({
                      originId,
                      mode: "formItem",
                      comment: sq.comment,
                      formItem: sq.formItem,
                      replace: { index: sourceIndex },
                    }),
                  ),
                  children: renderFormItem({
                    formItem: sq.formItem,
                    variant: variantFor(sq.formItem.id, true),
                    extra: branded({
                      getChild: (suffix: string) => (
                        <>
                          {renderSlots(sq.children ?? [], suffix, false)}
                        </>
                      ),
                      error: null,
                      parentDeleted: false,
                      index: subIndex,
                      icon: null,
                      response: {
                        setValue: null,
                        value: responses[sq.formItem.id] ?? emptyResponse(),
                      },
                      appendix: sq.comment
                        ? renderAppendix(sq.comment)
                        : undefined,
                      status: "normal" satisfies ReviewStatus,
                      impRef: null,
                    }),
                  }),
                })}
              </Fragment>,
            );
          } else {
            formItemNodes.push(
              <Fragment key={subIndex}>
                {renderComment({
                  text: sq.comment ?? "",
                  onEdit: () =>
                    setAddition({
                      originId,
                      mode: "formItem",
                      comment: sq.comment,
                      formItem: undefined,
                      replace: { index: sourceIndex },
                    }),
                })}
              </Fragment>,
            );
          }
        });

        nodes.push(
          <Fragment key="form-items-editor">
            {renderFormItemsEditor({
              entries: unanswered.map(({ entry }) => entry),
              setEntries: (nextUnanswered) => {
                setChanges(
                  withUnansweredFormItems(
                    changes,
                    originId,
                    nextUnanswered,
                    isAnswered,
                  ),
                );
              },
              fallback: renderFormItemAppendix(formItemNodes),
            })}
          </Fragment>,
        );
      }

      return nodes;
    };

    const renderReviewableItem = (
      item: RecursiveFormItem<TypeNames, Params, Meta>,
      index: number,
      parentDeleted: boolean,
      fromFollowUpTree: boolean,
    ): ReactNode => {
      const q = item.header;
      const children = item.children;
      const unlocked = hasUnlockRemark(changes, q.id);
      const status = reviewStatusFor({
        id: q.id,
        unlocked,
        changes,
        responses,
        lastPending,
        isAnswered,
      });
      const appendixNodes = buildAppendix(q.id);
      const designingFollowUps = hasUnansweredFollowUps(
        changes,
        q.id,
        isAnswered,
      );
      const pendingYellow = unlocked || designingFollowUps;

      return renderItemShell({
        id: q.id,
        action: designingFollowUps
          ? null
          : renderAddFollowUp({
              originId: q.id,
              onPick: (payload) => addFollowUpUnder(q.id, payload),
            }),
        children: renderFormItem({
          formItem: q,
          variant: variantFor(q.id, false),
          extra: branded({
            getChild: (suffix: string) => (
              <>
                {renderSlots(
                  children,
                  suffix,
                  q.deleted || parentDeleted,
                )}
              </>
            ),
            error: null,
            parentDeleted,
            index,
            icon: (
              <>
                {fromFollowUpTree && !pendingYellow
                  ? renderFollowUpMark()
                  : null}
                {renderActionIcon(unlocked ? "unlock" : "lock", () => {
                  if (unlocked) setDeleteCommentId(q.id);
                  else setAddition({ originId: q.id, mode: "comment" });
                })}
              </>
            ),
            response: {
              setValue: null,
              value: responses[q.id] ?? emptyResponse(),
            },
            appendix: appendixNodes.length
              ? renderFormItemAppendix(appendixNodes)
              : undefined,
            status,
            impRef: null,
          }),
        }),
      });
    };

    const renderSlots = (
      slots: RecursiveFormItem<TypeNames, Params, Meta>[][],
      idSuffix: string,
      parentDeleted: boolean,
    ): ReactNode[] =>
      slots.map((items, col) => (
        <Fragment key={col}>
          {items
            .filter(({ header: q }) => {
              if (!q.deleted) return true;
              return isAnswered(q.id);
            })
            .map((q) =>
              !idSuffix
                ? q
                : {
                    ...q,
                    header: { ...q.header, id: q.header.id + idSuffix },
                  },
            )
            .map((item, index) => (
              <Fragment key={item.header.id}>
                {renderReviewableItem(item, index, parentDeleted, false)}
              </Fragment>
            ))}
        </Fragment>
      ));

    return { renderSlots };
  };
};
