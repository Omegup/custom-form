/**
 * Heading + multiple-panel chrome for fill/review demos.
 * Add instance is host-owned; shown only while `response.setValue` is live.
 */
import type { CSSProperties, ReactNode, Ref } from "react";
import { HeadingName, PanelBlock } from "../../demo-utils";
import { FillFieldViewer } from "./FillFieldViewer";
import type { ResponseSetter, ViewerMethods } from "./library";
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

type FillFieldProps = {
  formItem: { params: { name: string; required: boolean } };
  extra: {
    impRef: Ref<ViewerMethods>;
    response: ResponseSetter;
    error: string | boolean | null;
    icon: ReactNode | null;
    appendix: ReactNode | null;
  };
  variant: {
    border: string;
    background: string;
    badge: ReactNode;
    shell: CSSProperties;
    errorBorder?: string;
  };
};

export const fillFieldView = ({ props }: { props: FillFieldProps }) => (
  <FillFieldViewer
    name={props.formItem.params.name}
    required={props.formItem.params.required}
    extra={props.extra}
    variant={{
      ...props.variant,
      errorBorder: props.variant.errorBorder ?? null,
    }}
  />
);

export const fillViewers = {
  field: { viewer: fillFieldView },
  heading: {
    viewer: headingView,
    repeatChildren: () => [""],
  },
  panel: {
    viewer: panelView,
    repeatChildren: panelRepeatChildren,
  },
};
