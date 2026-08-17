/** Field-viewer required mark — compose in the field viewer, not list chrome. */
export const RequiredMark = ({ required }: { required: boolean }) =>
  required ? " *" : null;
