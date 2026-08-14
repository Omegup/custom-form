# form-response

**FormResponse document lifecycle** — the persisted student/teacher record
(`responses` + `changes` + `feedbackHistory` + `status`) and the pure
Send / Save additional questions / feedback ops.

Not a fill or review **shell** (`form-responder` / `form-review` stay UI).
Not `response/` (per-item `{ meta, data }` values).

## Library scope

| File | Role |
|---|---|
| `types.ts` | `FormResponseDoc`, `FeedbackStatus`, `FormResponseValidator` |
| `values.ts` | `formResponseValues` / `toFormResponseEntries` |
| `changes.ts` | Strip remarks, stamp history, remark-only map for fill `old` |
| `send.ts` | `canSend` / `buildSend` |
| `review.ts` | `saveAdditionalQuestions` / `appendFeedback` / `lastAnsweredAt` |
| `followUps.ts` | `followUpsByOrigin` / unanswered follow-up ids |
| `useFormResponseSend.ts` | Headless fill Send hook (no HTML) |
| `useFormResponseReview.ts` | Headless Update save / revert / feedback hook (no HTML) |

Library functions take `now: Date`. Hosts that need Storybook Date identity
supply it (e.g. `rememberDate` in the demo).

## Demo

`form-response/Form response` (`demo/FormResponseDemo.tsx`) — **Design** is
the form-dialogs editor; **Fill → Send** creates the FormResponse document;
**Update** Save / Request changes / Approve / Reject mutate that same record.
💬 on Update opens a follow-up type dropdown (unanswered drafts stay design
rows, not empty answers). Fill/Update keep headings and multiple-panel **+ Add**.

Read [`demo/FormResponseDemo.tsx`](./demo/FormResponseDemo.tsx).

## Dependency rule

```
response / recursive-form / form-edit / section-review
        ▲
  form-response
```

Library does **not** import `form-responder` / `form-review` HOCs. The demo
may compose those shells. Fill `old.changes` is a structural
`{ comment?: string }` record (`remarkOnlyChanges`).
