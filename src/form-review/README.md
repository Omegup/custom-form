# form-review

**Full-form review shell** — maps a list of sections through
[`SectionReviewHOC`](../section-review/); no validator aggregation (review is
read-only, unlike `form-responder`'s form-level `validate`/`update`).

Migrated from `school/components/custom-form` → `ui-packages/form-response-ui`
(`CustomFormResponsesHOC`). **No HTML in the library** — form/section chrome
is injected via `FormReviewChrome` (demo owns DOM). Host passes `ctx`
directly (no theme/portal rebuild).

## Library scope

| File | Role |
|---|---|
| `types.ts` | `FormHeader`, `FormReviewChrome`, `CustomFormReviewProps` |
| `CustomFormReview.tsx` | **`CustomFormReviewHOC(viewers, variants, chrome)`** |

## How it plugs in

```
host: sections / responses / changes / setChanges / lastPending
  → CustomFormReviewHOC(viewers, variants, chrome)
  → per section: SectionReviewHOC (shares `changes` / `lastPending` across all sections)
```

## Demo (`form-review/Form review` story)

Two sections (Personal + Notes). Toggle **Review round pending** to see
`highlight` vs `disabled` status; toggle `showDeleted` in controls to keep
deleted sections visible.

## Dependency rule

```
section-review
        ▲
 form-review
```

Does **not** import `section-view` / `form-dialogs` / `form-responder`.
