import type { ParamsDom, SomeFormItem } from "../form/form.t";
import type { Header, Indexed } from "../Recursive.t";
import type { FlatFormItems } from "./actions/flat-form.t";
import type { SectionDom, SectionWithItems } from "./section.t";


type CompactRecursive<T> = T & {
  children: CompactRecursive<T>[][]
}

type ToBeRecursive<TypeNames extends string, Params extends ParamsDom<TypeNames>, ItemHeader> = {
  header: SomeFormItem<TypeNames, Params>
  children: CompactRecursive<ItemHeader>[][]
  currentSlot: CompactRecursive<ItemHeader>[]
  total: number
  index: number
  n: number
}

export const customConsolidateSections = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
  ItemHeader,
  SectionHeader,
>(
  flattened: FlatFormItems<TypeNames, Params, SectionConfig>,
  mapHeader: (item: Header<SomeFormItem<TypeNames, Params>>) => ItemHeader,
  mapSection: (section: Indexed & { header: SectionConfig }) => SectionHeader,
) => {
  const sections: (SectionHeader & { items: CompactRecursive<ItemHeader>[][] })[] = []
  const itemStack: ToBeRecursive<TypeNames, Params, ItemHeader>[] = []
  const item0 = flattened[0]
  if (!item0 || !("section" in item0)) throw new Error("First item must be a section")
  let lastSection: {
    section: Indexed & { header: SectionConfig }
    items: CompactRecursive<ItemHeader>[][]
  } = { section: { header: item0.section, index: 0, total: 1 }, items: [[]] }
  const pushLastSection = () => {
    sections.push({ ...mapSection(lastSection.section), items: lastSection.items })
  }

  flattened.slice(1).forEach((item, i) => {
    const index = i + 1
    if ("section" in item) {
      pushLastSection()
      lastSection = { section: { header: item.section, index, total: 1 }, items: [[]] }
    } else if ("item" in item) {
      itemStack.push({
        header: item.item,
        children: [],
        currentSlot: [],
        total: 1 + item.n,
        n: item.n,
        index,
      })
    } else if ("end" in item) {
      const lastItem = itemStack.at(-1)
      if (!lastItem) {
        lastSection.section.total += 1
        lastSection.items.push([])
      } else {
        lastItem.children.push(lastItem.currentSlot)
        lastItem.currentSlot = []
      }
    } else {
      //@ts-expect-error: This is a never type
      const _: never = item
      throw new Error("Unknown item type in question config")
    }
    const lastQuestion = itemStack.at(-1)
    if (lastQuestion) {
      const { total, index } = lastQuestion
      if (lastQuestion.children.length === lastQuestion.n) {
        itemStack.pop()
        const newLastQuestion = itemStack.at(-1)
        const header: ItemHeader = mapHeader({
          header: lastQuestion.header,
          index,
          total,
          sIndex: sections.length,
        })
        const q: CompactRecursive<ItemHeader> = {
          ...header,
          children: lastQuestion.children,
        }
        if (newLastQuestion) {
          newLastQuestion.currentSlot.push(q)
          newLastQuestion.total += total
        } else {
          lastSection.items.at(-1)!.push(q)
          lastSection.section.total += total
        }
      }
    }
  })
  pushLastSection()
  return sections
}

export const consolidateSections = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  SectionConfig extends SectionDom,
>(
  flattened: FlatFormItems<TypeNames, Params, SectionConfig>,
): SectionWithItems<TypeNames, Params, SectionConfig>[] =>
  customConsolidateSections(
    flattened,
    item => item,
    section => section,
  )

