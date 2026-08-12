/**
 * Section review shell — school `section-review-ui/SectionReview`
 * `SectionReviewHOC`. Renders one section's slots read-only through
 * `FormItemHOC`, threads per-item `status` derived from reviewer
 * `AdditionalChanges` + `lastPending`, and drives comment / follow-up-form-item
 * overlays via **host-owned** `addition` / `deleteCommentId` state, and
 * `renderAddFollowUp` for attaching follow-up form items (e.g. an
 * `AddFormItem` dropdown — no Library sidebar required).
 *
 * Follow-up lifecycle:
 * - Unanswered → Design editor under the origin (`followUp` / yellow).
 * - Answered → same chrome as originals (lock/comment/+Follow-up, nested
 *   appendix) under the origin; yellow only while still pending.
 *
 * A remark **unlocks** an answer for student revise (`unlock` icon when a
 * comment exists; `lock` when none).
 *
 * All presentation is injected via {@link SectionReviewChrome} — this module
 * emits no HTML (see `.cursor/rules/no-html-outside-demo.mdc`). Overlays
 * render inline (sibling to content), never via `createPortal`.
 */
import { Fragment, type ReactNode, type Ref } from "react";
import type {
  Children,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionMetaDom,
  SIndexed,
  SomeFormItem,
  StrictViewerMethods,
  TypedFormItem,
  VariantsDom,
  ViewerMethods,
  Viewers,
} from "./_deps";
import { branded, emptyResponse, FormItemHOC, getUseImpRefViewProps } from "./_deps";
import type {
  ReviewExtra,
  ReviewFormItemEntry,
  ReviewStatus,
  SectionReviewChrome,
  SectionReviewContext,
  SectionReviewHeader,
  SectionReviewProps,
} from "./types";

type ViewerExtra = ReviewExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ReviewExtra & { impRef: Ref<StrictViewerMethods> };

const isAnsweredResponse = (
  responses: Record<string, { data: Record<string, string> }>,
  id: string,
): boolean => {
  const res = responses[id];
  return res != null && Object.keys(res.data).length > 0;
};

export const SectionReviewHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  Context extends SectionReviewContext,
  SectionConfig extends SectionReviewHeader,
