import { FollowBar } from "./FollowBar";
import { ReviewPending } from "./ReviewPending";
import { ShowDeleted } from "./ShowDeleted";

export const FollowControls = ({
  reviewPending,
  onReviewPending,
  showDeleted,
  onShowDeleted,
}: {
  reviewPending: boolean;
  onReviewPending: (checked: boolean) => void;
  showDeleted: boolean | null;
  onShowDeleted: ((checked: boolean) => void) | null;
}) => (
  <FollowBar>
    <ReviewPending checked={reviewPending} onChange={onReviewPending} />
    {showDeleted != null && onShowDeleted != null ? (
      <ShowDeleted checked={showDeleted} onChange={onShowDeleted} />
    ) : null}
  </FollowBar>
);
