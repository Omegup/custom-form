import type { ReactNode } from "react";
import { Stack } from "./Stack";

export const SectionHeading = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Stack gap={12}>
    <h3 style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>{title}</h3>
    {children}
  </Stack>
);
