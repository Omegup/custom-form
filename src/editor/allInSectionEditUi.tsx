import { useState, type FormEvent } from "react";
import {
  validateSectionForm,
  type Errors,
  type SectionEditDialogProps,
  type SectionEditForm,
  type UseSectionEditDialog,
} from "../section-edit";
import type { EditFormCtx, EditFormSection } from "../form-edit/fixtures";
import type { SectionEditDialogArgs } from "./types";

const useSectionEditDialog: UseSectionEditDialog<
  EditFormSection,
  SectionEditForm,
  EditFormCtx
> = (props, { validate }) => {
  const {
    section: { header, cols },
    onSave,
  } = props;

  const [section, setSection] = useState<SectionEditForm>({
    title: header.title,
    description: header.description,
    cols,
  });
  const [errors, setErrors] = useState<Errors<SectionEditForm>>({});

  const setValue = <K extends keyof SectionEditForm>(
    key: K,
    value: SectionEditForm[K],
  ) => {
    setSection((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const isValid = (key: "title" | "description") => !errors[key];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(section);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSave({
        header: {
          ...header,
          title: section.title,
          description: section.description,
        },
        cols: section.cols,
      });
    }
  };

  return { section, setValue, onSubmit, isValid };
};

export const AllInSectionEditDialog = ({
  args,
}: {
  args: SectionEditDialogArgs<EditFormCtx, EditFormSection>;
}) => {
  const validate = validateSectionForm({
    title: "Title is required",
    description: "Description is required",
  });

  const { section, setValue, onSubmit, isValid } = useSectionEditDialog(
    {
      ctx: args.ctx,
      title: `Edit ${args.section.header.title}`,
      onClose: args.onClose,
      onSave: args.onSave,
      section: args.section,
    },
    { validate },
  );

  return (
    <form
      onSubmit={onSubmit}
      style={{
        border: "1px solid #c9e6c9",
        borderRadius: 8,
        overflow: "hidden",
        maxWidth: 360,
        background: "#f0faf0",
        marginBottom: 12,
      }}
    >
      <div style={{ padding: "8px 12px", background: "#d4edd4", fontSize: 13 }}>
        <strong>Edit {args.section.header.title}</strong>
      </div>
      <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Title</span>
          <input
            value={section.title}
            onChange={(e) => setValue("title", e.target.value)}
            style={{
              padding: "6px 8px",
              borderRadius: 4,
              border: `1px solid ${isValid("title") ? "#ccc" : "#c00"}`,
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Description</span>
          <textarea
            value={section.description}
            onChange={(e) => setValue("description", e.target.value)}
            rows={3}
            style={{
              padding: "6px 8px",
              borderRadius: 4,
              border: `1px solid ${isValid("description") ? "#ccc" : "#c00"}`,
            }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, opacity: 0.7 }}>Columns</span>
          <input
            type="number"
            min={1}
            max={4}
            value={section.cols}
            onChange={(e) => setValue("cols", Number(e.target.value))}
            style={{ padding: "6px 8px", borderRadius: 4, border: "1px solid #ccc", width: 64 }}
          />
        </label>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
          padding: "8px 12px",
          borderTop: "1px solid #c9e6c9",
        }}
      >
        <button type="button" onClick={args.onClose}>
          Cancel
        </button>
        <button type="submit">Save</button>
      </div>
    </form>
  );
};

export type { SectionEditDialogProps };
