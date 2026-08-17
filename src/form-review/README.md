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
| `CustomFormReview.tsx` | **`CustomFormReviewHOC(viewers, chrome)`** — required `variants: Record<ReviewVariantState, Variants>` prop |

## How it plugs in

```
host: sections / responses / changes / setChanges / lastPending
      + setAddition / setDeleteCommentId
      + variants: Record<ReviewVariantState, Variants>
  → CustomFormReviewHOC(viewers, chrome)
  → per section: SectionReviewHOC (library picks variants[state])
host: reviewOverlayActions + overlay chrome (once, sibling of the form)
```

## Demo (`form-review/Form review` story)

Lifecycle walkthrough — **Design → Response → Follow**:

1. **Design** — same editor as form-dialogs (library, add/edit dialogs, DnD).
   Headings and panels stay on the fill/review tree (`multiple` panels get **+ Add**).
2. **Response** — student fills via `CustomFormResponderHOC` (inputs + panel instances);
   JSON shows `responses`.
3. **Follow** — mounts `CustomFormReviewHOC`: comments, follow-up type dropdown
   (💬), unanswered drafts as design rows, status highlighting. Toggle
   **Review round pending** / **showDeleted**. JSON shows live `AdditionalChanges`.

All three JSON panels stay visible so you can compare phases while interacting.

## Dependency rule

```
section-review
        ▲
 form-review
```

Does **not** import `section-view` / `form-dialogs` / `form-responder`.
