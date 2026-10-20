import type { ReactNode } from "react";
import { Row } from "./Row";

export const FollowBar = ({ children }: { children: ReactNode }) => (
  <Row gap={16} align="center" wrap={true} fontSize={14}>
    {children}
  </Row>
);
