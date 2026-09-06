# Threat Model

## Security Objective

An untrusted user, agent or market payload must not create the appearance that an unsafe plan passed, and the application must never gain implicit authority to move funds.

## Assets and Actors

| Asset | Impact if compromised |
|---|---|
| User-entered limits | Unsafe or misleading decision |
| Market snapshot | False price-impact result |
| Evidence receipt | Misrepresented sponsor integration |
| Agent permissions | Unauthorized financial action |
| Deployment integrity | Altered UI or policy engine |

Relevant actors are a malicious/compromised agent, caller submitting forged books, compromised frontend/API, upstream data failure and dependency attacker.

## Trust Assumptions

The user supplies truthful portfolio values. Binance supplies correct market data. Vercel/Sites serve the committed code. The current Agent OS handoff is trusted to pass the MCP response honestly; the server does not verify its provenance.

## Attack Surface

| Attack | Defense | Verification | Status |
|---|---|---|---|
| NaN/missing/negative plan fields | Explicit finite/range checks | `tests/risk.test.mjs` | VERIFIED |
| Stale server-fetched book | 15-second freshness rule | stale-book assertion | VERIFIED |
| Malformed/descending book | Price, quantity and order validation | invalid-book assertions | VERIFIED |
| Upstream outage | 503 and no mock substitution | source review; production failure path not injected | PARTIAL |
| Forged Agent OS payload | Source string only | No provenance verification | NOT IMPLEMENTED |
| Old MCP snapshot restamped as fresh | Server overwrites `receivedAt` | No exchange timestamp/attestation | NOT IMPLEMENTED |
| Prompt injection/tool misuse | Tool accepts structured numeric schema and cannot trade | Browser execution unverified | PARTIAL |
| Runaway spending | No order/transfer code exists | repository search | VERIFIED |
| Dependency compromise | Lockfile | `npm audit` reports 8 high | PARTIAL |

## Guarantees

- Invalid numerical plans and invalid book shapes fail closed.
- A review never submits, cancels or transfers funds.
- The fallback never substitutes mock prices.

## Non-Guarantees

- A passed review does not guarantee execution price, profit or exchange acceptance.
- Agent-supplied snapshots are not cryptographically proven to come from Binance.
- Manual balances are not authenticated.

## Residual Risk

The largest risk is evidence spoofing: any caller can label a valid-shaped book as Agent OS data, and the server renews its freshness. Until provenance is bound to a trusted server-side MCP session or signed evidence, the Agent OS receipt is **PARTIAL**.
