import type { ReactNode } from "react";
import { ConfirmBanner, EditorDialog, TextField } from "../../demo-utils";
import {
  FieldLabel,
  HeadingLabel,
  PanelLabel,
  RequiredMark,
  SectionsList,
  pendingRemoveCopy,
  renderListCard,
} from "../../form-edit/demo/editFormDemoHelper";
import { MENU_ITEMS, randomId } from "../../side-menu/demo/fixtures";
import { renderAddFormItem } from "../../side-menu/demo/sideMenuDemoHelper";
import { columnsChrome } from "../../section-view/demo/sectionViewDemoHelper";
import type * as types from "./formItemEditorDemoTypes.t";
import formItemEditorDemoSource from "./FormItemEditorDemo.tsx?raw";
import formItemEditorDemoTypesSource from "./formItemEditorDemoTypes.t.ts?raw";
import { defaultVariants } from "./itemVariants";
import * as lib from "./library";

export type { StoryArgs } from "./formItemEditorDemoTypes.t";
export { EditorDialog, TextField };

// ── Storybook docs (`?raw` of types + integration) ────────────────────────────

const withFileHeader = (path: string, source: string) =>
  `// ── ${path} ──\n${source.trimEnd()}`;

export const FORM_ITEM_EDITOR_DEMO_SOURCE = [
  withFileHeader("formItemEditorDemoTypes.t.ts", formItemEditorDemoTypesSource),
  "",
  withFileHeader("FormItemEditorDemo.tsx", formItemEditorDemoSource),
].join("\n");

// ── Edit dialog + field chrome (orthogonal to the HOC showcase) ─────────────

export const NameField = ({
  value,
  error,
  onChange,
}: {
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}) => (
  <TextField
    label="Name"
    value={value}
    error={error}
    multiline={false}
    onChange={onChange}
  />
);

/**
 * School `editors/required` `renderRequired` — Switch toggling
 * `params.required`. Demo chrome only (library stays host-agnostic).
 */
export const RequiredToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (required: boolean) => void;
}) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      marginTop: 4,
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    Required
  </label>
);

/**
 * School `question()` slice for required — wrap a field editor so the
 * Required toggle sits below the domain fields (same seam as
 * `props.render(renderRequired())`).
 */
export const wrapWithRequired =
  (
    Editor: (props: types.FieldEditorProps) => ReactNode,
  ): ((props: types.FieldEditorProps) => ReactNode) =>
  (props) => (
    <>
      <Editor {...props} />
      <RequiredToggle
        checked={props.flatFormItem.item.params.required}
        onChange={(required) =>
          props.setFormItemParam(() => ["required", required])
        }
      />
    </>
  );

/** School panel `multiple` — student may add many answer rows. */
export const MultipleToggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (multiple: boolean) => void;
}) => (
  <label
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      marginTop: 4,
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    Multiple answers
  </label>
);

export const wrapWithMultiple =
  (
    Editor: (props: types.PanelEditorProps) => ReactNode,
  ): ((props: types.PanelEditorProps) => ReactNode) =>
  (props) => (
    <>
      <Editor {...props} />
      <MultipleToggle
        checked={props.flatFormItem.item.params.multiple}
        onChange={(multiple) =>
          props.setFormItemParam(() => ["multiple", multiple])
        }
      />
    </>
  );

const MAX_NAME_LEN = 10;

export const NameLengthHint = ({ name }: { name: string }) => (
  <p
    style={{
      margin: 0,
      fontSize: 11,
      opacity: name.length > MAX_NAME_LEN ? 1 : 0.55,
    }}
  >
    {name.length}/{MAX_NAME_LEN} characters
    {name.length > MAX_NAME_LEN ? " — too long" : ""}
  </p>
);

export { MAX_NAME_LEN };

const MIN_HEADING_LEN = 3;

