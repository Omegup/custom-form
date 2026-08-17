import type { ReactNode } from "react";
import { DisplayColumns } from "./DisplayColumns";

export const SplitColumns = ({ columns }: { columns: ReactNode[] }) => (
  <DisplayColumns gap={20} columns={columns} />
);
