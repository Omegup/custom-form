import { FieldLabel, HeadingLabel, PanelLabel, RequiredMark } from "../../demo-utils";

/** Design-list name chrome — field + star, heading, panel. One bag for every list demo. */
export const listViewers = {
  field: {
    viewer: ({
      props: { formItem },
    }: {
      props: { formItem: { params: { name: string; required: boolean } } };
    }) => (
      <>
        <FieldLabel name={formItem.params.name} />
        <RequiredMark required={formItem.params.required} />
      </>
    ),
  },
  heading: {
    viewer: ({
      props: { formItem },
    }: {
      props: { formItem: { params: { name: string } } };
    }) => <HeadingLabel name={formItem.params.name} />,
  },
  panel: {
    viewer: ({
      props: { formItem },
    }: {
      props: { formItem: { params: { name: string } } };
    }) => <PanelLabel name={formItem.params.name} />,
    repeatChildren: () => [""],
  },
};
