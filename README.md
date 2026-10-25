# Next.js Bug-Fix Casebook

Three real-world bugs I see constantly in Next.js / React / TypeScript projects — each one pinned by a failing test first, then fixed. Every case has a `buggy` and a `fixed` version side by side, and the test suite demonstrates both: `it.fails(...)` proves the bug still happens in the buggy code, and the adjacent test proves the fix holds.

```
npm test
```

## Case 1 — Stale search results overwrite fresh ones

**Symptom:** type quickly in a search box, and old results flash back over the new ones.

**Root cause:** responses race; the late arrival for the *older* query paints last because nothing tracks which request is current.

**Fix:** tag requests with an id and drop any response that is no longer the latest (in production: `AbortController` or React Query key cancellation).

## Case 2 — The JST daily report loses its night sales

**Symptom:** revenue by day looks wrong for teams outside UTC; sales between 00:00 and 08:59 JST show up on the previous day.

**Root cause:** `toISOString().slice(0, 10)` is a *UTC* date string; the office calendar is `Asia/Tokyo`.

**Fix:** bucket with `Intl.DateTimeFormat` in the business timezone — no date library, no drift.

## Case 3 — Invoice totals drift by cents

**Symptom:** line items don't add up to the grand total; refunds off by $0.01.

**Root cause:** money as binary floats (`0.1 + 0.2 !== 0.3`). The test asserts the drift is real, not hypothetical.

**Fix:** integer cents end-to-end; format with `Intl.NumberFormat` only at the edges.

---

Written by a senior engineer (20+ years, ex-Product Owner / EM of Cacoo). If your app shows any of these symptoms, I can find and fix its cousins — with a regression test for each.
