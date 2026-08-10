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

Lifecycle walkthrough — **Design → Response → Follow**:

1. **Design** — form blueprint (Personal + Experience + a deleted Archived
   section); JSON shows `sections`.
2. **Response** — student answers (summary left empty on purpose); JSON shows
   `responses`.
3. **Follow** — mounts `CustomFormReviewHOC`: comments, follow-up questions,
   status highlighting. Toggle **Review round pending** / **showDeleted**.
   JSON shows live `AdditionalChanges`.

All three JSON panels stay visible so you can compare phases while interacting.

## Dependency rule

```
section-review
        ▲
 form-review
```

Does **not** import `section-view` / `form-dialogs` / `form-responder`.
