# Demo Plan

## Target Runtime

75 seconds. The official limit is **UNKNOWN** and must be checked before recording.

## Script

| Time | Visual | Narration |
|---:|---|---|
| 0–8s | TradeGuard hero and live market badge | “AI agents can prepare trades faster than people can verify risk. TradeGuard adds a deterministic pre-trade gate.” |
| 8–20s | Enter a BTCUSDT plan that exceeds its budget | “This plan requests 1,500 USDT against a 1,000 USDT budget and a 25% portfolio cap.” |
| 20–34s | Binance Agent OS fetches the 100-level BTCUSDT book | “Binance Agent OS supplies the live order-book snapshot. No account or trading permission is needed.” |
| 34–49s | Agent invokes `review_agent_os_snapshot` | “TradeGuard checks budget, portfolio exposure, visible depth and average price impact.” |
| 49–62s | Rejection reasons and 750 USDT candidate appear | “The plan is rejected, and the engine calculates the largest candidate that satisfies the configured limits.” |
| 62–70s | Exported JSON receipt | “The receipt preserves the inputs, market update ID, reasons and the explicit execution state.” |
| 70–75s | Final product frame | “TradeGuard helps an agent stop, explain and revise before anything reaches execution.” |

## Required On-Screen Proof

- Binance Agent OS tool name and BTCUSDT parameters.
- The deployed `tradeguard-os.vercel.app` origin.
- Rejection reasons, candidate amount, update ID and `No order placed`.
- The WebMCP tool invocation in a supported browser.

## Recording Checklist

- Use a fresh browser session and clear zoom level.
- Avoid exposing account identifiers or credentials.
- Keep the cursor still while evidence is readable.
- Do not cut between the Agent OS response and TradeGuard invocation.
- Re-record if live data fails; never substitute a mock price.

