import { useMemo, useState, type ReactNode } from "react";
import {
  FieldRow,
  SectionPanel,
  SectionsList,
} from "../../form-edit/demo/editFormDemoHelper";
import * as demo from "./formItemEditorDemoHelper";
import { itemLabel } from "./formItemEditorDemoHelper";
import type * as types from "./formItemEditorDemoTypes.t";
import * as lib from "./library";

export type ExtraAction = { label: string; onClick: () => void };

type PendingRemove = {
  rm: () => void;
  item: lib.FlatNestedItem<types.TypeNames, types.Params, types.Section>;
};

const randomId = () => `id_${Math.random().toString(36).slice(2, 7)}`;

const cloneFn: lib.Clone<
  types.TypeNames,
  types.Params,
  lib.ContextDom,
  types.Section
> = (subItems, _, allItems): types.FlatItems => {
  const names = allItems.flatMap((fi) =>
    "item" in fi && fi.item.type === "field" ? [fi.item.params.name] : [],
  );
  const texts = allItems.flatMap((fi) =>
    "item" in fi && fi.item.type === "heading" ? [fi.item.params.text] : [],
  );
  const titles = allItems.flatMap((fi) =>
    "item" in fi && fi.item.type === "panel" ? [fi.item.params.title] : [],
  );
  const uniq = (base: string, used: string[]) => {
    let n = 1;
    let next = `${base} (copy)`;
    while (used.includes(next)) {
      n += 1;
      next = `${base} (copy${n})`;
    }
    return next;
  };

  return subItems.map((fi) => {
    if ("item" in fi) {
      if (fi.item.type === "field") {
        return {
          item: {
            ...fi.item,
            id: randomId(),
            params: { name: uniq(fi.item.params.name, names) },
          },
          n: fi.n,
        };
      }
      if (fi.item.type === "heading") {
        return {
          item: {
            ...fi.item,
            id: randomId(),
            params: { text: uniq(fi.item.params.text, texts) },
          },
          n: fi.n,
        };
      }
      return {
        item: {
          ...fi.item,
          id: randomId(),
          params: { title: uniq(fi.item.params.title, titles) },
        },
        n: fi.n,
      };
    }
    if ("section" in fi) {
      return {
        section: { ...fi.section, id: randomId() },
      };
    }
    return fi;
  });
};

export const FormItemEditorFormTest = ({
  flatItems,
  updateArgs,
  extra,
}: {
  flatItems: types.FlatItems;
  updateArgs: (patch: Partial<types.StoryArgs>) => void;
  extra?: (item: types.ListItem) => ExtraAction[];
}) => {
  const [focused, setFocused] = useState<lib.AutoFocusState>(null);
  const [toRemove, setToRemove] = useState<PendingRemove | null>(null);

  const ctx = useMemo(
    () => lib.autofocusCtx<lib.ContextDom>(lib.branded({}), focused),
    [focused],
  );

  const applyItems = (newItems: types.FlatItems, newCtx: typeof ctx) => {
    if (newItems !== flatItems) updateArgs({ flatItems: newItems });
    setFocused(newCtx.focused);
  };

  const sections = useMemo(() => lib.consolidateSections(flatItems), [flatItems]);
  const [showDeleted, setShowDeleted] = useState(true);
  const jump = !showDeleted;
  const sectionOfItem = useMemo(
    () => lib.buildItemSectionDict(flatItems),
    [flatItems],
  );

  const actionsArgs = {
    items: flatItems,
    setItems: applyItems,
    ctx,
    sectionOfItem,
    setToRemove,
  };
  const itemActions = lib.getFormItemMoveActions(actionsArgs, cloneFn, jump);

  const renderItem = (item: types.ListItem): ReactNode => {
    if (item.header.deleted && !showDeleted) return null;
    const actions = itemActions(item);
    const fieldFocused = ctx.autoFocused(item.header.id);
    return (
      <div key={item.header.id}>
        <FieldRow
          name={itemLabel(item.header)}
          focused={fieldFocused}
          actions={actions}
          extra={extra?.(item) ?? []}
        />
        {item.children.length > 0 && (
          <demo.NestedColumns
            columns={item.children.map((column) =>
              column.map((child) => renderItem(child)),
            )}
          />
        )}
      </div>
    );
  };

  return (
    <>
      {toRemove && (
        <demo.RemoveAlert
          pending={toRemove}
          onConfirm={() => {
            toRemove.rm();
            setToRemove(null);
          }}
          onCancel={() => setToRemove(null)}
        />
      )}
      <button type="button" onClick={() => setShowDeleted(!showDeleted)}>
        {showDeleted ? "Hide deleted" : "Show deleted"}
      </button>
      <SectionsList>
        {sections.map((section) => {
          const sectionFocused = ctx.autoFocused(section.header.id);
          const sActions = lib.getSectionMoveActions(
            actionsArgs,
            cloneFn,
            section,
            jump,
          );
          return (
            <SectionPanel
              key={section.header.id}
              title={section.header.title}
              focused={sectionFocused}
              sectionActions={sActions}
              sectionExtra={[]}
              columns={section.items.map((column) =>
                column.map((item) => renderItem(item)),
              )}
            />
          );
        })}
      </SectionsList>
    </>
  );
};
