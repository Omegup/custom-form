import type { ReactNode, Ref } from "react";
import type {
  MetaDom,
  ParamsDom,
  Response,
  ResponseSetter,
  StrictViewerMethods,
  VariantsDom,
} from "./_deps";
import { branded } from "./_deps";
import type { FillItemExtra, FillWalk } from "./responderWalk.t";

export const renderFillClearIcon = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  walk: FillWalk<TypeNames, Params, Variants, Meta>,
  id: string,
  oldValue: Response | null,
  current: Response | null,
): ReactNode =>
  oldValue && current
    ? walk.chrome.renderClearIcon(() => walk.live.setResponse(id, undefined))
    : null;

export const fillViewerExtra = (args: {
  getChild: (suffix: string) => ReactNode;
  error: boolean | string | null;
  parentDeleted: boolean;
  index: number;
  icon: ReactNode;
  appendix: ReactNode;
  setValue: ResponseSetter["setValue"];
  value: Response;
  impRef: Ref<StrictViewerMethods> | null;
}): FillItemExtra =>
  branded({
    getChild: args.getChild,
    error: args.error,
    parentDeleted: args.parentDeleted,
    index: args.index,
    icon: args.icon,
    appendix: args.appendix,
    response: {
      setValue: args.setValue,
      value: args.value,
    },
    impRef: args.impRef,
  });
