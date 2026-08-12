/**
 * Section fill shell — school `section-responder-ui/SectionResponder`
 * `SectionResponderHOC`. Renders one section's slots through `FormItemHOC` +
 * `getUseImpRefViewProps`, aggregates item validators into a section-level
 * `validate` / `update` / `getKeys`.
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

  const { renderSection, renderItemShell, renderClearIcon, renderAppendix } =
    chrome;

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
    } = props;

    const validators = useRef<Record<string, StrictViewerMethods | null>>({});

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
              !idSuffix
                ? q
                : {
                    ...q,
                    header: { ...q.header, id: q.header.id + idSuffix },
                  },
            )
            .map(({ header: q, children }, index) => {
              const comment = old?.changes[q.id]?.comment;
              const oldValue = old?.values[q.id];
              const value = responses[q.id] || oldValue;
              const editable = !oldValue || comment != null;
              const error = getError(q.id);
              const onActivate =
                !responses[q.id] && editable && oldValue
                  ? () => setResponse(q.id, emptyResponse())
                  : undefined;

              return (
                <Fragment key={q.id}>
                  {renderItemShell({
                    id: q.id,
                    onActivate,
                    children: (
                      <FormItem
                        viewProps={{
                          ctx,
                          formItem: q,
                          variant: variants[q.type],
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
                            error: error || (old && editable ? true : null),
                            parentDeleted,
                            index,
                            icon:
                              oldValue && responses[q.id]
                                ? renderClearIcon(() =>
                                    setResponse(q.id, undefined),
                                  )
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
                            appendix: comment
                              ? renderAppendix(comment)
                              : undefined,
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
                  })}
                </Fragment>
              );
            })}
        </Fragment>
      ));

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
