import type { MoveActions } from "./_deps";



export type ActionsWithEdit = MoveActions & {
  edit: () => void;
  resetAutofocus: () => void;
};