>(
  viewers: Viewers<
    TypeNames,
    Params,
    Variants,
    ViewerExtra & Children,
    HostExtra,
    Context,
    string
  >,
  chrome: SectionReviewChrome<TypeNames, Params>,
) => {
  const FormItem = FormItemHOC<TypeNames, Params, Variants, ViewerExtra, Context, HostExtra>(
    viewers,
    getUseImpRefViewProps<TypeNames, Params, Variants, ReviewExtra & Children, Context>(),
  );

  const {
    renderSection,
    renderItemShell,
    renderAppendix,
    renderComment,
    renderFormItemAppendix,
    renderAddFollowUp,
    renderActionIcon,
    renderOverlays,
  } = chrome;

  return <SectionMeta extends SectionMetaDom, Meta extends MetaDom>(
    props: SectionReviewProps<
      TypeNames,
      Params,
      Variants,
      Context,
      SectionConfig,
      SectionMeta,
      Meta
    >,
  ) => {
    const {
      multiSection,
      section,
      i,
      responses,
      ctx,
      changes,
      setChanges,
      lastPending,
      variants,
      followUpVariants,
      tCommon,
      addition,
      setAddition,
      deleteCommentId,
      setDeleteCommentId,
      renderFormItemsEditor,
    } = props;

    const isAnswered = (id: string) => isAnsweredResponse(responses, id);

    const hasUnansweredFollowUps = (originId: string) =>
      !!changes[originId]?.formItems?.some(
        (e) => e.formItem != null && !isAnswered(e.formItem.id),
      );

    const reviewStatusFor = (id: string, hasComment: boolean): ReviewStatus => {
      if (hasComment) return "normal";
      const lastHistoryDate = changes[id]?.history?.at(-1)?.date;
      if (lastPending == null || lastHistoryDate == null) return "disabled";
      const historyMs =
        lastHistoryDate instanceof Date
          ? lastHistoryDate.getTime()
          : new Date(lastHistoryDate as string | number).getTime();
      return lastPending.getTime() === historyMs ? "highlight" : "disabled";
    };

    /** Yellow while pending (unlock remark / unanswered follow-ups); else default. */
    const resolveVariant = <K extends TypeNames>(
      item: TypedFormItem<Params, K>,
      isUnansweredFollowUpEntry: boolean,
    ): Variants[K] => {
      const pending =
        isUnansweredFollowUpEntry ||
        !!changes[item.id]?.comment ||
        hasUnansweredFollowUps(item.id);
      return pending ? followUpVariants[item.type] : variants[item.type];
    };

    const submitComment = (text: string) => {
      if (!addition || addition.mode !== "comment") return;
      const { originId } = addition;
      setChanges({
        ...changes,
        [originId]: { ...(changes[originId] ?? {}), comment: text },
      });
      setAddition(null);
    };

    const confirmDeleteComment = () => {
      if (!deleteCommentId) return;
      const { comment: _comment, ...rest } = changes[deleteCommentId] ?? {};
      const next = { ...changes };
      if (Object.keys(rest).length) next[deleteCommentId] = rest;
      else delete next[deleteCommentId];
      setChanges(next);
      setDeleteCommentId(null);
    };

    const submitFormItem = (payload: {
      comment?: string;
      formItem?: SomeFormItem<TypeNames, Params>;
      children?: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
    }) => {
      if (!addition || addition.mode !== "formItem") return;
      const { originId, replace } = addition;
      const current = changes[originId] ?? {};
      const entry = {
        comment: payload.comment,
        formItem: payload.formItem,
        children: payload.children,
        date: lastPending,
      };
      const formItems = current.formItems ? [...current.formItems] : [];
      if (replace) {
        formItems[replace.index] = entry;
      } else {
        formItems.push(entry);
      }
      setChanges({ ...changes, [originId]: { ...current, formItems } });
      setAddition(null);
    };

    const addFollowUpUnder = (
      originId: string,
      payload: {
        comment?: string;
        formItem: SomeFormItem<TypeNames, Params>;
        children?: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>>[][];
      },
    ) => {
      const current = changes[originId] ?? {};
      const formItems = current.formItems ? [...current.formItems] : [];
      formItems.push({
        comment: payload.comment,
        formItem: payload.formItem,
        children: payload.children,
        date: lastPending,
      });
      setChanges({
        ...changes,
        [originId]: { ...current, formItems },
      });
    };

    const buildAppendix = (
      originId: string,
      parentDeleted: boolean,
    ): ReactNode[] => {
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
      const answeredEntries: {
        entry: ReviewFormItemEntry<TypeNames, Params>;
        index: number;
      }[] = [];
      const unansweredEntries: ReviewFormItemEntry<TypeNames, Params>[] = [];
      const unansweredSourceIndex: number[] = [];

      entries.forEach((entry, index) => {
        if (entry.formItem && isAnswered(entry.formItem.id)) {
          answeredEntries.push({ entry, index });
        } else if (entry.formItem) {
          unansweredEntries.push(entry);
          unansweredSourceIndex.push(index);
        } else {
          unansweredEntries.push(entry);
          unansweredSourceIndex.push(index);
        }
      });

      for (const { entry } of answeredEntries) {
        if (!entry.formItem) continue;
        const item: RecursiveFormItem<TypeNames, Params, MetaDom<SIndexed>> = {
          header: entry.formItem,
          children: entry.children ?? [],
          meta: { index: 0, total: 1, sIndex: 0 },
        };
        nodes.push(
          <Fragment key={entry.formItem.id}>
            {renderReviewableItem(item, 0, parentDeleted, false)}
          </Fragment>,
        );
      }

      if (unansweredEntries.length) {
        const formItemNodes: ReactNode[] = [];
        unansweredEntries.forEach((sq, subIndex) => {
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
                      replace: { index: unansweredSourceIndex[subIndex]! },
                    }),
                  ),
                  children: (
                    <FormItem
                      viewProps={{
                        ctx,
                        formItem: sq.formItem,
                        variant: resolveVariant(sq.formItem, true),
                        extra: branded({
                          getChild: (suffix: string) => (
                            <>
                              {renderSlots(
                                sq.children ?? [],
                                suffix,
                                parentDeleted,
                              )}
                            </>
                          ),
                          error: null,
                          parentDeleted,
                          index: subIndex,
                          icon: null,
                          response: {
                            setValue: null,
                            value: responses[sq.formItem.id] ?? emptyResponse(),
                          },
                          appendix: sq.comment
                            ? renderAppendix(sq.comment)
                            : undefined,
                          status: "normal",
                          impRef: null,
                        }),
                      }}
                      renderCard={(view) => view}
                    />
                  ),
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
                      replace: { index: unansweredSourceIndex[subIndex]! },
                    }),
                })}
              </Fragment>,
            );
          }
        });

        nodes.push(
          <Fragment key="form-items-editor">
            {renderFormItemsEditor({
              entries: unansweredEntries,
              setEntries: (nextUnanswered) => {
                const answeredOnly = entries.filter(
                  (e) => e.formItem != null && isAnswered(e.formItem.id),
                );
                setChanges({
                  ...changes,
                  [originId]: {
                    ...change,
                    formItems: [...answeredOnly, ...nextUnanswered],
                  },
                });
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
      _fromFollowUpTree: boolean,
    ): ReactNode => {
      const q = item.header;
      const children = item.children;
      const change = changes[q.id];
      const hasComment = !!change?.comment;
      const status = reviewStatusFor(q.id, hasComment);
      const appendixNodes = buildAppendix(q.id, q.deleted || parentDeleted);
      const designingFollowUps = hasUnansweredFollowUps(q.id);

      return renderItemShell({
        id: q.id,
        // Hide +Follow-up while Design list is open for unanswered items.
        action: designingFollowUps
          ? null
          : renderAddFollowUp({
              originId: q.id,
              onPick: (payload) => addFollowUpUnder(q.id, payload),
            }),
        children: (
          <FormItem
            viewProps={{
              ctx,
              formItem: q,
              variant: resolveVariant(q, false),
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
                icon: renderActionIcon(hasComment ? "unlock" : "lock", () => {
                  if (hasComment) setDeleteCommentId(q.id);
                  else setAddition({ originId: q.id, mode: "comment" });
                }),
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
            }}
            renderCard={(view) => view}
          />
        ),
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

    const idInSectionTree = (
      id: string,
      slots: RecursiveFormItem<TypeNames, Params, Meta>[][] = section.items,
    ): boolean =>
      slots.some((items) =>
        items.some(
          (item) =>
            item.header.id === id || idInSectionTree(id, item.children),
        ),
      );

    const sectionOwnsOverlay = (id: string): boolean => {
      if (idInSectionTree(id)) return true;
      for (const [originId, change] of Object.entries(changes)) {
        if (
          change.formItems?.some((e) => e.formItem?.id === id) &&
          idInSectionTree(originId)
        )
          return true;
      }
      return false;
    };

    const overlayId = addition?.originId ?? deleteCommentId;

    return (
      <>
        {renderSection({
          deleted: section.header.deleted,
          title: section.header.title,
          description: section.header.description,
          i,
          multiSection,
          columns: renderSlots(section.items, "", section.header.deleted),
        })}
        {overlayId && sectionOwnsOverlay(overlayId)
          ? renderOverlays({
              addition,
              deleteCommentId,
              setAddition,
              clearDelete: () => setDeleteCommentId(null),
              onSubmitComment: submitComment,
              onConfirmDeleteComment: confirmDeleteComment,
              onSubmitFormItem: submitFormItem,
              tCommon,
            })
          : null}
      </>
    );
  };
};
