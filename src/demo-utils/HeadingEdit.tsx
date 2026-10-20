import { Inline } from "./Inline";

export const HeadingEdit = ({
  title,
  edit,
}: {
  title: string;
  edit: null | false | (() => void);
}) => (
  <Inline gap={8} align="center">
    <strong>{title}</strong>
    {edit ? (
      <button type="button" onClick={edit}>
        Edit
      </button>
    ) : null}
  </Inline>
);
