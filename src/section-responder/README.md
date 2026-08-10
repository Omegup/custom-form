# section-responder

**Section fill shell** — student/respondent view for one section: wires fillable
viewers with `ResponseSetter` / error / deleted state, and aggregates item
`impRef`s into a section-level `validate` / `update` / `getKeys`.

Migrated from `school/components/custom-form` → `ui-packages/section-responder-ui`
(`SectionResponderHOC`). School's JSS `SectionTitle` / `ErrorDescription` /
`Close` are replaced by minimal inline chrome.

## Library scope

| File | Role |
|---|---|
| `types.ts` | `ResponderExtra`, `ResponderAdditionalChanges`, `SectionValidator`, `SectionResponderProps` |
| `SectionResponder.tsx` | **`SectionResponderHOC(viewers)`** — `FormItemHOC` + `getUseImpRefViewProps`, recursive slots |

## How it plugs in

```
host: responses / setResponse / getError / section impRef
  → SectionResponderHOC(viewers)
  → per item: FormItemHOC(…, getUseImpRefViewProps)
  → viewer registers ViewerMethods
  → section impRef.validate aggregates item errors
```

`old` (prior answers + reviewer comments) is part of the school API; pass
`null` when not in a review-revise flow.

## Demo (`section-responder/Section responder` story)

One section, two `field` items (required name + optional note). **Validate**
calls the section `impRef`; required name fails when empty.

## Dependency rule

```
form / response / recursive-form / form-edit (SectionWithItems)
        ▲
 section-responder
```

Does **not** import `section-view` / `form-dialogs`. Multi-section shell is
next: school `form-responder-ui` / `CustomFormResponderHOC`.
