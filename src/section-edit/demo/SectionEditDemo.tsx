/**
 * Demo: section title / description / columns edit dialog.
 *
 * Composes `EditFormTest` (form-edit demo) with the `section-edit` library:
 * `sectionExtra` opens a session (`openSectionEditSession`), save commits via
 * `updateSectionInFlat`. Validation is plain, demo-owned logic — checking that
 * *this* dialog's `title`/`description` are non-empty needs no reusable
 * abstraction, since a host with different header fields would write its own
 * anyway (see section-edit/README.md).
 */
import { useState, type ReactNode } from "react";
import { EditFormTest } from "../../form-edit/demo/EditFormDemo";
import * as demo from "./sectionEditDemoHelper";
import * as types from "./sectionEditDemoTypes.t";
import * as lib from "./library";

const validate = (form: types.SectionForm): lib.Errors<types.SectionForm> => {
  const errors: lib.Errors<types.SectionForm> = {};
  if (!form.title.trim()) errors.title = "Title is required";
  if (!form.description.trim()) errors.description = "Description is required";
  return errors;
};

/** Exported for the side-menu demo ("+ Add section" — `index: -1` session). */
export const SectionDialog = ({
  draft,
  title,
  onSave,
  onCancel,
}: {
  draft: { header: types.Section; cols: number };
  title?: ReactNode;
  onSave: (form: types.SectionForm) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState<types.SectionForm>({
    title: draft.header.title,
    description: draft.header.description,
    cols: draft.cols,
  });
  const [errors, setErrors] = useState<lib.Errors<types.SectionForm>>({});

  const save = () => {
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(form);
  };

  return (
    <demo.EditorDialog
      title={title ?? <>Edit section · {draft.header.title}</>}
      onCancel={onCancel}
      onSave={save}
      saveError={null}
    >
      <demo.TextField
        label="Title"
        value={form.title}
        error={errors.title ?? null}
        multiline={false}
        onChange={(title) => setForm((f) => ({ ...f, title }))}
      />
      <demo.TextField
        label="Description"
        multiline={true}
        value={form.description}
        error={errors.description ?? null}
        onChange={(description) => setForm((f) => ({ ...f, description }))}
      />
      <demo.SelectSectionColumns
        cols={form.cols}
        onChange={(cols) => setForm((f) => ({ ...f, cols }))}
      />
    </demo.EditorDialog>
  );
};

export const SectionEditDemo = ({
  heading,
  flatItems,
  updateArgs,
}: types.DemoProps) => {
  const [session, setSession] = useState<types.EditingSession | null>(null);

  return (
    <demo.FormContainer title={heading}>
      {session && (
        <SectionDialog
          draft={session.draft}
          onCancel={() => setSession(null)}
          onSave={(form) => {
            updateArgs({
              flatItems: lib.updateSectionInFlat(
                flatItems,
                session,
                {
                  ...session.draft.header,
                  title: form.title,
                  description: form.description,
                },
                form.cols,
              ),
            });
            setSession(null);
          }}
        />
      )}
      <EditFormTest
        flatItems={flatItems}
        updateArgs={updateArgs}
        sectionExtra={(section) => [
          {
            label: "Edit",
            onClick: () => setSession(lib.openSectionEditSession(section)),
          },
        ]}
      />
    </demo.FormContainer>
  );
};
