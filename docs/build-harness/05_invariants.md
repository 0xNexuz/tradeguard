# Invariants

## INV-001 — No financial execution

Statement: TradeGuard review paths must never place, cancel or transfer an order.

Enforcement: no execution client or credential exists; tool output states `No order placed`.
Verification: repository search and production response.
Evidence: `evidence/integrations/agent-os-review.json`.
Status: **VERIFIED**.

## INV-002 — Invalid or stale evidence fails closed

Statement: A malformed, future-dated or older-than-15-second book cannot produce a review.

Enforcement: `review()` validates timestamp, bid, asks, numeric values and ask ordering.
Verification: stale and invalid book assertions.
Evidence: `tests/risk.test.mjs`.
Status: **VERIFIED** for direct engine calls; **PARTIAL** for Agent OS because that adapter restamps the payload.

## INV-003 — Limits constrain the candidate

Statement: the proposed candidate cannot exceed requested amount, cash budget, remaining exposure room or visible depth within the allowed impact band.

Enforcement: minimum of the four bounds, floored to cents.
Verification: budget, holding, exposure and depth assertions.
Status: **VERIFIED**.

## INV-004 — Revision requires a new check

Statement: selecting the candidate must not inherit the previous pass state.

Enforcement: `revise()` changes the amount and calls the review endpoint again.
Verification: engine revision assertion plus source review; browser behavior is **UNVERIFIED**.
Status: **PARTIAL**.

## Coverage

| ID | Enforcement | Test | Status |
|---|---|---|---|
| INV-001 | Architecture/no execution imports | Repository search + production response | VERIFIED |
| INV-002 | Risk engine | stale/invalid assertions | PARTIAL |
| INV-003 | Risk engine | limit/depth assertions | VERIFIED |
| INV-004 | UI state + endpoint | engine assertion only | PARTIAL |

Untested critical invariant: an Agent OS claim must be inseparable from genuine MCP provenance.
