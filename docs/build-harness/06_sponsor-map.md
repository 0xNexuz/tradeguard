# Sponsor Map

## Program

- Hackathon: Binance Agent OS Mini Hackathon
- Primary track: Track A — build an AI agent with Agent OS
- Secondary track: Track B is not treated as compatible; eligibility/prize stacking is **UNKNOWN**.

## Integration

| Sponsor | Primitive | Load-bearing | Status | Evidence |
|---|---|---:|---|---|
| Binance | Agent OS MCP Spot order book | Yes for agent path | PARTIAL | Real tool response and production review receipt |
| Binance | Public Spot REST depth | Yes for fallback | COMPLETE | `lib/market.ts`, public `/api/market` |

Removing Binance data prevents a market-grounded review. The Agent OS path is therefore functional, not decorative. However, the HTTP endpoint cannot prove a caller actually used MCP, so sponsor attribution is not yet tamper-resistant.

## Verification

1. In Codex with the Binance plugin, request the BTCUSDT Spot order book.
2. Open TradeGuard in a WebMCP-capable browser.
3. Call `review_agent_os_snapshot` with bid, asks and `lastUpdateId`.
4. Confirm the visible review and exported receipt say `Binance Agent OS MCP`.

Steps 1 and the server review were executed successfully. Step 3 through the live browser registry is **UNVERIFIED** because the available Windows browser automation failed to start.

## Failure Behavior

Public REST failure returns 503 without mock data. Invalid Agent OS input returns 400. Agent OS absence leaves the manual server-fetched fallback usable.

## Sponsor Proof Checklist

- [x] integration exists
- [x] core path uses Binance data
- [x] failure behavior is defined
- [x] README states current scope
- [ ] MCP provenance is independently verifiable
- [ ] browser tool call is recorded in the demo
- [ ] official judging requirement and weights are available
