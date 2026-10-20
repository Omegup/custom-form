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
  SectionResponderChrome,
  SectionResponderContext,
  SectionResponderHeader,
  SectionResponderProps,
  SectionValidator,
} from "./types";

type ViewerExtra = ResponderExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ResponderExtra & { impRef: Ref<StrictViewerMethods> };

const idSuffixOf = (id: string): string => {
  const i = id.lastIndexOf(":");
  return i >= 0 ? id.slice(i) : "";
};

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
      resolveVariant,
      followUpItems,
    } = props;

    const validators = useRef<Record<string, StrictViewerMethods | null>>({});

    const followUpsForOrigin = (
      originId: string,
    ): RecursiveFormItem<TypeNames, Params, Meta>[] => {
      const exact = followUpItems[originId];
      if (exact?.length) return exact;
      return followUpItems[baseIdOf(originId)] ?? [];
    };

    const renderSlots = (
      slots: RecursiveFormItem<TypeNames, Params, Meta>[][],
      idSuffix: string,
      parentDeleted: boolean,
    ): ReactNode[] => {
      const renderFillItem = (
        item: RecursiveFormItem<TypeNames, Params, Meta>,
        index: number,
        itemParentDeleted: boolean,
      ): ReactNode => {
        const q = item.header;
        const children = item.children;
        const comment = old?.changes[q.id]?.comment;
        const oldValue = old?.values[q.id];
        const value = responses[q.id] || oldValue;
        const editable = !oldValue || comment != null;
        const error = getError(q.id);
        const onActivate =
          !responses[q.id] && editable && oldValue
            ? () => setResponse(q.id, emptyResponse())
            : undefined;

        return renderItemShell({
          id: q.id,
          onActivate,
          children: (
            <FormItem
              viewProps={{
                ctx,
                formItem: q,
                variant: resolveVariant(q),
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
              const suffix = idSuffixOf(q.id);
              const followUps = followUpsForOrigin(q.id).map((fu) =>
                !suffix
                  ? fu
                  : {
                      ...fu,
                      header: { ...fu.header, id: fu.header.id + suffix },
                    },
              );

              return (
                <Fragment key={q.id}>
                  {renderFillItem(item, index, parentDeleted)}
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
                                  q.deleted || parentDeleted,
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
