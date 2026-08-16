/**
 * Heading + multiple-panel chrome for fill/review demos.
 * Add instance is host-owned; shown only while `response.setValue` is live.
 */
import type { ReactNode } from "react";
import type { ResponseSetter } from "./library";
import {
  nextPanelInstanceId,
  parsePanelInstanceIds,
  panelInstanceSuffixes,
  withPanelInstances,
} from "./library";

type NestExtra = {
  children: ReactNode;
  response: ResponseSetter;
};

export const headingView = ({
  props: { formItem },
}: {
  props: { formItem: { params: { name: string } } };
}) => <strong style={{ fontSize: 15 }}>{formItem.params.name}</strong>;

export const panelView = ({
  props: { formItem, extra },
}: {
  props: {
    formItem: { params: { name: string; multiple: boolean } };
    extra: NestExtra;
  };
}) => {
  const add = () => {
    const cur = extra.response.value;
    extra.response.setValue?.(
      "data",
      withPanelInstances(cur, [
        ...parsePanelInstanceIds(cur),
        nextPanelInstanceId(cur),
      ]).data,
    );
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontWeight: 600 }}>{formItem.params.name}</span>
      {extra.children}
      {formItem.params.multiple && extra.response.setValue ? (
        <button type="button" onClick={add} style={{ alignSelf: "flex-start" }}>
          + Add
        </button>
      ) : null}
    </div>
  );
};

export const panelRepeatChildren = (
  formItem: { params: { multiple: boolean } },
  extra: { response: ResponseSetter },
) => panelInstanceSuffixes(formItem.params.multiple, extra.response.value);
