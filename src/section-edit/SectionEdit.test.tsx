/**
 * Demo: EditFormTest + section edit dialog.
 * Wires sectionExtra → open dialog → updateSectionInFlat on save.
 *
 * `useSectionEditDialog` lives here (demo-only). The package exports the
 * `UseSectionEditDialog` type + `validateSectionForm`; the host supplies the hook.
 */
import { useCallback, useState, type FormEvent } from "react";
import {
  container,
  EditFormTest,
  type EditFormCtx,
  type EditFormSection,
} from "../form-edit/EditForm.test";
import {
  validateSectionForm,
  updateSectionInFlat,
  type Errors,
  type SectionEditDialogProps,
  type SectionEditForm,
  type UseSectionEditDialog,
} from "./index";

// ── Domain types ──────────────────────────────────────────────────────────────

type Section = EditFormSection;
type Ctx = EditFormCtx;

type EditingSection = {
  header: Section;
  cols: number;
};

// ── Demo hook (host-supplied in real apps) ────────────────────────────────────

const useSectionEditDialog: UseSectionEditDialog<Section, SectionEditForm, Ctx> = (
  props,
  { validate },
) => {
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

// ── Dialog ────────────────────────────────────────────────────────────────────

const SectionEditDialog = ({
  editing,
  ctx,
  onSave,
  onClose,
}: {
  editing: EditingSection;
  ctx: Ctx;
  onSave: SectionEditDialogProps<Section, Ctx>["onSave"];
  onClose: () => void;
}) => {
  const validate = validateSectionForm({
    title: "Title is required",
    description: "Description is required",
  });

  const { section, setValue, onSubmit, isValid } = useSectionEditDialog(
    {
      ctx,
      title: `Edit ${editing.header.title}`,
      onClose,
      onSave,
      section: editing,
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
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          background: "#d4edd4",
          fontSize: 13,
        }}
      >
        <strong>Edit {editing.header.title}</strong>
      </div>
      <div
        style={{
          padding: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
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
            style={{
              padding: "6px 8px",
              borderRadius: 4,
              border: "1px solid #ccc",
              width: 64,
            }}
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
        <button
          type="button"
          onClick={onClose}
          style={{ padding: "4px 12px", borderRadius: 4 }}
        >
          Cancel
        </button>
        <button type="submit" style={{ padding: "4px 12px", borderRadius: 4 }}>
          Save
        </button>
      </div>
    </form>
  );
};

// ── Test UI ───────────────────────────────────────────────────────────────────

export const SectionEditTest = () => {
  const [editing, setEditing] = useState<EditingSection | null>(null);

  const openEditor = useCallback((section: Section, cols: number) => {
    setEditing({ header: section, cols });
  }, []);

  const closeEditor = useCallback(() => setEditing(null), []);

  return (
    <EditFormTest
      sectionExtra={(section, { cols }) => [
        { label: "Edit", onClick: () => openEditor(section, cols) },
      ]}
      renderLayout={({ sections, alert, details, ctx, setFlatItems }) => (
        <>
          {alert}
          {editing && (
            <SectionEditDialog
              editing={editing}
              ctx={ctx}
              onClose={closeEditor}
              onSave={({ header, cols }) => {
                setFlatItems((prev) =>
                  updateSectionInFlat(prev, header.id, {
                    title: header.title,
                    description: header.description,
                  }, cols),
                );
                closeEditor();
              }}
            />
          )}
          {sections}
          {details}
        </>
      )}
    />
  );
};

export const SectionEditDemo = () =>
  container("Section edit", <SectionEditTest />);
