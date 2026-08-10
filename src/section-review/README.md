# section-review

**Section review shell** — teacher/admin read-only view of one section's
answers: wires the same recursive-slot walk as `section-responder`, but
threads a per-item `status` (`normal` / `disabled` / `highlight`) derived from
reviewer `AdditionalChanges` + `lastPending`, and owns comment / follow-up-
question overlay state (mutating `AdditionalChanges` via `setChanges`).

Migrated from `school/components/custom-form` → `ui-packages/section-review-ui`
(`SectionReviewHOC`). **No HTML in the library** — section/item/comment/dialog
chrome is injected via `SectionReviewChrome` (demo owns DOM); overlays render
inline (sibling to content), never via `createPortal`.

## Library scope

| File | Role |
|---|---|
| `types.ts` | `AdditionalChanges`, `Addition`/`CommentAddition`/`QuestionAddition`, `ReviewExtra`, `SectionReviewChrome`, `SectionReviewProps` |
| `SectionReview.tsx` | **`SectionReviewHOC(viewers, chrome)`** — `FormItemHOC` + `getUseImpRefViewProps`, recursive slots, status + overlay state |

## How it plugs in

```
host: responses / changes / setChanges / lastPending
  → SectionReviewHOC(viewers, chrome)
  → per item: FormItemHOC(…, getUseImpRefViewProps) — response.setValue always null
  → chrome.renderOverlays: add/edit/delete comment, add/edit follow-up question
```

`viewers` uses the same `ReviewExtra` shape as `section-responder`'s
`ResponderExtra` (`error` / `parentDeleted` / `index` / `icon` / `appendix` /
`response`, plus `status`), so a host can share one set of viewer components
between the fill and review shells.

### Status rules (ported verbatim from school)

- Top-level item: `comment` present → `normal`; else `highlight` when
  `lastPending` matches the item's last `history` entry date, otherwise
  `disabled`.
- Follow-up question entry: `normal` when it has no `date` or there's no
  `lastPending`; otherwise `highlight` until the student responds, then
  `disabled`.

### Overlay mutations

`SectionReviewHOC` owns the transient `addition` / `deleteCommentId` state and
derives `onSubmitComment`, `onConfirmDeleteComment`, `onSubmitQuestion` for
`renderOverlays` — these write directly into `AdditionalChanges` via
`setChanges`. Chrome only needs to collect input and call the callback; it
never touches `changes` directly.

## Demo (`section-review/Section review` story)

Lifecycle walkthrough — **Design → Response → Follow** for one section
(name / email / note). Three JSON panels stay visible (`section`,
`responses`, `AdditionalChanges`). Follow phase mounts `SectionReviewHOC`
with seeded comments + a follow-up question; toggle **Review round pending**
to see `highlight` vs `disabled`.

## Dependency rule

```
form / response / recursive-form / form-edit (SectionWithItems)
        ▲
 section-review
```

Does **not** import `section-view` / `form-dialogs` / `section-responder`.
Multi-section shell: [`form-review/`](../form-review/) (`CustomFormReviewHOC`).
