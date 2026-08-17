import type { ReactNode } from "react";

export type FormHeader = {
  title: string;
  description: string | null;
};

/** Host form frame — title block plus stacked sections. Fill and review both extend this. */
export type FormLayoutChrome = {
  renderHeader: (header: FormHeader) => ReactNode;
  renderForm: (args: {
    header: ReactNode | null;
    sections: ReactNode;
    children: ReactNode | null;
  }) => ReactNode;
};
