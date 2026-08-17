import type { ReactNode } from "react";
import { Row } from "./Row";
import { SendButton } from "./SendButton";
import { Stack } from "./Stack";
import { ToneNote } from "./ToneNote";

export const FillActions = ({
  onValidate,
  onSend,
  canSend,
  savedNote,
  statusNote,
  children,
}: {
  onValidate: () => void;
  onSend: () => void;
  canSend: boolean;
  savedNote: string | null;
  statusNote: string | null;
  children: ReactNode;
}) => (
  <Stack gap={16}>
    {children}
    <Row gap={8} align="center" wrap={false} fontSize={null}>
      <button type="button" onClick={onValidate}>
        Validate
      </button>
      <SendButton onClick={onSend} enabled={canSend}>
        Send
      </SendButton>
      {savedNote ? <ToneNote tone="ok">{savedNote}</ToneNote> : null}
      {statusNote ? <ToneNote tone="quiet">{statusNote}</ToneNote> : null}
    </Row>
  </Stack>
);
