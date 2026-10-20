import { Row } from "./Row";
import { TextField } from "./TextField";

export const CommentComposer = ({
  value,
  onChange,
  onSave,
  onCancel,
  saveLabel,
  cancelLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
  cancelLabel: string;
}) => (
  <>
    <TextField
      label="Comment"
      value={value}
      error={null}
      multiline={true}
      onChange={onChange}
    />
    <Row gap={8} align="center" wrap={false} fontSize={null}>
      <button type="button" onClick={onSave}>
        {saveLabel}
      </button>
      <button type="button" onClick={onCancel}>
        {cancelLabel}
      </button>
    </Row>
  </>
);
