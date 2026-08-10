/**
 * Section fill shell — school `section-responder-ui/SectionResponder`
 * `SectionResponderHOC`. Renders one section's slots through `FormItemHOC` +
 * `getUseImpRefViewProps`, aggregates item validators into a section-level
 * `validate` / `update` / `getKeys`.
 *
 * No design-system chrome: title + slot layout use inline styles (school used
 * JSS `SectionTitle` / `ErrorDescription` / `Close`).
 */
import {
  Fragment,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
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
  SectionResponderContext,
  SectionResponderHeader,
  SectionResponderProps,
  SectionValidator,
} from "./types";

type ViewerExtra = ResponderExtra & { impRef: Ref<ViewerMethods> };
type HostExtra = ResponderExtra & { impRef: Ref<StrictViewerMethods> };

const sectionStyle = (deleted: boolean): CSSProperties => ({
  marginBottom: 20,
  opacity: deleted ? 0.5 : 1,
});

const slotsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const questionsStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const SectionTitle = ({
  index,
  multiSection,
  title,
  description,
}: {
  index: number;
  multiSection: boolean;
  title: string;
  description: string;
}) => (
  <div style={{ marginBottom: 12 }}>
    <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>
      {multiSection ? `${index + 1}. ${title}` : title}
    </h3>
    {description ? (
      <p style={{ margin: 0, color: "#555", fontSize: 14 }}>{description}</p>
    ) : null}
  </div>
);

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
    ): ReactNode => (
      <div style={slotsStyle}>
        {slots.map((items, col) => (
          <Fragment key={col}>
            <div style={questionsStyle}>
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

                  return (
                    <div
                      key={q.id}
                      onClick={
                        !responses[q.id] && editable && oldValue
                          ? () => setResponse(q.id, emptyResponse())
                          : undefined
                      }
                    >
                      <FormItem
                        viewProps={{
                          ctx,
                          formItem: q,
                          variant: variants[q.type],
                          extra: branded({
                            getChild: (suffix: string) =>
                              renderSlots(
                                children,
                                suffix,
                                q.deleted || parentDeleted,
                              ),
                            error: error || (old && editable ? true : null),
                            parentDeleted,
                            index,
                            icon:
                              oldValue && responses[q.id] ? (
                                <button
                                  type="button"
                                  aria-label="Clear draft answer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setResponse(q.id, undefined);
                                  }}
                                  style={{
                                    margin: "0 4px",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    color: "#666",
                                    fontSize: 16,
                                    lineHeight: 1,
                                  }}
                                >
                                  ×
                                </button>
                              ) : undefined,
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
                            appendix: comment ? (
                              <div
                                style={{
                                  marginTop: 4,
                                  color: "#c00",
                                  fontSize: 12,
                                }}
                              >
                                {comment}
                              </div>
                            ) : undefined,
                            impRef: editable
                              ? (ref) => {
                                  validators.current[q.id] = ref;
                                }
                              : null,
                          }),
                        }}
                        renderCard={(view) => view}
                      />
                    </div>
                  );
                })}
            </div>
          </Fragment>
        ))}
      </div>
    );

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

    return (
      <div style={sectionStyle(section.header.deleted)}>
        <SectionTitle
          index={i}
          multiSection={multiSection}
          title={section.header.title}
          description={section.header.description}
        />
        {renderSlots(section.items, "", section.header.deleted)}
      </div>
    );
  };
};
