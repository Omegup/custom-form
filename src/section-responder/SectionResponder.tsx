/**
 * Section fill shell — school `section-responder-ui/SectionResponder`
 * `SectionResponderHOC`. Renders one section's slots through `FormItemHOC` +
 * `getUseImpRefViewProps`, aggregates item validators into a section-level
 * `validate` / `update` / `getKeys`.
 *
 * Reviewer follow-ups (`followUpItems`) render **under their origin item**
 * (same placement as section-review appendix), not as design-tree siblings.
 *
 * All presentation is injected via {@link SectionResponderChrome} — this
 * module emits no HTML (see `.cursor/rules/no-html-outside-demo.mdc`).
 */
import { Fragment, useImperativeHandle, useRef, type ReactNode, type Ref } from "react";
import type {
  Children,
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  SectionMetaDom,
  StrictViewerMethods,
  VariantsDom,
  ViewerMethods,
  Viewers,
} from "./_deps";
import {
  branded,
  emptyResponse,
  FormItemHOC,
  getUseImpRefViewProps,
} from "./_deps";
import type {
  ResponderExtra,
  ResponderState,
  SectionResponderChrome,
  SectionResponderContext,
  SectionResponderHeader,
  SectionResponderProps,
  SectionValidator,
} from "./types";

type ViewerExtra = ResponderExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ResponderExtra & { impRef: Ref<StrictViewerMethods> };

const baseIdOf = (id: string): string => {
  const i = id.lastIndexOf(":");
  return i >= 0 ? id.slice(0, i) : id;
};

