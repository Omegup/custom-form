import type { CSSProperties, ReactNode } from "react";
import { FieldViewerChrome } from "../../demo-utils";
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
      nameStyle={null}
    >
      <input
        value={value}
        onChange={(e) => setDataValue(e.target.value)}
        disabled={extra.response.setValue == null}
        style={{
          padding: "6px 8px",
          border: `1px solid ${border}`,
          borderRadius: 4,
          background: variant.background,
        }}
      />
      {err ? <span style={{ color: "#c00", fontSize: 12 }}>{err}</span> : null}
    </FieldViewerChrome>
  );
};
