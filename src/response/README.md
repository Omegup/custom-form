# response

Form **response value** helpers — reading/writing answer data keyed by item id.

## Files

| File | Role |
|---|---|
| `response.ts` | `Response` type: `Record<'meta' | 'data', Record<string, string>>` |
| `getResponse.ts` | React hook wiring response getter/setter to form viewers |

Small utility module; no interactive demo tab yet.

Used by the view layer when a form needs live editable values (see `form/Form.stories.tsx`
for a simpler JSON-driven values map instead).
