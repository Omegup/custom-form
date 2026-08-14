# response

**Form response values** — the fill-path foundation: per-item `{ meta, data }`
maps, the `ResponseSetter` host contract, and viewer `validate` / `update`
methods.

Migrated from `school/components/custom-form` → `types/response` +
`types/form-response-react` (`ViewerMethods` / `StrictViewerMethods`).
School's `form-react/getUseImpRefViewProps` lives in [`form/`](../form/)
(same package as `FormItemHOC`).

## Library scope (this package)

| File | Role |
|---|---|
| `types.ts` | `Response`, `ResponseSetter`, `ViewerMethods`, `StrictViewerMethods` |
| `emptyResponse.ts` | `{ meta: {}, data: {} }` — school default when a slot has no answer |
| `itemIdBase.ts` | Strip panel-instance suffix (`id:0` → `id`) |
| `panelInstances.ts` | Pure `data.instances` parse / suffix / next / with (optional import) |

## How it plugs into `form`

```
host passes extra.impRef: Ref<StrictViewerMethods>
  → FormItemHOC(viewers, getUseImpRefViewProps())
  → viewer receives extra.impRef: Ref<ViewerMethods>
  → viewer useImperativeHandle(impRef, () => ({ validate, update }))
  → host calls impRef.current.validate(response) / .update(response)
```

`getUseImpRefViewProps` always runs `update` before `validate`, and falls back
to `emptyResponse()` when neither the viewer nor the caller supplied a value.

## Demo (`response/Response` story)

One `field` type writing `data.value` through `ResponseSetter`. **Validate**
aggregates every item's `StrictViewerMethods.validate` (required name fails
when empty). JSON dump shows the live `responses` map.

## Dependency rule

Leaf package — no `_deps.ts`. Pure types + `emptyResponse` + optional id/instance helpers.

Does **not** import `form` / React. Hosts that need the impRef bridge import
`getUseImpRefViewProps` from `form`. Section aggregation lives in
[`section-responder/`](../section-responder/).
