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
| `types.ts` | `ResponderState`, `ResponderExtra`, `FillChrome`, `SectionResponderChrome`, `SectionResponderProps` |
| `responderWalk.t.ts` | Walk ctx (`FillLive`, `FillWalk`, `FillItemExtra`) |
| `responderStatus.ts` | `responderState` — change / old / default |
| `responderRender.tsx` | Recursive walk (`renderFillItem` ↔ slots) + `renderFillColumns`; `usefulForFill` membership |
| `sectionValidator.ts` | Section `validate` / `update` / `getKeys` over item `impRef`s |
| `SectionResponder.tsx` | **`SectionResponderHOC(viewers, chrome)`** — `FormItemHOC` + `renderSection`; opens the walk |

## How it plugs in

```
host: responses / setResponse / getError / section impRef
      + variants: Record<ResponderState, Variants>
  → SectionResponderHOC(viewers, chrome)
  → per item: pick state (change / old / default) → variants[state]
  → FormItemHOC(…, getUseImpRefViewProps)
  → viewer registers ViewerMethods
  → section impRef.validate aggregates item errors
```

`old` (prior answers + reviewer comments) is part of the school API; pass
`null` when not in a review-revise flow. The host builds the chrome Record;
the library picks by fill status (no `resolveVariant`).

## Demo (`section-responder/Section responder` story)

One section, two `field` items (required name + optional note). **Design** is
the form-dialogs editor. **Fill** + **Validate** calls the section `impRef`;
required name fails when empty.

## Dependency rule

```
form / response / recursive-form / form-edit (SectionWithItems)
        ▲
 section-responder
```

Does **not** import `section-view` / `form-dialogs`. Multi-section shell:
[`form-responder/`](../form-responder/) (`CustomFormResponderHOC`).
