import type { CSSProperties, ReactElement, ReactNode } from "react";
import type * as types from "./allInDemoTypes.t";
import * as lib from "./library";

/** Mute deleted titles via color — never CSS opacity (that fades nested follow-ups). */
const MUTED = { label: "#777", value: "#666" } as const;

export const renderMutedSection = ({
  deleted,
  title,
  description,
  i,
  multiSection,
  columns,
}: {
  deleted: boolean;
  title: string;
  description: string;
  i: number;
  multiSection: boolean;
  columns: ReactNode[];
}) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ marginBottom: 12 }}>
      <h3
        style={{
          margin: "0 0 4px",
          fontSize: 18,
          fontWeight: 600,
          color: deleted ? MUTED.label : undefined,
        }}
      >
        {multiSection ? `${i + 1}. ${title}` : title}
      </h3>
      {description ? (
        <p
          style={{
            margin: 0,
            color: deleted ? MUTED.value : "#555",
            fontSize: 14,
          }}
        >
          {description}
        </p>
      ) : null}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {columns.map((col, idx) => (
        <div
          key={idx}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          {col}
        </div>
      ))}
    </div>
  </div>
);

export const panelRepeatChildren = (
  formItem: lib.TypedFormItem<types.Params, "panel">,
  extra: { response: lib.ResponseSetter },
): string[] =>
  lib.panelInstanceSuffixes(formItem.params.multiple, extra.response.value);

const panelShellStyle = (borderColor: string): CSSProperties => ({
  display: "flex",
  gap: 12,
  paddingLeft: 8,
  borderLeft: `2px solid ${borderColor}`,
});

export const PanelBody = ({
  formItem,
  extra,
  borderColor,
  readOnly,
  badge,
  titleColor,
}: {
  formItem: lib.TypedFormItem<types.Params, "panel">;
  extra: {
    children: ReactElement[];
    response: lib.ResponseSetter;
    appendix?: ReactNode;
    icon?: ReactNode;
  };
  borderColor: string;
  readOnly: boolean;
  badge: ReactNode;
  titleColor?: string;
}) => {
  const multiple = formItem.params.multiple;
  const editable = !readOnly && extra.response.setValue != null;
  const suffixes = lib.panelInstanceSuffixes(multiple, extra.response.value);

  const addInstance = () => {
    if (!extra.response.setValue) return;
    const ids = lib.parsePanelInstanceIds(extra.response.value);
    extra.response.setValue(
      "data",
      lib.withPanelInstances(extra.response.value, [
        ...ids,
        lib.nextPanelInstanceId(extra.response.value),
      ]).data,
    );
  };

  const removeInstance = (instanceId: string) => {
    if (!extra.response.setValue) return;
    const ids = lib.parsePanelInstanceIds(extra.response.value).filter(
      (id) => id !== instanceId,
    );
    extra.response.setValue(
      "data",
      lib.withPanelInstances(extra.response.value, ids.length ? ids : ["0"]).data,
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <strong style={{ fontSize: 14, color: titleColor }}>
          {formItem.params.name || "(panel)"}
          {multiple ? " · multiple" : ""}
        </strong>
        {badge}
        {extra.icon}
      </span>
      {multiple ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {extra.children.map((child, i) => {
            const instanceId =
              lib.parsePanelInstanceIds(extra.response.value)[i] ?? String(i);
            return (
              <div
                key={suffixes[i] ?? i}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 12, color: "#666" }}>
                    Entry {i + 1}
                  </span>
                  {editable && suffixes.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeInstance(instanceId)}
                      style={{ fontSize: 12, color: "#a40" }}
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <div style={panelShellStyle(borderColor)}>{child}</div>
              </div>
            );
          })}
          {editable ? (
            <button
              type="button"
              onClick={addInstance}
              style={{ alignSelf: "flex-start" }}
            >
              + Add entry
            </button>
          ) : null}
        </div>
      ) : (
        <div style={panelShellStyle(borderColor)}>{extra.children}</div>
      )}
      {extra.appendix}
    </div>
  );
};
