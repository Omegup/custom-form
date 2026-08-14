import { useCallback, useMemo, useState, type RefObject } from "react";
import type {
  ParamsDom,
  Response,
  SectionDom,
  SectionMetaDom,
  SectionWithItems,
  MetaDom,
} from "./_deps";
import { collectFormItemIds } from "./_deps";
import { remarkOnlyChanges } from "./changes";
import {
  followUpItemIds,
  followUpsByOrigin,
  unansweredFollowUpIds,
} from "./followUps";
import { buildSend, canSend } from "./send";
import type { FormResponseDoc, FormResponseValidator } from "./types";
import { formResponseValues } from "./values";

export const useFormResponseSend = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  SectionMeta extends SectionMetaDom,
  Meta extends MetaDom,
>({
  doc,
  draft,
  setDraft,
  sections,
  validatorRef,
  now,
}: {
  doc: FormResponseDoc<TypeNames, Params> | null;
  draft: Record<string, Response>;
  setDraft: (next: Record<string, Response>) => void;
  sections: SectionWithItems<
    TypeNames,
    Params,
    SectionConfig,
    SectionMeta,
    Meta
  >[];
  validatorRef: RefObject<FormResponseValidator | null>;
  now: () => Date;
}) => {
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const followUpItems = useMemo(
    () => followUpsByOrigin(doc?.changes ?? {}),
    [doc?.changes],
  );
  const followUpIds = useMemo(
    () => followUpItemIds(doc?.changes ?? {}),
    [doc?.changes],
  );
  const unanswered = useMemo(
    () => unansweredFollowUpIds(doc, followUpIds),
    [doc, followUpIds],
  );

  const old = useMemo(() => {
    if (!doc) return null;
    return {
      values: formResponseValues(doc),
      changes: remarkOnlyChanges(doc.changes),
    };
  }, [doc]);

  const setResponse = useCallback(
    (id: string, next?: Response) => {
      if (next === undefined) {
        const { [id]: _, ...rest } = draft;
        setDraft(rest);
        return;
      }
      setDraft({ ...draft, [id]: next });
    },
    [draft, setDraft],
  );

  const validate = useCallback(() => {
    const ref = validatorRef.current;
    if (!ref) return {};
    const prior = doc ? formResponseValues(doc) : {};
    const keys = ref.getKeys();
    const keyed = Object.fromEntries(
      keys.map((k) => [k, draft[k] ?? prior[k]]),
    ) as Record<string, Response>;
    const nextErrors = ref.validate(keyed);
    setErrors(nextErrors);
    return nextErrors;
  }, [doc, draft, validatorRef]);

  const send = useCallback((): FormResponseDoc<TypeNames, Params> | null => {
    const ref = validatorRef.current;
    if (!ref) return null;
    if (doc && !canSend(doc)) return null;

    const prior = doc ? formResponseValues(doc) : {};
    const keys = ref.getKeys();
    if (!doc && keys.length === 0) return null;

    const keyed = Object.fromEntries(
      keys.map((k) => [k, draft[k] ?? prior[k]]),
    ) as Record<string, Response>;
    if (keys.length > 0) {
      const nextErrors = ref.validate(keyed);
      setErrors(nextErrors);
      if (Object.values(nextErrors).some((e) => e != null && e !== "")) {
        return null;
      }
    }

    const updated = keys.length > 0 ? ref.update(keyed) : {};
    const designIds = sections.flatMap((s) => collectFormItemIds(s.items));
    return buildSend({
      doc,
      draft,
      keys,
      updated,
      designIds,
      now: now(),
    });
  }, [doc, draft, now, sections, validatorRef]);

  return {
    canSend: canSend(doc),
    send,
    validate,
    errors,
    setResponse,
    old,
    followUpItems,
    unansweredFollowUpIds: unanswered,
  };
};
