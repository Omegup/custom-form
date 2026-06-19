import type { MoveActions } from "./MoveActions.t";

export type RawActions<T, Ctx> = {
  index: number;
  total: number;
  items: T[];
  ctx: Ctx;
  setItems: (items: T[], ctx: Ctx) => void;
  highlight?: (x: T, ctx: Ctx) => { item: T; ctx: Ctx };
  clone: () => T[];
  isDeleted: (x: T) => boolean;
  markAsDeleted: (x: T, deleted: boolean) => { item: T; ctx: Ctx };
  min?: number;
  setToRemove?: (remove: () => void) => () => void;
};

export const makeActions = <T, E, Ctx>(
  {
    clone,
    index,
    total,
    items,
    setItems,
    isDeleted,
    markAsDeleted,
    min = 0,
    ctx,
    highlight = (x) => ({ ctx, item: x }),
    setToRemove = (x) => x,
  }: RawActions<T, Ctx>,
  extra: E,
  {
    next = (i) => i + 1,
    previous = (i) => i - 1,
  }: Partial<
    Record<"next" | "previous", (i: number, items: readonly T[]) => number>
  > = {},
): MoveActions & E => ({
  ...extra,
  isDeleted: isDeleted(items[index]),
  clone: () => {
    const [first, ...more] = clone();
    const f = highlight(first, ctx);
    setItems(items.toSpliced(index + total, 0, f.item, ...more), f.ctx);
  },
  remove:
    items.toSpliced(index, total).filter((x) => !isDeleted(x)).length < min
      ? null
      : setToRemove(() => {
          const deleted = markAsDeleted(items[index], true);
          setItems(items.toSpliced(index, 1, deleted.item), deleted.ctx);
        }),
  restore: () => {
    const x = markAsDeleted(items[index], false);
    setItems(items.toSpliced(index, 1, x.item), x.ctx);
  },
  up: !items.slice(0, index).every(isDeleted)
    ? () => {
        let i = index;
        const items2 = [...items];
        const stored = items2.slice(i, i + total);
        const x = highlight(stored[0], ctx);
        stored[0] = x.item;
        const prepare = () => {
          const src = previous(i, items2);
          const deleted = isDeleted(items2[src]);
          return { src, deleted };
        };
        const stepUp = (src: number) => {
          const targetEnd = i + total;
          const step = i - src;
          items2.copyWithin(targetEnd - step, src, i);
          i = src;
        };
        while (true) {
          const { src, deleted } = prepare();
          stepUp(src);
          if (!deleted) break;
        }
        while (true) {
          if (!i) break;
          const { src, deleted } = prepare();
          if (!deleted) break;
          stepUp(src);
        }
        items2.splice(i, total, ...stored);
        setItems(items2, x.ctx);
      }
    : null,

  down: !items.slice(index + total).every(isDeleted)
    ? () => {
        const items2 = [...items];
        let i = index;
        const stored = items2.slice(i, i + total);
        const x = highlight(stored[0], ctx);
        stored[0] = x.item;

        while (true) {
          const src = i + total;
          let srcNext = next(src, items2);
          const srcEnd = srcNext == -1 ? items2.length : srcNext;
          items2.copyWithin(i, src, srcEnd);
          const deleted = isDeleted(items2[i]);
          i += srcEnd - src;
          if (!deleted) break;
        }
        items2.splice(i, total, ...stored);
        setItems(items2, x.ctx);
      }
    : null,
});
