export type Indexed = { index: number; total: number }

export type Header<T> = Indexed & { header: T; sIndex: number }

export type Recursive<T, H = T> = Header<H> & {
  children: Recursive<T>[][]
}

export type CompactRecursive<T> = T & {
  children: CompactRecursive<T>[][]
}
