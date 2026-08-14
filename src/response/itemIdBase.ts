/** Strip a panel-instance suffix (`id:0` → `id`). Exact ids are unchanged. */
export const itemIdBase = (id: string): string => {
  const i = id.lastIndexOf(":");
  return i >= 0 ? id.slice(0, i) : id;
};
