import type { CSSProperties, ReactNode } from "react";
import { BoxedInput, FieldError, FieldViewerChrome } from "../../demo-utils";
import { useFieldMethods } from "./responseDemoHelper";
import type * as types from "./responseDemoTypes.t";
import type * as lib from "./library";

export const defaultFillVariant = {
  border: "#ccc",
  background: "#fff",
  badge: null,
  shell: {},
  errorBorder: "#c00",
} as const satisfies {
  border: string;
  background: string;
  badge: ReactNode;
  shell: CSSProperties;
  errorBorder: string;
};

export const FillFieldViewer = ({
  name,
  required,
  extra,
  variant,
}: {
  name: string;
  required: boolean;
  extra: {
    impRef: types.FieldExtra["impRef"];
    response: lib.ResponseSetter;
    error: string | boolean | null;
    icon: ReactNode | null;
    appendix: ReactNode | null;
  };
  variant: {
    border: string;
    background: string;
    badge: ReactNode;
    shell: CSSProperties;
    errorBorder: string | null;
  };
}) => {
  const { setDataValue, value } = useFieldMethods(
    extra.impRef,
    extra.response,
    required,
    name,
  );
  const err =
    typeof extra.error === "string"
      ? extra.error
      : extra.error
        ? "Invalid"
        : null;
  const border =
    extra.error && variant.errorBorder ? variant.errorBorder : variant.border;
  return (
    <FieldViewerChrome
      name={name}
      required={required}
      badge={variant.badge}
      icon={extra.icon}
      appendix={extra.appendix}
      shell={variant.shell}
      muted={false}
      emphasis={false}
    >
      <BoxedInput
        value={value}
        onChange={setDataValue}
        disabled={extra.response.setValue == null}
        border={border}
        background={variant.background}
      />
      {err ? <FieldError>{err}</FieldError> : null}
    </FieldViewerChrome>
  );
};
