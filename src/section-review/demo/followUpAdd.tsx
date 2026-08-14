/**
 * 💬 follow-up type dropdown + unanswered drafts as design rows.
 * Shared by section-review, form-review, and form-response demos.
 */
import { useState } from "react";
import * as lib from "./library";

const MENU = [{ key: "field", title: "Field", icon: "✎" }] as const;

type FieldItem = {
  id: string;
  type: "field";
  deleted: boolean;
  params: { name: string; required: boolean };
};

type FieldDraft = {
  formItem?: { id: string; params: { name: string; required: boolean } };
};

export const FollowUpAdd = ({
  originId,
  onPick,
}: {
  originId: string;
  onPick: (payload: { formItem: FieldItem }) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        aria-label="Ask follow-up"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        💬
      </button>
      {open ? (
        <div
          style={{
            position: "absolute",
            right: 0,
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: 140,
            padding: 6,
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {MENU.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onPick({
                  formItem: lib.branded({
                    id: `${originId}-followup-${Date.now()}`,
                    type: "field",
                    deleted: false,
                    params: { name: "Follow-up field", required: false },
                  }),
                });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 10px",
                fontSize: 13,
                textAlign: "left",
                background: "white",
                border: "1px solid #eee",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              <span>{item.icon}</span>
              {item.title}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export const FollowUpDrafts = ({ entries }: { entries: FieldDraft[] }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 8,
      marginTop: 8,
      marginLeft: 8,
      padding: "8px 8px 8px 12px",
      borderLeft: "3px solid #e6b800",
      background: "#fffbeb",
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
    {entries.map((entry) => {
      const item = entry.formItem;
      if (!item) return null;
      return (
        <div
          key={item.id}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            padding: 8,
            background: "#fff",
            borderRadius: 4,
            border: "1px dashed #e6b800",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600 }}>
            {item.params.name}
            {item.params.required ? (
              <span style={{ color: "#b00020", marginLeft: 4 }}>*</span>
            ) : null}
          </span>
          <div
            style={{
              height: 28,
              borderRadius: 3,
              border: "1px dashed #ccc",
              background: "#fafafa",
            }}
          />
        </div>
      );
    })}
  </div>
);
