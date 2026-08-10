/**
 * School `form-react/getUseImpRefViewProps` — bridges host `extra.impRef`
 * (`StrictViewerMethods`) to the viewer's internal `ViewerMethods` ref, and
 * runs `update` before `validate` so validators always see a concrete Response.
 *
 * `Extra` is the viewer bag *without* `impRef` (typically already including
 * `Children` after `FormItemHOC` materializes `getChild`).
 */
import { useImperativeHandle, useMemo, useRef, type Ref } from "react";
import type { Response, StrictViewerMethods, ViewerMethods } from "./_deps";
import { emptyResponse } from "./_deps";
import type { ViewerProps } from "./form-react.t";
import type {
  ContextDom,
  ExtraDom,
  ParamsDom,
  VariantsDom,
} from "./form.t";

export const getUseImpRefViewProps =
  <
    TypeNames extends string,
    Params extends ParamsDom<TypeNames>,
    Variants extends VariantsDom<TypeNames>,
    Extra extends ExtraDom,
    Context extends ContextDom,
  >() =>
  <K extends TypeNames>(
    viewProps: ViewerProps<
      Params,
      Variants,
      K,
      Extra & { impRef: Ref<StrictViewerMethods> },
      Context
    >,
  ): ViewerProps<
    Params,
    Variants,
    K,
    Extra & { impRef: Ref<ViewerMethods> },
    Context
  > => {
    const ref = useRef<ViewerMethods>({ validate: () => null });
    const update = (value?: Response) =>
      ref.current.update?.(value) ?? value ?? emptyResponse();

    useImperativeHandle(viewProps.extra.impRef, () => ({
      update,
      validate: (v) => ref.current.validate(update(v)),
    }));

    return useMemo(
      () => ({ ...viewProps, extra: { ...viewProps.extra, impRef: ref } }),
      [viewProps],
    );
  };
