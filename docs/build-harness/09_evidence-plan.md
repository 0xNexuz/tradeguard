# Evidence Plan

## Claim-to-Evidence Map

| Submission claim | Required evidence | Current status |
|---|---|---|
| TradeGuard uses real BTCUSDT market depth. | Binance Agent OS MCP response plus captured update ID. | **VERIFIED** for the recorded run. |
| The same live snapshot reaches the deployed risk engine. | Public endpoint response containing the captured update ID and Agent OS source. | **VERIFIED** for the recorded run. |
| TradeGuard never places the order. | Repository search, API result and receipt all state `No order placed`. | **VERIFIED**. |
| A rejected plan receives a constrained candidate. | Unit tests and production response. | **VERIFIED**. |
| The browser exposes Agent OS tools. | Registration code plus an invocation transcript from a supported WebMCP browser. | **PARTIAL**; code exists, browser transcript missing. |
| Agent OS provenance cannot be forged. | Authenticated server-side integration or signed assertion. | **UNVERIFIED**. |

## Stored Evidence

- `evidence/tests/verification.json` — local verification result and dependency counts.
- `evidence/deployments/vercel-production.json` — public production identity and smoke check.
- `evidence/integrations/agent-os-review.json` — recorded Agent OS-to-production review.
- `tests/risk.test.mjs` — deterministic invariant tests.
- `lib/risk.ts` — implementation under test.

## Capture Rules

- Preserve timestamps, update IDs, inputs, outputs, deployment IDs and commit SHAs.
- Label observed data as observed and calculated results as calculated.
- Do not describe a server receipt time as an exchange event time.
- Do not describe caller-provided source text as cryptographic provenance.
- Do not claim order execution, account connectivity or portfolio verification.

## Evidence Still Needed Before Submission

1. A screen recording of Binance Agent OS fetching the book and invoking the registered WebMCP tool.
2. A second reviewer reproducing the demo from a clean browser session.
3. A dependency remediation report.
4. A publicly accessible source repository or confirmed judge access.

