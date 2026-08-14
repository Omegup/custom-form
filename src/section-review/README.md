# section-review

**Section review shell** — teacher/admin read-only view of one section's
answers: wires the same recursive-slot walk as `section-responder`, but
threads a per-item `status` (`normal` / `disabled` / `highlight`) derived from
reviewer `AdditionalChanges` + `lastPending`, and owns comment / follow-up-
form-item overlay state (mutating `AdditionalChanges` via `setChanges`).

Migrated from `school/components/custom-form` → `ui-packages/section-review-ui`
(`SectionReviewHOC`). **No HTML in the library** — section/item/comment/dialog
chrome is injected via `SectionReviewChrome` (demo owns DOM); overlays render
inline (sibling to content), never via `createPortal`.

## Library scope

| File | Role |
|---|---|
| `types.ts` | `AdditionalChanges`, `Addition`/`CommentAddition`/`FormItemAddition`, `ReviewExtra`, `ReviewVariantState`, `SectionReviewChrome`, `SectionReviewProps` |
| `SectionReview.tsx` | **`SectionReviewHOC(viewers, chrome)`** — `FormItemHOC` + `getUseImpRefViewProps`, recursive slots, status + overlay state |
| `followUpEntriesFlat.ts` | `followUpEntriesToFlat` / `syncFollowUpEntriesFromFlat` — entries ↔ synthetic flat section |

## How it plugs in

```
host: responses / changes / setChanges / lastPending
      + variants: Record<ReviewVariantState, Variants>
  → SectionReviewHOC(viewers, chrome)
  → per item: pick default | change → variants[state][type]
  → FormItemHOC(…, getUseImpRefViewProps) — response.setValue always null
  → chrome.renderOverlays: add/edit/delete comment, add/edit follow-up form item
```

`viewers` uses the same `ReviewExtra` shape as `section-responder`'s
`ResponderExtra` (`error` / `parentDeleted` / `index` / `icon` / `appendix` /
`response`, plus `status`), so a host can share one set of viewer components
between the fill and review shells.

### Status rules

- Top-level item: `comment` present → `normal`; else `highlight` when the
  item's last `history` stamp matches the newest answer wave (or
  `lastPending` when that date is itself an answer stamp), otherwise
  `disabled` (ancient). Answered items with no history yet count as recent.
- Follow-up form item entry: `normal` when it has no `date` or there's no
  `lastPending`; otherwise `highlight` until the student responds, then
  `disabled`.

### Overlay mutations

Host owns `addition` / `deleteCommentId` (required props) so a Library sidebar
can fill `formItem` when the teacher is adding a follow-up. Submit callbacks
still write into `AdditionalChanges` via `setChanges`.

A **remark unlocks** the answer for student revise: `unlock` icon when
`comment` is set (click removes it); `lock` icon when none (click adds a
remark).

## Demo (`section-review/Section review` story)

Lifecycle walkthrough — **Design → Response → Follow** for one section
(name / email / note). Three JSON panels stay visible (`section`,
`responses`, `AdditionalChanges`). Follow phase mounts `SectionReviewHOC`
with seeded comments + a follow-up form item; toggle **Review round pending**
to see `highlight` vs `disabled`.

## Dependency rule

```
form / response / recursive-form / form-edit (SectionWithItems)
        ▲
 section-review
```

Does **not** import `section-view` / `form-dialogs` / `section-responder`.
Multi-section shell: [`form-review/`](../form-review/) (`CustomFormReviewHOC`).
