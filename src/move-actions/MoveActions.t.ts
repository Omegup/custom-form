export type MoveActions = {
  up: null | (() => void);
  down: null | (() => void);
  clone: null | (() => void);
  remove: null | (() => void);
  restore: null | (() => void);
  isDeleted: boolean;
};
