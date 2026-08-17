/**
 * Headless follow-up add — session + commit. Host owns the catalog trigger
 * and the item editor chrome (no HTML here).
 */
import { useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type {
  FlatFormItem,
  FlatFormItemEditSession,
  ParamsDom,
} from "./_deps";
import { patchFormItemEditSession } from "./_deps";
import type { ReviewFollowUpPick } from "./types";

export const followUpPickFromSession = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>(
  session: FlatFormItemEditSession<TypeNames, Params>,
): ReviewFollowUpPick<TypeNames, Params> => ({
  comment: null,
  formItem: session.draft.item,
  children: session.children.length > 0 ? session.children : null,
});

export const useFollowUpAdd = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>({
  onPick,
}: {
  onPick: (payload: ReviewFollowUpPick<TypeNames, Params>) => void;
}) => {
  const [session, setSession] = useState<FlatFormItemEditSession<
    TypeNames,
    Params
  > | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const setDraft: Dispatch<
    SetStateAction<FlatFormItem<TypeNames, Params>>
  > = (updater) =>
    setSession((prev) => prev && patchFormItemEditSession(prev, updater));

  return {
    session,
    setSession,
    setDraft,
    close: () => setSession(null),
    commit: () => {
      const current = sessionRef.current;
      if (!current) return;
      onPick(followUpPickFromSession(current));
      setSession(null);
    },
  };
};
