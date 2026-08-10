# form-responder

**Full-form fill shell** — maps a list of sections through
[`SectionResponderHOC`](../section-responder/) and aggregates section
validators into one form-level `validate` / `update` / `getKeys`.

Migrated from `school/components/custom-form` → `ui-packages/form-responder-ui`
(`CustomFormResponderHOC`). **No HTML in the library** — form/section chrome
is injected via `FormResponderChrome` (demo owns DOM). Host passes `ctx`
directly (no theme/portal rebuild).

## Library scope

| File | Role |
|---|---|
| `types.ts` | `FormHeader`, `FormResponderChrome`, `CustomFormResponderProps` |
| `CustomFormResponder.tsx` | **`CustomFormResponderHOC(viewers, variants, chrome)`** |

## How it plugs in

```
host: sections / responses / setResponse / form impRef
  → CustomFormResponderHOC(viewers, variants)
  → per section: SectionResponderHOC
  → form impRef.validate merges section errors (skips deleted)
```

## Demo (`form-responder/Form responder` story)

Two sections (Personal + Notes). **Validate** fails when the required name is
empty. Toggle `showDeleted` in controls to keep deleted sections visible.

## Dependency rule

```
section-responder
        ▲
 form-responder
```

Does **not** import `section-view` / `form-dialogs`. Review / admin response
UIs live in the sibling [`section-review/`](../section-review/) /
[`form-review/`](../form-review/) packages (school `section-review-ui`,
`form-response-ui`).
