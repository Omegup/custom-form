import { useCallback, useState } from "react";
import type { AdditionalChanges, ParamsDom } from "./_deps";
import { appendFeedback, lastAnsweredAt, saveAdditionalQuestions } from "./review";
import type { FeedbackStatus, FormResponseDoc } from "./types";

export const useFormResponseReview = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
>({
  doc,
  setDoc,
  now,
}: {
  doc: FormResponseDoc<TypeNames, Params> | null;
  setDoc: (next: FormResponseDoc<TypeNames, Params>) => void;
  now: () => Date;
}) => {
  const [savedChanges, setSavedChanges] = useState(
    () => JSON.stringify(doc?.changes ?? {}),
  );

  const changes = doc?.changes ?? {};
  const dirty = doc != null && savedChanges !== JSON.stringify(changes);

  const setChanges = useCallback(
    (next: AdditionalChanges<TypeNames, Params>) => {
      if (!doc) return;
      setDoc({ ...doc, changes: next });
    },
    [doc, setDoc],
  );

  const save = useCallback(() => {
    if (!doc) return;
    const next = saveAdditionalQuestions(doc, now());
    setSavedChanges(JSON.stringify(doc.changes));
    setDoc(next);
  }, [doc, now, setDoc]);

  const revert = useCallback(() => {
    if (!doc) return;
    setDoc({
      ...doc,
      changes: JSON.parse(savedChanges) as AdditionalChanges<
        TypeNames,
        Params
      >,
    });
  }, [doc, savedChanges, setDoc]);

  const submitFeedback = useCallback(
    (status: FeedbackStatus, comment?: string) => {
      if (!doc) return;
      setDoc(appendFeedback(doc, status, comment, now()));
    },
    [doc, now, setDoc],
  );

  return {
    dirty,
    save,
    revert,
    submitFeedback,
    setChanges,
    lastAnsweredIso: lastAnsweredAt(doc?.feedbackHistory ?? []),
  };
};