export const SectionResponderHOC = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom<TypeNames>,
  Context extends SectionResponderContext,
  SectionConfig extends SectionResponderHeader,
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
  chrome: SectionResponderChrome,
) => {
  const FormItem = FormItemHOC<
    TypeNames,
    Params,
    Variants,
    ViewerExtra,
    Context,
    HostExtra
  >(
    viewers,
    getUseImpRefViewProps<
      TypeNames,
      Params,
      Variants,
      ResponderExtra & Children,
      Context
    >(),
  );

  const {
    renderSection,
    renderItemShell,
    renderClearIcon,
    renderAppendix,
    renderFollowUpGroup,
  } = chrome;

  return <
    SectionMeta extends SectionMetaDom,
    Meta extends MetaDom,
  >(
    props: SectionResponderProps<
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
      setResponse,
      impRef,
      getError,
      ctx,
      old,
      variants,
      followUpItems,
    } = props;

    const validators = useRef<Record<string, StrictViewerMethods | null>>({});

    /**
     * Follow-ups are keyed by the origin id used at review time (may include
     * a panel instance suffix). Match exact, base, or any key with the same
     * base — do **not** re-suffix follow-up ids (they already belong to that
     * origin instance; re-suffixing broke answer keys under panels).
     */
    const followUpsForOrigin = (
      originId: string,
    ): RecursiveFormItem<TypeNames, Params, Meta>[] => {
      const exact = followUpItems[originId];
      if (exact?.length) return exact;
      const base = baseIdOf(originId);
      const byBase = followUpItems[base];
      if (byBase?.length) return byBase;
      for (const [key, items] of Object.entries(followUpItems)) {
        if (items?.length && baseIdOf(key) === base) return items;
      }
      return [];
    };

    const unlockComment = (id: string): string | undefined =>
      old?.changes[id]?.comment ?? old?.changes[baseIdOf(id)]?.comment;

    const priorValue = (id: string) =>
      old?.values[id] ?? old?.values[baseIdOf(id)];

    const renderSlots = (
      slots: RecursiveFormItem<TypeNames, Params, Meta>[][],
      idSuffix: string,
      parentDeleted: boolean,
    ): ReactNode[] => {
      const responderState = (
        id: string,
        isFollowUpTree: boolean,
      ): ResponderState => {
        if (getError(id)) return "error";
        const oldValue = priorValue(id);
        const remark = unlockComment(id);
        if (isFollowUpTree && !oldValue) return "change";
        if (oldValue && remark != null) return "change";
        if (oldValue) return "old";
        return "default";
      };

      const renderFillItem = (
        item: RecursiveFormItem<TypeNames, Params, Meta>,
        index: number,
        itemParentDeleted: boolean,
        isFollowUpTree: boolean,
      ): ReactNode => {
        const q = item.header;
        const children = item.children;
        const comment = unlockComment(q.id);
        const oldValue = priorValue(q.id);
        const value = responses[q.id] ?? oldValue;
        const editable = !oldValue || comment != null;
        const error = getError(q.id);
        const state = responderState(q.id, isFollowUpTree);
        // Seed the draft from the prior answer so revise Fill keeps it visible.
        const onActivate =
          responses[q.id] == null && editable && oldValue
            ? () =>
                setResponse(q.id, {
                  meta: { ...oldValue.meta },
                  data: { ...oldValue.data },
                })
            : undefined;

        return renderItemShell({
          id: q.id,
          onActivate,
          children: (
            <FormItem
              viewProps={{
                ctx,
                formItem: q,
                variant: variants[state][q.type],
                extra: branded({
                  getChild: (suffix: string) => (
                    <>
                      {renderSlots(
                        children,
                        suffix,
                        q.deleted || itemParentDeleted,
                      )}
                    </>
                  ),
                  error:
                    error || (old && editable && oldValue ? true : null),
                  parentDeleted: itemParentDeleted,
                  index,
                  icon:
                    oldValue && responses[q.id]
                      ? renderClearIcon(() => setResponse(q.id, undefined))
                      : undefined,
                  response: {
                    setValue: editable
                      ? (key, v) => {
                          setResponse(q.id, {
                            ...(value ?? emptyResponse()),
                            [key]: v,
                          });
                        }
                      : null,
                    value: value || emptyResponse(),
                  },
                  appendix: comment ? renderAppendix(comment) : undefined,
                  impRef: editable
                    ? (ref) => {
                        validators.current[q.id] = ref;
                      }
                    : null,
                }),
              }}
              renderCard={(view) => view}
            />
          ),
        });
      };

      return slots.map((items, col) => (
        <Fragment key={col}>
          {items
            .filter(({ header: q }) => {
              if (!q.deleted) return true;
              const res = responses[q.id];
              return res != null && Object.keys(res.data).length > 0;
            })
            .map((q) =>
              !idSuffix
                ? q
                : {
                    ...q,
                    header: { ...q.header, id: q.header.id + idSuffix },
                  },
            )
            .map((item, index) => {
              const q = item.header;
              const followUps = followUpsForOrigin(q.id);

              return (
                <Fragment key={q.id}>
                  {renderFillItem(item, index, parentDeleted, false)}
                  {followUps.length > 0
                    ? renderFollowUpGroup({
                        originId: q.id,
                        items: (
                          <>
                            {followUps.map((fu, fuIndex) => (
                              <Fragment key={fu.header.id}>
                                {renderFillItem(
                                  fu,
                                  fuIndex,
                                  // Follow-ups do not inherit deleted/transparent chrome.
                                  false,
                                  true,
                                )}
                              </Fragment>
                            ))}
                          </>
                        ),
                      })
                    : null}
                </Fragment>
              );
            })}
        </Fragment>
      ));
    };

    useImperativeHandle(
      impRef,
      (): SectionValidator => ({
        validate: (values) => {
          const errors: Record<string, string | null> = {};
          for (const qId in validators.current) {
            const ref = validators.current[qId];
            if (!ref) continue;
            const error = ref.validate(values[qId]);
            if (error) errors[qId] = error;
          }
          return errors;
        },
        update: (values) =>
          Object.entries(validators.current).reduce(
            (acc, [key, validator]) =>
              validator
                ? { ...acc, [key]: validator.update(acc[key]) }
                : acc,
            values,
          ),
        getKeys: () =>
          Object.entries(validators.current).flatMap(([k, v]) =>
            v ? [k] : [],
          ),
      }),
    );

    return renderSection({
      deleted: section.header.deleted,
      title: section.header.title,
      description: section.header.description,
      i,
      multiSection,
      columns: renderSlots(section.items, "", section.header.deleted),
    });
  };
};
