export type MetaDom<T = unknown> = { meta: T };

export type Header<
  H,
  Meta extends MetaDom,
  NoMeta extends 0 | 1 = 0,
> = (NoMeta extends 1 ? {} : { meta: Meta["meta"] }) & {
  header: H;
};
export type Recursive<
  T,
  H,
  Meta extends MetaDom,
  NoMeta extends 0 | 1 = 0,
> = Header<H, Meta, NoMeta> & {
  children: Recursive<T, H, Meta, NoMeta>[][];
};

export type RecursiveT<
  T,
  Meta extends MetaDom,
  NoMeta extends 0 | 1 = 0,
> = Recursive<T, T, Meta, NoMeta>;
