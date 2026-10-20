# section-review

**Section review shell** — teacher/admin read-only view of one section's
answers: wires the same recursive-slot walk as `section-responder`, but
threads a per-item `status` (`normal` / `disabled` / `highlight`) derived from
reviewer `AdditionalChanges` + `lastPending`. Remark overlay **editors**
are host-owned (`setAddition` / `setDeleteCommentId` open them; the call
site mounts chrome via `reviewOverlayActions`). Follow-ups are not
overlay state — they go through `renderAddFollowUp` / `renderFormItemsEditor`.

Migrated from `school/components/custom-form` → `ui-packages/section-review-ui`
(`SectionReviewHOC`). **No HTML in the library** — section/item/comment
chrome is injected via `SectionReviewChrome` (demo owns DOM). Overlay dialogs
are mounted by the **call site**, not this HOC.

## Library scope

| File | Role |
|---|---|
| `types.ts` | `AdditionalChanges`, `ReviewFollowUpPick`, `ReviewFormItemEntry`, `Addition`/`CommentAddition`, `ReviewExtra`, `ReviewChrome`, `SectionReviewChrome` |
| `reviewStatus.ts` | `reviewItemState` / `reviewStatusFor` / `reviewVariantState` — unlock, unanswered follow-ups, highlight vs pending yellow |
| `reviewChanges.ts` | `withComment` / `withoutComment` / `withFormItemEntry` / `withUnansweredFormItems` — writes into `AdditionalChanges` |
| `followUpPartition.ts` | `partitionFollowUpEntries` / `followUpEntryAsItem` — answered tree rows vs unanswered editor |
| `reviewOverlayActions.ts` | overlay submit (`withComment` / `withoutComment`) for the host-mounted remark editor |
| `reviewWalk.t.ts` | Walk ctx (`ReviewLive`, `ReviewWalk`, `ReviewItemExtra`) |
| `reviewVisibleItems.ts` | `usefulForReview` (membership) — panel-instance ids via `withIdSuffix` from `recursive-form` |
| `reviewItemChrome.tsx` | Add-follow-up, lock/unlock, follow-up mark |
| `reviewRender.tsx` | Recursive walk (`renderReviewItem` ↔ appendix ↔ slots) + `renderReviewColumns` |
| `SectionReview.tsx` | **`SectionReviewHOC(viewers, chrome)`** — `FormItemHOC` + `renderSection`; opens overlays via setters |
| `followUpEntriesFlat.ts` | `followUpEntriesToFlat` / `syncFollowUpEntriesFromFlat` / `followUpDraftsList` — entries ↔ synthetic flat section for a host design list |
| `useFollowUpAdd.ts` | `useFollowUpAdd` / `followUpPickFromSession` — headless add session + commit to `ReviewFollowUpPick` (host owns catalog + editor chrome) |

## How it plugs in

```
host: responses / changes / setChanges / lastPending
      + setAddition / setDeleteCommentId
      + variants: Record<ReviewVariantState, Variants>
  → SectionReviewHOC(viewers, chrome)
  → per item: pick default | change → variants[state]
  → FormItemHOC(…, getUseImpRefViewProps) — response.setValue always null
host: reviewOverlayActions + overlay chrome (sibling of the section)
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

### Overlay

Host owns `addition` / `deleteCommentId` and mounts the **remark** editor
next to `SectionReviewHOC`. The section only **opens** it (`setAddition` /
`setDeleteCommentId`). Submit writes `AdditionalChanges` via
`reviewOverlayActions`. Follow-up items are committed in-tree
(`renderAddFollowUp`) or edited via `renderFormItemsEditor` — not this overlay.

A **remark unlocks** the answer for student revise: `unlock` icon when
`comment` is set (click removes it); `lock` icon when none (click adds a
remark).

## Demo (`section-review/Section review` story)

Lifecycle walkthrough — **Design → Response → Follow** for one section
(name / email / note). Design remounts the form-dialogs editor; Response mounts
the fill shell (`SectionResponderHOC` — **+ Add** on multiple panels); Follow
mounts `SectionReviewHOC`. Empty follow-up uses a top-icon `AddFormItem`
(`useFollowUpAdd`); after the first item, unanswered rows are a nested Design
list (`followUpDraftsList` + `FormDialogsEditor` `sidebar={null}`). Three JSON panels stay
visible (`section`, `responses`, `AdditionalChanges`). Toggle **Review round
pending** to see `highlight` vs `disabled`.

## Dependency rule

```
form / response / recursive-form / form-edit (SectionWithItems)
        ▲
 section-review
```

Does **not** import `section-view` / `form-dialogs` / `section-responder`.
Multi-section shell: [`form-review/`](../form-review/) (`CustomFormReviewHOC`).
