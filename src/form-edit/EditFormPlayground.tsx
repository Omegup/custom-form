import { container, EditFormTest } from "./EditFormHost";
import { EDIT_FORM_INITIAL } from "./fixtures";

export type EditFormPlaygroundProps = {
  /** Page heading shown above the edit form */
  heading: string;
};

export const EditFormPlayground = ({ heading }: EditFormPlaygroundProps) =>
  container(
    heading,
    <EditFormTest
      initialFlatItems={EDIT_FORM_INITIAL}
      renderLayout={({ sections, alert, details }) => (
        <>
          {alert}
          {sections}
          {details}
        </>
      )}
    />,
  );
