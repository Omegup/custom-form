/**
 * Section review shell — school `section-review-ui/SectionReview`
 * `SectionReviewHOC`. Renders one section's slots read-only through
 * `FormItemHOC`, threads per-item `status` derived from reviewer
 * `AdditionalChanges` + `lastPending`, and drives comment / follow-up-form-item
 * overlays via **host-owned** `addition` / `deleteCommentId` state (so a
 * Library sidebar can fill `formItem.type`).
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
  VariantsDom,
  ViewerMethods,
  Viewers,
} from "./_deps";
import { branded, emptyResponse, FormItemHOC, getUseImpRefViewProps } from "./_deps";
import type {
  ReviewExtra,
  ReviewStatus,
  SectionReviewChrome,
  SectionReviewContext,
  SectionReviewHeader,
  SectionReviewProps,
} from "./types";

type ViewerExtra = ReviewExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ReviewExtra & { impRef: Ref<StrictViewerMethods> };

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
      tCommon,
      addition,
      setAddition,
      deleteCommentId,
      setDeleteCommentId,
      renderFormItemsEditor,
    } = props;

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
      const { [deleteCommentId]: _current, ...others } = changes;
      const newChanges = Object.keys(rest).length ? { ...others, [deleteCommentId]: rest } : others;
      setChanges(newChanges);
      setDeleteCommentId(null);
    };

    const submitFormItem = (payload: {
      comment?: string;
      formItem?: SomeFormItem<TypeNames, Params>;
      children?: RecursiveFormItem<
        TypeNames,
        Params,
        MetaDom<SIndexed>
      >[][];
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

    const buildAppendix = (originId: string, parentDeleted: boolean): ReactNode[] => {
      const change = changes[originId];
      if (!change) return [];

      const nodes: ReactNode[] = [];

      if (change.comment) {
        nodes.push(
          <Fragment key="comment">
            {renderComment({
              text: change.comment,
              onEdit: () => setAddition({ originId, mode: "comment", text: change.comment }),
            })}
          </Fragment>,
        );
      }

      const formItemNodes: ReactNode[] = [];
      change.formItems?.forEach((sq, subIndex) => {
        if (sq.formItem) {
          const answered = !!responses[sq.formItem.id];
          const status: ReviewStatus =
            !sq.date || !lastPending ? "normal" : answered ? "disabled" : "highlight";
          formItemNodes.push(
            <Fragment key={subIndex}>
              {renderItemShell({
                id: sq.formItem.id,
                action: answered
                  ? null
                  : renderActionIcon("edit", () =>
                      setAddition({
                        originId,
                        mode: "formItem",
                        comment: sq.comment,
                        formItem: sq.formItem,
                        replace: { index: subIndex },
                      }),
                    ),
                children: (
                  <FormItem
                    viewProps={{
                      ctx,
                      formItem: sq.formItem,
                      variant: variants[sq.formItem.type],
                      extra: branded({
                        getChild: (suffix: string) => (
                          <>{renderSlots(sq.children ?? [], suffix, parentDeleted)}</>
                        ),
                        error: null,
                        parentDeleted,
                        index: subIndex,
                        icon: null,
                        response: {
                          setValue: null,
                          value: responses[sq.formItem.id] ?? emptyResponse(),
                        },
                        appendix: sq.comment ? renderAppendix(sq.comment) : undefined,
                        status,
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
                    replace: { index: subIndex },
                  }),
              })}
            </Fragment>,
          );
        }
      });

      if (change.formItems?.length) {
        nodes.push(
          <Fragment key="form-items-editor">
            {renderFormItemsEditor({
              entries: change.formItems,
              setEntries: (formItems) =>
                setChanges({
                  ...changes,
                  [originId]: { ...change, formItems },
                }),
              fallback: renderFormItemAppendix(formItemNodes),
            })}
          </Fragment>,
        );
      }

      return nodes;
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
              const res = responses[q.id];
              return res != null && Object.keys(res.data).length > 0;
            })
            .map((q) =>
              !idSuffix ? q : { ...q, header: { ...q.header, id: q.header.id + idSuffix } },
            )
            .map(({ header: q, children }, index) => {
              const change = changes[q.id];
              const hasComment = !!change?.comment;
              const lastHistoryDate = change?.history?.at(-1)?.date;
              const status: ReviewStatus = hasComment
                ? "normal"
                : lastPending === lastHistoryDate
                  ? "highlight"
                  : "disabled";

              const appendixNodes = buildAppendix(q.id, q.deleted || parentDeleted);

              return (
                <Fragment key={q.id}>
                  {renderItemShell({
                    id: q.id,
                    action: renderActionIcon("addFormItem", () =>
                      setAddition({ originId: q.id, mode: "formItem" }),
                    ),
                    children: (
                      <FormItem
                        viewProps={{
                          ctx,
                          formItem: q,
                          variant: variants[q.type],
                          extra: branded({
                            getChild: (suffix: string) => (
                              <>{renderSlots(children, suffix, q.deleted || parentDeleted)}</>
                            ),
                            error: null,
                            parentDeleted,
                            index,
                            // Remark unlocks the answer for student revise — show
                            // unlock when a comment exists; lock when none.
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
                  })}
                </Fragment>
              );
            })}
        </Fragment>
      ));

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
        {renderOverlays({
          addition,
          deleteCommentId,
          setAddition,
          clearDelete: () => setDeleteCommentId(null),
          onSubmitComment: submitComment,
          onConfirmDeleteComment: confirmDeleteComment,
          onSubmitFormItem: submitFormItem,
          tCommon,
        })}
      </>
    );
  };
};