export const HeadingLengthHint = ({ text }: { text: string }) => (
  <p
    style={{
      margin: 0,
      fontSize: 11,
      opacity: text.trim().length < MIN_HEADING_LEN ? 1 : 0.55,
    }}
  >
    {text.trim().length}/{MIN_HEADING_LEN} characters minimum
    {text.trim().length < MIN_HEADING_LEN ? " — too short" : ""}
  </p>
);

export { MIN_HEADING_LEN };

export const PANEL_COL_OPTIONS = [1, 2] as const;

export const SelectColumns = ({
  cols,
  onChange,
}: {
  cols: number;
  onChange: (cols: number) => void;
}) => (
  <fieldset
    style={{
      margin: 0,
      padding: "8px 10px",
      border: "1px solid #ccc",
      borderRadius: 4,
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}
  >
    <legend style={{ fontSize: 12, opacity: 0.7, padding: "0 4px" }}>
      Columns (n)
    </legend>
    <div style={{ display: "flex", gap: 8 }}>
      {PANEL_COL_OPTIONS.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            flex: 1,
            padding: "8px 6px",
            borderRadius: 4,
            border: `2px solid ${cols === n ? "#3b82f6" : "#ccc"}`,
            background: cols === n ? "#eff6ff" : "white",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${n}, 1fr)`,
              gap: 3,
              height: 28,
              marginBottom: 4,
            }}
          >
            {Array.from({ length: n }, (_, i) => (
              <div
                key={i}
                style={{
                  background: cols === n ? "#93c5fd" : "#e5e7eb",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
          <span style={{ fontSize: 11 }}>
            {n} column{n > 1 ? "s" : ""}
          </span>
        </button>
      ))}
    </div>
    <p style={{ margin: 0, fontSize: 11, opacity: 0.6 }}>
      Decreasing columns merges trailing slots into the last column.
    </p>
  </fieldset>
);

/** School `editors/selectSection.tsx` `<Select>` — visible only when there's more than one section to choose from. */
export const SelectSection = ({
  sections,
  value,
  error,
  onChange,
}: {
  sections: types.SectionOption[];
  value: number;
  error: string | null;
  onChange: (index: number) => void;
}) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, opacity: 0.7 }}>Section</span>
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      style={{
        padding: "6px 8px",
        borderRadius: 4,
        border: `1px solid ${error ? "#c00" : "#ccc"}`,
      }}
    >
      <option value={-1} disabled>
        Choose a section…
      </option>
      {sections.map(({ index, title }) => (
        <option key={index} value={index}>
          {title}
        </option>
      ))}
    </select>
    {error && <span style={{ color: "#c00", fontSize: 12 }}>{error}</span>}
  </label>
);

const MIN_PANEL_TITLE_LEN = 2;

export const PanelTitleHint = ({ title }: { title: string }) => (
  <p
    style={{
      margin: 0,
      fontSize: 11,
      opacity: title.trim().length < MIN_PANEL_TITLE_LEN ? 1 : 0.55,
    }}
  >
    {title.trim().length}/{MIN_PANEL_TITLE_LEN} characters minimum
    {title.trim().length < MIN_PANEL_TITLE_LEN ? " — too short" : ""}
  </p>
);

export { MIN_PANEL_TITLE_LEN };

// ── List shell (`SectionFormItemHOC` + ColumnsEdit) ───────────────────────────

type CardExtra = types.ListExtra & lib.EditExtra & lib.Children;

const cloneFn: lib.Clone<
  types.TypeNames,
  types.Params,
  types.ListCtx,
  types.Section
> = (subItems, _, allItems) =>
  lib.cloneFlatItems(
    subItems,
    allItems,
    (name, n) => `${name} (copy${n})`,
    randomId,
    { rename: "first" },
  );

const useRenderAddItem = lib.makeUseRenderAddItem<types.TypeNames, types.Params>(
  (args) => (
    <lib.AddFormItem
      {...args}
      label="+ Add item"
      render={renderAddFormItem}
    />
  ),
  () => MENU_ITEMS,
  randomId,
);

const viewers: lib.Viewers<
  types.TypeNames,
  types.Params,
  types.Variants,
  CardExtra,
  types.ListExtra & lib.EditExtra,
  types.ListCtx,
  string
> = {
  field: {
    viewer: ({ props: { formItem } }) => (
      <>
        <FieldLabel name={formItem.params.name} />
        <RequiredMark required={formItem.params.required} />
      </>
    ),
  },
  heading: {
    viewer: ({ props: { formItem } }) => (
      <HeadingLabel name={formItem.params.name} />
    ),
  },
  panel: {
    viewer: ({ props: { formItem } }) => (
      <PanelLabel name={formItem.params.name} />
    ),
    repeatChildren: () => [""],
  },
};

const renderCard = (
  view: ReactNode,
  viewProps: lib.ViewerProps<
    types.Params,
    types.Variants,
    types.TypeNames,
    CardExtra,
    types.ListCtx
  >,
) => {
  const { extra, ctx, formItem } = viewProps;
  return renderListCard(view, {
    focused: ctx.autoFocused(formItem.id),
    actions: extra.actions,
    parentDeleted: extra.parentDeleted,
    nested: extra.children.length > 0 ? extra.children : null,
    extra: extra.parentDeleted ? [] : extra.extra,
  });
};

const SectionComponent = lib.SectionFormItemHOC<
  types.TypeNames,
  types.Params,
  types.Variants,
  types.Section,
  types.ListBaseCtx,
  types.ListExtra
>({
  viewers,
  useRenderAddItem,
  renderTitle: (props) => props.section.header.title,
  renderEdit: lib.createColumnsEdit(columnsChrome),
});

const emptyListExtra = (): types.ListExtra =>
  lib.branded<types.ListExtra, "viewer-extra">({
    actions: {
      up: null,
      down: null,
      clone: null,
      remove: null,
      restore: null,
      isDeleted: false,
    },
    extra: [],
  });

export const FormItemEditorFormTest = ({
  flatItems,
  updateArgs,
  extra,
}: {
  flatItems: types.FlatItems;
  updateArgs: (patch: Partial<types.StoryArgs>) => void;
  extra: (item: types.ListItem) => types.ExtraAction[];
}) => {
  const session = lib.useFlatListSession({
    flatItems,
    setFlatItems: (items) => updateArgs({ flatItems: items }),
    baseCtx: lib.branded<lib.ContextDom, "context">({}),
    clone: cloneFn,
    jump: true,
  });
  const extras = lib.extrasByItemId(session.sections, (item) =>
    lib.branded<types.ListExtra, "viewer-extra">({
      actions: session.itemActions(item),
      extra: extra(item),
    }),
  );
  const itemExtra = (id: string): types.ListExtra =>
    extras.get(id) ?? emptyListExtra();
  const setAddItem = (
    sessionDraft: lib.FlatFormItemEditSession<types.TypeNames, types.Params>,
  ) =>
    updateArgs({
      flatItems: lib.applyFlatFormItem(
        flatItems,
        sessionDraft,
        { header: sessionDraft.draft.item, children: sessionDraft.children },
        sessionDraft.draft.n,
      ),
    });
  const toRemove = session.toRemove;
  return (
    <>
      {toRemove ? (
        <ConfirmBanner
          onConfirm={() => {
            toRemove.rm();
            session.setToRemove(null);
          }}
          onCancel={() => session.setToRemove(null)}
        >
          {pendingRemoveCopy(toRemove.item, (item) => item.params.name)}
        </ConfirmBanner>
      ) : null}
      <SectionsList>
        {session.sections.map((section, sIndex) => (
          <SectionComponent
            key={section.header.id}
            ctx={session.listCtx}
            variants={defaultVariants}
            itemExtra={itemExtra}
            renderCard={renderCard}
            args={session.args}
            clone={cloneFn}
            section={section}
            sIndex={sIndex}
            jump
            setAddItem={setAddItem}
          />
        ))}
      </SectionsList>
    </>
  );
};
