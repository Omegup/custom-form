/** Live rows, plus deleted rows that still have an answer. */
export const usefulForReview = (
  item: { header: { id: string; deleted: boolean } },
  isAnswered: (id: string) => boolean,
): boolean => !item.header.deleted || isAnswered(item.header.id);
