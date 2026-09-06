# Real vs Simulated

## Capability Truth Table

| Capability | Status | Evidence | Notes |
|---|---|---|---|
| Binance REST order book | REAL — MAINNET | Public `/api/market` response | BTCUSDT, 100 levels |
| Binance Agent OS order-book call | REAL — MAINNET | MCP response used in production endpoint test | Public market scope |
| Deterministic risk review | REAL — LOCAL | Unit checks and production API response | Pure calculation |
| Agent-to-WebMCP browser invocation | PARTIAL | Registration code compiles | Browser contract not exercised |
| Manual portfolio constraints | REAL — LOCAL | UI and receipt | User supplied, unauthenticated |
| Account balance lookup | NOT IMPLEMENTED | None | No Account scope |
| Trade placement/transfer | NOT IMPLEMENTED | Repository search | Deliberately excluded |
| Vercel deployment | REAL — MAINNET | `https://tradeguard-os.vercel.app` HTTP 200 | Public |
| Sites deployment | REAL — MAINNET | Private production deployment succeeded | Owner only |

## Accuracy Review

The UI says Agent OS evidence only after the agent endpoint updates state. It otherwise says the bridge is ready only when the browser API is detected, or shows the live Binance fallback. The README accurately distinguishes manual balances and no execution.

Contradiction: the agent endpoint trusts a caller-provided source label and restamps freshness. Its `Binance Agent OS MCP` receipt is therefore **PARTIAL**, even though one real Agent OS call was demonstrated.

## Public README Truth

TradeGuard performs real Binance-market pre-trade checks and can accept a book from Binance Agent OS. It does not authenticate balances or execute trades. Agent-supplied evidence is currently trusted rather than attested.
