import { useImperativeHandle, useMemo, useRef, type Ref } from "react";
import type { ViewerProps } from "../form/form-react";
import type { ContextDom, ExtraDom, ParamsDom, TypedFormItem, VariantsDom, ViewExtraKeys } from "../form/form.model";
import type { Response } from "./response";

export type ViewerMethods = {
  validate: (value: Response) => string | null
  update?: (value?: Response) => Response
}

export type StrictViewerMethods = {
  validate: (value?: Response) => string | null
  update: (value?: Response) => Response
}

export const getUseImpRefViewProps =
  <
    TypeNames extends string,
    Params extends ParamsDom<TypeNames>,
    Variants extends VariantsDom<TypeNames>,
    Extra extends Record<ViewExtraKeys, ExtraDom>,
    Context extends ContextDom,
  >() =>
  <K extends TypeNames>(
    viewProps: ViewerProps<
      Params,
      Variants,
      K,
      Extra["view"] & { impRef: Ref<StrictViewerMethods> },
      Context
    >,
  ): {
    extra: Extra["view"] & {
      impRef: Ref<ViewerMethods>;
    };
    formItem: TypedFormItem<Params, K>;
    ctx: Context;
    variant: Variants[K];
  } => {
    const ref = useRef<ViewerMethods>({ validate: () => null });
    const update = (value?: Response) =>
      ref.current.update?.(value) ?? value ?? { meta: {}, data: {} };

    useImperativeHandle(viewProps.extra.impRef, () => ({
      update,
      validate: (v) => ref.current.validate(update(v)),
    }));

    return useMemo(
      () => ({ ...viewProps, extra: { ...viewProps.extra, impRef: ref } }),
      [viewProps],
    );
  };
