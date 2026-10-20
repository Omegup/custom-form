/**
 * Shared design-list session — autofocus ctx, consolidate, move actions, and
 * pending-remove. Host mounts `SectionFormItemHOC` / dialogs / alerts.
 */
import { useMemo, useState } from "react";
import type {
  AutoFocus,
  AutoFocusState,
  Clone,
  ContextDom,
  FlatFormItems,
  FlatNestedItem,
  ParamsDom,
  SectionDom,
} from "./_deps";
import {
  autofocusCtx,
  buildItemSectionDict,
  consolidateSections,
  getFormItemMoveActions,
} from "./_deps";

export type FlatListPendingRemove<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
> = {
  rm: () => void;
  item: FlatNestedItem<TypeNames, Params, SectionConfig>;
};

export type UseFlatListSessionArgs<
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
> = {
  flatItems: FlatFormItems<TypeNames, Params, SectionConfig>;
  setFlatItems: (
    items: FlatFormItems<TypeNames, Params, SectionConfig>,
  ) => void;
  baseCtx: Ctx;
  clone: Clone<
    TypeNames,
    Params,
    AutoFocus<Ctx & { focused: AutoFocusState }, boolean>,
    SectionConfig
  >;
  jump: boolean;
};

export const useFlatListSession = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Ctx extends ContextDom,
  SectionConfig extends SectionDom,
>({
  flatItems,
  setFlatItems,
  baseCtx,
  clone,
  jump,
}: UseFlatListSessionArgs<TypeNames, Params, Ctx, SectionConfig>) => {
  type ListCtx = AutoFocus<Ctx & { focused: AutoFocusState }, boolean>;
  const [focused, setFocused] = useState<AutoFocusState>(null);
  const [toRemove, setToRemove] = useState<
    FlatListPendingRemove<TypeNames, Params, SectionConfig> | null
  >(null);

  const listCtx = useMemo(
    () => autofocusCtx<Ctx>(baseCtx, focused),
    [baseCtx, focused],
  );

  const setItems = (
    items: FlatFormItems<TypeNames, Params, SectionConfig>,
    newCtx: ListCtx,
  ) => {
    if (items !== flatItems) setFlatItems(items);
    setFocused(newCtx.focused);
  };

  const sections = useMemo(
    () => consolidateSections(flatItems),
    [flatItems],
  );
  const sectionOfItem = useMemo(
    () => buildItemSectionDict(flatItems),
    [flatItems],
  );

  const args = {
    items: flatItems,
    setItems,
    ctx: listCtx,
    sectionOfItem,
    setToRemove,
  };
  const itemActions = getFormItemMoveActions(args, clone, jump);

  return {
    listCtx,
    sections,
    args,
    itemActions,
    toRemove,
    setToRemove,
    setFocused,
  };
};
