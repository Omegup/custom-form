/**
 * Demo: section title / description / columns edit dialog.
 *
 * Composes `EditFormTest` (form-edit demo) with the `section-edit` library:
 * `sectionExtra` opens a session (`openSectionEditSession`), the dialog
 * validates with `validateSectionForm`, save commits via `updateSectionInFlat`.
 */
import { useState } from "react";
import { EditFormTest } from "../../form-edit/demo/EditFormDemo";
import * as demo from "./sectionEditDemoHelper";
import * as types from "./sectionEditDemoTypes.t";
import * as lib from "./library";

const validate = lib.validateSectionForm({
  title: "Title is required",
  description: "Description is required",
});

const SectionDialog = ({
  session,
  onSave,
  onCancel,
}: {
  session: types.EditingSession;
  onSave: (form: lib.SectionEditForm) => void;
  onCancel: () => void;
}) => {
  const [form, setForm] = useState<lib.SectionEditForm>({
    title: session.draft.header.title,
    description: session.draft.header.description,
    cols: session.draft.cols,
  });
  const [errors, setErrors] = useState<lib.Errors<lib.SectionEditForm>>({});

  const save = () => {
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSave(form);
  };

  return (
    <demo.EditorDialog
      title={<>Edit section · {session.draft.header.title}</>}
      onCancel={onCancel}
      onSave={save}
    >
      <demo.TextField
        label="Title"
        value={form.title}
        error={errors.title ?? null}
        onChange={(title) => setForm((f) => ({ ...f, title }))}
      />
      <demo.TextField
        label="Description"
        multiline
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
          session={session}
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
