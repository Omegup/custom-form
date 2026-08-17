/**
 * Heading + multiple-panel chrome for fill/review demos.
 * Add instance is host-owned; shown only while `response.setValue` is live.
 */
import type { ReactNode } from "react";
import { HeadingName, PanelBlock } from "../../demo-utils";
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
}) => <HeadingName name={formItem.params.name} />;

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
    <PanelBlock
      name={formItem.params.name}
      add={
        formItem.params.multiple && extra.response.setValue ? add : null
      }
    >
      {extra.children}
    </PanelBlock>
  );
};

export const panelRepeatChildren = (
  formItem: { params: { multiple: boolean } },
  extra: { response: ResponseSetter },
) => panelInstanceSuffixes(formItem.params.multiple, extra.response.value);
