import type { ReactNode } from "react";

/**
 * Host section frame — title, description, and one node per column.
 * Fill and review both extend this; they do not paste the args.
 */
export type SectionLayoutChrome = {
  renderSection: (args: {
    deleted: boolean;
    title: string;
    description: string;
    i: number;
    multiSection: boolean;
    columns: ReactNode[];
  }) => ReactNode;
};
