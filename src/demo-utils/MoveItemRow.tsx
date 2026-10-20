import type { ReactNode } from "react";
import { PulseRow } from "./PulseRow";
import { StrikeLabel } from "./StrikeLabel";
import type { MoveActionsChrome } from "./MoveBar";

const Btn = ({
  onClick,
  children,
}: {
  onClick: (() => void) | null;
  children: ReactNode;
}) => (
  <button disabled={onClick === null} onClick={onClick ?? undefined}>
    {children}
  </button>
);

export const MoveItemRow = ({
  name,
  struck,
  focused,
  actions,
}: {
  name: string;
  struck: boolean;
  focused: boolean | null;
  actions: MoveActionsChrome;
}) => (
  <PulseRow focused={focused}>
    <StrikeLabel strike={struck}>{name}</StrikeLabel>
    {actions.isDeleted && actions.restore ? (
      <Btn onClick={actions.restore}>Undo</Btn>
    ) : (
      <>
        <Btn onClick={actions.clone}>Clone</Btn>
        <Btn onClick={actions.remove}>Remove</Btn>
        <Btn onClick={actions.up}>Up</Btn>
        <Btn onClick={actions.down}>Down</Btn>
      </>
    )}
  </PulseRow>
);
