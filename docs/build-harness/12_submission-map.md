# Submission Map

## Submission Position

TradeGuard is an explainable pre-trade safety gate for AI-assisted BTCUSDT workflows. Binance Agent OS supplies public market depth; TradeGuard deterministically checks policy and returns either approval or a constrained candidate. The product never submits an order.

## Links

- Live public demo: https://tradeguard-os.vercel.app
- GitHub: https://github.com/0xNexuz/tradeguard — currently private.
- Secondary Sites deployment: https://tradeguard-agent-os.elllbest7.chatgpt.site — access-controlled.

## Requirement Matrix

| Item | Status | Action |
|---|---|---|
| Working public deployment | **COMPLETE** | Recheck immediately before submission. |
| Real Binance market input | **COMPLETE** | Preserve the MCP and endpoint evidence. |
| Agent OS connection | **PARTIAL** | Record a supported-browser WebMCP invocation and harden provenance. |
| Source access for judges | **BLOCKED** | Make the repo public or grant confirmed judge access. |
| Demo video | **UNVERIFIED** | Record from the approved script after P0 fixes. |
| Social post | **UNVERIFIED** | Publish only after links and claims are final. |
| Survey/form submission | **UNVERIFIED** | Complete before the official deadline. |
| Team and eligibility | **UNKNOWN** | Verify against official rules. |
| Judging weights | **UNKNOWN** | Verify on the official event page. |

## Copy for Submission Form

**One-line description:** TradeGuard gives Binance Agent OS a deterministic pre-trade risk gate that explains rejections and proposes a constrained candidate before any order is placed.

**What it does:** An agent fetches live BTCUSDT depth through Binance Agent OS and sends the snapshot to TradeGuard. TradeGuard validates the plan, budget, manual portfolio exposure, visible liquidity and average price impact, then returns a versioned JSON-style receipt with clear reasons and an explicit no-execution state.

**Why it matters:** Agent-generated trading plans need a transparent policy boundary before execution. TradeGuard makes the decision inspectable, repeatable and easy to demonstrate without asking for account or trading permissions.

## Release Decision

Status: **PARTIAL / NOT SUBMISSION-READY**.

Resolve the P0 items in `00_README.md`, verify the official rules, capture the end-to-end browser evidence, and confirm judge access before submitting.

