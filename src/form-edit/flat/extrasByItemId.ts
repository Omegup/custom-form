/**
 * Walk consolidated section columns and key host extras by item id.
 * Host brands the extra; this only owns the recursive walk.
 */
export const extrasByItemId = <
  Item extends { header: { id: string }; children: Item[][] },
  Extra,
>(
  sections: ReadonlyArray<{ items: Item[][] }>,
  extra: (item: Item) => Extra,
): Map<string, Extra> => {
  const map = new Map<string, Extra>();
  const walk = (columns: Item[][]) => {
    for (const column of columns) {
      for (const item of column) {
        map.set(item.header.id, extra(item));
        walk(item.children);
      }
    }
  };
  for (const section of sections) walk(section.items);
  return map;
};
