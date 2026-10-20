export type ExtraAction = { label: string; onClick: () => void };

export type MoveActionsChrome = {
  up: (() => void) | null;
  down: (() => void) | null;
  clone: (() => void) | null;
  remove: (() => void) | null;
  restore: (() => void) | null;
  isDeleted: boolean;
};

const TinyButton = ({
  label,
  onClick,
}: {
  label: string;
  onClick: (() => void) | null;
}) => (
  <button
    type="button"
    disabled={!onClick}
    onClick={onClick ?? undefined}
    style={{ padding: "2px 7px", fontSize: 11, opacity: onClick ? 1 : 0.3 }}
  >
    {label}
  </button>
);

export const MoveBar = ({
  actions,
  extra,
}: {
  actions: MoveActionsChrome;
  extra: ExtraAction[];
}) => (
  <span style={{ display: "inline-flex", gap: 3 }}>
    {actions.isDeleted ? (
      <TinyButton label="Restore" onClick={actions.restore} />
    ) : (
      <>
        <TinyButton label="↑" onClick={actions.up} />
        <TinyButton label="↓" onClick={actions.down} />
        <TinyButton label="Clone" onClick={actions.clone} />
        <TinyButton label="Remove" onClick={actions.remove} />
        {extra.map(({ label, onClick }) => (
          <TinyButton key={label} label={label} onClick={onClick} />
        ))}
      </>
    )}
  </span>
);
