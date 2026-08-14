/**
 * Fill viewers + chrome. Shell comes from the form-responder demo;
 * All-in only overrides follow-up grouping and deleted-section mute
 * (opacity would fade nested follow-ups).
 */
import { useImperativeHandle, type Ref } from "react";
import { formChrome } from "../../form-responder/demo/formResponderDemoHelper";
import { followUpFieldVariant } from "../../form-item-editor/demo/itemVariants";
import { PanelBody, panelRepeatChildren, renderMutedSection } from "./allInPanel";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

export const fillChrome: lib.FormResponderChrome = {
  ...formChrome,
  renderForm: ({ header, sections, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {header}
      {sections}
      {children}
    </div>
  ),
  renderSection: renderMutedSection,
  renderFollowUpGroup: ({ items }) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginTop: 8,
        marginLeft: 8,
        padding: "8px 8px 8px 12px",
        borderLeft: `3px solid ${followUpFieldVariant.border}`,
        background: followUpFieldVariant.background,
        borderRadius: "0 6px 6px 0",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#b45309",
        }}
      >
        Follow-up
      </div>
      {items}
    </div>
  ),
};

const useFillFieldMethods = (
  impRef: Ref<lib.ViewerMethods> | null,
  response: lib.ResponseSetter,
  required: boolean,
  fieldRequired: string,
) => {
  useImperativeHandle(impRef, () => ({
    validate: (value) => {
      const text = value.data.value?.trim() ?? "";
      if (required && !text) return fieldRequired;
      return null;
    },
    update: (value) => value ?? lib.emptyResponse(),
  }));
  const setDataValue = (text: string) => {
    response.setValue?.("data", { ...response.value.data, value: text });
  };
  return { setDataValue, value: response.value.data.value ?? "" };
};

type FillViewerExtra = lib.ResponderExtra & {
  impRef: Ref<lib.ViewerMethods>;
} & lib.Children;

type FillHostExtra = lib.ResponderExtra & {
  impRef: Ref<lib.StrictViewerMethods>;
};

export const fillViewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  FillViewerExtra,
  FillHostExtra,
  lib.SectionResponderContext,
  string
> = {
  field: {
    viewer: ({ props: { formItem, extra, ctx, variant } }) => {
      const { setDataValue, value } = useFillFieldMethods(
        extra.impRef,
        extra.response,
        formItem.params.required,
        ctx.t("fieldRequired"),
      );
      const err = typeof extra.error === "string" ? extra.error : null;
      const border =
        extra.error && variant.errorBorder ? variant.errorBorder : variant.border;
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              ...variant.shell,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {formItem.params.name || "(unnamed field)"}
              {formItem.params.required ? " *" : ""}
              {variant.badge}
              {extra.icon}
            </span>
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
            {err ? (
              <span style={{ color: "#c00", fontSize: 12 }}>{err}</span>
            ) : null}
          </label>
          {extra.appendix}
        </div>
      );
    },
  },
  heading: {
    viewer: ({ props: { formItem, extra, variant } }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            ...variant.shell,
          }}
        >
          {formItem.params.name || "(heading)"}
          {variant.badge}
        </div>
        {extra.appendix}
      </div>
    ),
  },
  panel: {
    viewer: ({ props: { formItem, extra, variant } }) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={variant.shell}>
          <PanelBody
            formItem={formItem}
            extra={{ ...extra, appendix: undefined }}
            borderColor={variant.border}
            readOnly={false}
            badge={variant.badge}
          />
        </div>
        {extra.appendix}
      </div>
    ),
    repeatChildren: panelRepeatChildren,
  },
};
