# Test Plan

## Current Automated Coverage

Run from the repository root:

```powershell
node --experimental-strip-types tests/risk.test.mjs
npx tsc --noEmit
npm run build
```

The risk suite contains 12 assertions covering:

- approval inside budget, exposure, depth and impact limits;
- budget and portfolio-exposure rejection;
- constrained candidate sizing;
- insufficient visible depth;
- average-price-impact rejection;
- stale and malformed market evidence;
- non-finite inputs;
- revision behavior; and
- missing required fields.

## Production Smoke Test

1. Request `https://tradeguard-os.vercel.app/` and require HTTP 200.
2. Fetch a fresh BTCUSDT order book through Binance Agent OS.
3. POST the snapshot and a deliberately over-budget plan to `/api/review-agent`.
4. Require `passed: false`, a constrained candidate, a Binance Agent OS receipt source, and `execution: "No order placed"`.

The latest captured smoke test passed and is recorded in `evidence/integrations/agent-os-review.json`.

## Missing Coverage

| Gap | Priority | Acceptance condition |
|---|---:|---|
| Agent OS provenance | P0 | Server verifies an authenticated Agent OS assertion instead of trusting request text. |
| Browser WebMCP contract | P0 | Supported browser invokes both registered tools and the visible result matches the API response. |
| Dependency advisories | P0 | `npm audit` has no high or critical findings, or every exception has a time-bound written rationale. |
| API integration suite | P1 | Tests exercise valid, stale, malformed and upstream-failure responses for all three API routes. |
| Continuous integration | P1 | A clean checkout runs risk tests, type checking, build and dependency policy on every change. |

## Adversarial Cases to Add

- Claim an arbitrary source while supplying a fabricated book.
- Replay an old order book with a new server receipt timestamp.
- Submit negative, fractional or implausibly large update IDs.
- Send unsorted asks, duplicate levels, crossed books and empty books.
- Race a revised amount against a changed market snapshot.
- Attempt payloads near JSON and runtime size limits.

