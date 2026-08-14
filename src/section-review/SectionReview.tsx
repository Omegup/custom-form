/**
 * Section review shell — school `section-review-ui/SectionReview`
 * `SectionReviewHOC`. Renders one section's slots read-only through
 * `FormItemHOC`, threads per-item `status` derived from reviewer
 * `AdditionalChanges` history stamps (newest wave = recent) plus optional
 * `lastPending`, and drives comment / follow-up-form-item
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
    renderFollowUpMark,
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

    /** Unlock remark present — including empty string (school unlock-without-text). */
    const hasUnlockRemark = (id: string) => changes[id]?.comment != null;

    const hasUnansweredFollowUps = (originId: string) =>
      !!changes[originId]?.formItems?.some(
        (e) => e.formItem != null && !isAnswered(e.formItem.id),
      );

    const historySec = (
      date: Date | string | number | null | undefined,
    ): number | null => {
      if (date == null) return null;
      const ms =
        date instanceof Date ? date.getTime() : new Date(date).getTime();
      return Number.isFinite(ms) ? Math.floor(ms / 1000) : null;
    };

    /** Newest answer-stamp across all items — that wave is "recent". */
    const latestAnswerSec = (() => {
      let max: number | null = null;
      for (const entry of Object.values(changes)) {
        for (const h of entry.history ?? []) {
          const sec = historySec(h.date);
          if (sec != null && (max == null || sec > max)) max = sec;
        }
      }
      return max;
    })();

    const reviewStatusFor = (id: string, unlocked: boolean): ReviewStatus => {
      if (unlocked) return "normal";
      const ms = historySec(changes[id]?.history?.at(-1)?.date);
      if (ms == null) {
        // No stamp — empty optional missed on an older send, or never submitted.
        // If a response row exists and there is only one answer wave among peers,
        // treat as recent (same first send). Multiple waves → ancient.
        if (responses[id] !== undefined) {
          const waveCount = new Set(
            Object.values(changes).flatMap((entry) =>
              (entry.history ?? [])
                .map((h) => historySec(h.date))
                .filter((s): s is number => s != null),
            ),
          ).size;
          return waveCount <= 1 ? "highlight" : "disabled";
        }
        return isAnswered(id) ? "highlight" : "disabled";
      }
      // Prefer lastPending when it aligns with an answer wave (student Send).
      if (lastPending != null) {
        const pendingSec = historySec(lastPending);
        if (pendingSec != null) {
          const pendingMatchesWave = Object.values(changes).some(
            (entry) => historySec(entry.history?.at(-1)?.date) === pendingSec,
          );
          if (pendingMatchesWave) {
            return pendingSec === ms ? "highlight" : "disabled";
          }
        }
      }
      // Fallback: newest answer wave = recent; older stamps = ancient.
      if (latestAnswerSec == null) return "highlight";
      return ms === latestAnswerSec ? "highlight" : "disabled";
    };

    /**
     * Yellow only while pending (step 2): unlock remark and/or unanswered
     * follow-ups. After Send (step 4) comments are cleared and follow-ups are
     * answered → default/black. Answered follow-ups still use full review
     * chrome (lock / remark / +Follow-up) via `renderReviewableItem`.
     */
    const resolveVariant = <K extends TypeNames>(
      item: TypedFormItem<Params, K>,
      isUnansweredFollowUpEntry: boolean,
    ): Variants[K] => {
      const pending =
        isUnansweredFollowUpEntry ||
        hasUnlockRemark(item.id) ||
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
        // Answered follow-ups behave as originals (read + lock/remark/+Follow-up).
        // Do not inherit the origin's deleted/transparent chrome.
        nodes.push(
          <Fragment key={entry.formItem.id}>
            {renderReviewableItem(item, 0, false, true)}
          </Fragment>
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
                                false,
                              )}
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
      fromFollowUpTree: boolean,
    ): ReactNode => {
      const q = item.header;
      const children = item.children;
      const unlocked = hasUnlockRemark(q.id);
      const status = reviewStatusFor(q.id, unlocked);
      const appendixNodes = buildAppendix(q.id);
      const designingFollowUps = hasUnansweredFollowUps(q.id);
      const pendingYellow =
        unlocked || designingFollowUps;
      // Settled answered follow-ups: black like originals (not unanswered design).
      // Pending yellow comes from remark / unanswered children only.
      const variant = resolveVariant(q, false);

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
              variant,
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
                    {/* ✚ once: variant badge while yellow; mark when settled. */}
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
