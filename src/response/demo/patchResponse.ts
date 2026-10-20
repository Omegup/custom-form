export const patchResponse = <R,>(
  bag: Record<string, R>,
  id: string,
  next: R | undefined,
): Record<string, R> => {
  if (next === undefined) {
    const { [id]: _, ...rest } = bag;
    return rest;
  }
  return { ...bag, [id]: next };
};
