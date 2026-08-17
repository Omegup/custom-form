import { FeedbackStrip } from "./FeedbackStrip";
import { GrowInput } from "./GrowInput";
import { TintButton } from "./TintButton";

export const FeedbackPanel = ({
  comment,
  onComment,
  canRequest,
  canApprove,
  canReject,
  onRequest,
  onApprove,
  onReject,
}: {
  comment: string;
  onComment: (value: string) => void;
  canRequest: boolean;
  canApprove: boolean;
  canReject: boolean;
  onRequest: () => void;
  onApprove: () => void;
  onReject: () => void;
}) => (
  <FeedbackStrip>
    <strong>Feedback</strong>
    <GrowInput
      value={comment}
      onChange={onComment}
      placeholder="Optional comment"
    />
    <button type="button" onClick={onRequest} disabled={!canRequest}>
      Request changes
    </button>
    <TintButton
      onClick={onApprove}
      disabled={!canApprove}
      color={canApprove ? "#1b7a36" : null}
    >
      Approve
    </TintButton>
    <TintButton
      onClick={onReject}
      disabled={!canReject}
      color={canReject ? "#a40" : null}
    >
      Reject
    </TintButton>
  </FeedbackStrip>
);
