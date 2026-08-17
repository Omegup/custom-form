/**
 * Fill slot walk — originals and reviewer follow-ups share one item renderer;
 * follow-ups sit under their origin via `renderFollowUpGroup`.
 */
import { Fragment, type ReactNode } from "react";
import type {
  MetaDom,
  ParamsDom,
  RecursiveFormItem,
  VariantsDom,
} from "./_deps";
import { emptyResponse, withIdSuffix } from "./_deps";
import { fillViewerExtra, renderFillClearIcon } from "./responderItemChrome";
import { followUpsForOrigin, oldById } from "./responderLookup";
import { responderState } from "./responderStatus";
import { usefulForFill } from "./responderVisibleItems";
import type { FillLive, FillWalk } from "./responderWalk.t";
import type { FillChrome } from "./types";

const renderFillItem = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  walk: FillWalk<TypeNames, Params, Variants, Meta>,
  item: RecursiveFormItem<TypeNames, Params, Meta>,
  index: number,
  parentDeleted: boolean,
  isFollowUpTree: boolean,
): ReactNode => {
  const q = item.header;
  const { live, chrome } = walk;
  const remark = oldById(live.old?.changes, q.id)?.comment ?? null;
  const oldValue = oldById(live.old?.values, q.id);
  const current = live.responses[q.id] ?? null;
  const value = current ?? oldValue;
  const editable = !oldValue || remark != null;
  const error = live.getError(q.id);
  const state = responderState({
    error,
    oldValue,
    remark,
    isFollowUpTree,
  });

  return live.renderFormItem({
    formItem: q,
    variant: live.variants[state],
    extra: fillViewerExtra({
      getChild: (suffix: string) => (
        <>
          {renderFillSlots(
            walk,
            item.children,
            suffix,
            q.deleted || parentDeleted,
          )}
        </>
      ),
      error,
      parentDeleted,
      index,
      icon: renderFillClearIcon(walk, q.id, oldValue, current),
      appendix: remark ? chrome.renderAppendix(remark) : null,
      setValue: editable
        ? (key, v) => {
            live.setResponse(q.id, {
              ...(value ?? emptyResponse()),
              [key]: v,
            });
          }
        : null,
      value: value || emptyResponse(),
      impRef: editable
        ? (ref) => {
            live.validators[q.id] = ref;
          }
        : null,
    }),
  });
};

const renderFillSlots = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  walk: FillWalk<TypeNames, Params, Variants, Meta>,
  cols: RecursiveFormItem<TypeNames, Params, Meta>[][],
  idSuffix: string,
  deleted: boolean,
): ReactNode[] =>
  cols.map((items, col) => (
    <Fragment key={col}>
      {items
        .filter((item) => usefulForFill(item, walk.live.responses))
        .map((item, index) => {
          const filled = withIdSuffix(item, idSuffix);
          const originId = filled.header.id;
          const followUps = followUpsForOrigin(walk.live.followUpItems, originId);
          return (
            <Fragment key={originId}>
              {renderFillItem(walk, filled, index, deleted, false)}
              {followUps.length
                ? walk.chrome.renderFollowUpGroup({
                    originId,
                    items: (
                      <>
                        {followUps.map((fu, fuIndex) => (
                          <Fragment key={fu.header.id}>
                            {renderFillItem(walk, fu, fuIndex, false, true)}
                          </Fragment>
                        ))}
                      </>
                    ),
                  })
                : null}
            </Fragment>
          );
        })}
    </Fragment>
  ));

export const renderFillColumns = <
  TypeNames extends string,
  Params extends ParamsDom<TypeNames>,
  Variants extends VariantsDom,
  Meta extends MetaDom,
>(
  chrome: FillChrome,
  live: FillLive<TypeNames, Params, Variants, Meta>,
  slots: RecursiveFormItem<TypeNames, Params, Meta>[][],
  parentDeleted: boolean,
): ReactNode[] =>
  renderFillSlots({ chrome, live }, slots, "", parentDeleted);
