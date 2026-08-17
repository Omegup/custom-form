import { ToolbarCheck } from "./ToolbarCheck";
import { ToneNote } from "./ToneNote";
import { Toolbar } from "./Toolbar";

export const ReviewToolbar = ({
  dirty,
  onSave,
  onRevert,
  showDeleted,
  onShowDeleted,
  statusLine,
  statusNote,
}: {
  dirty: boolean;
  onSave: () => void;
  onRevert: () => void;
  showDeleted: boolean;
  onShowDeleted: (checked: boolean) => void;
  statusLine: string;
  statusNote: string | null;
}) => (
  <Toolbar>
    <button type="button" onClick={onSave} disabled={!dirty}>
      Save changes
    </button>
    <button type="button" onClick={onRevert} disabled={!dirty}>
      Cancel
    </button>
    <ToolbarCheck checked={showDeleted} onChange={onShowDeleted}>
      Show deleted sections
    </ToolbarCheck>
    <ToneNote tone="meta">{statusLine}</ToneNote>
    {statusNote ? <ToneNote tone="ok">{statusNote}</ToneNote> : null}
  </Toolbar>
);
