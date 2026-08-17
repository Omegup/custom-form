import type { Response } from "./_deps";

/** Live rows, plus deleted rows that still have answer data. */
export const usefulForFill = (
  item: { header: { id: string; deleted: boolean } },
  responses: Record<string, Response>,
): boolean => {
  if (!item.header.deleted) return true;
  const res = responses[item.header.id];
  return res != null && Object.keys(res.data).length > 0;
};
