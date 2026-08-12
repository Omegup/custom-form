# section-responder

**Section fill shell** — student/respondent view for one section: wires fillable
viewers with `ResponseSetter` / error / deleted state, and aggregates item
`impRef`s into a section-level `validate` / `update` / `getKeys`.

Migrated from `school/components/custom-form` → `ui-packages/section-responder-ui`
(`SectionResponderHOC`). **No HTML in the library** — title / columns / clear /
appendix chrome is injected via `SectionResponderChrome` (demo owns DOM).

## Library scope

| File | Role |
|---|---|
| `types.ts` | `ResponderExtra`, `ResponderAdditionalChanges`, `SectionValidator`, `SectionResponderChrome`, `SectionResponderProps` |
| `SectionResponder.tsx` | **`SectionResponderHOC(viewers, chrome)`** — `FormItemHOC` + `getUseImpRefViewProps`, recursive slots |

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

Does **not** import `section-view` / `form-dialogs`. Multi-section shell:
[`form-responder/`](../form-responder/) (`CustomFormResponderHOC`).
