# Ecosystem Gap

## Ecosystem

Binance Agent OS, Binance MCP market tools, Codex/ChatGPT browser tools, and Binance Spot BTCUSDT.

## Existing Capability and Missing Primitive

Agent OS provides structured market, account and trading tools. The missing primitive is a small deterministic policy boundary that converts an agent-supplied order book plus user limits into an inspectable rejection, constrained candidate and receipt before any execution tool is considered.

Agent OS launched shortly before the September 2026 mini hackathon, so reusable supervisory patterns are immature. TradeGuard depends on Binance for live market evidence and uses the ecosystem's confirm-before-execute model; the risk engine itself is portable.

## Competitor / Alternative Matrix

| Solution | What it does | What it lacks | TradeGuard difference |
|---|---|---|---|
| Agent OS alone | Exposes market/account/trade tools | App-specific portfolio policy | Deterministic constraint evaluation |
| Prompt-only guardrail | Tells an agent what to avoid | Enforced invariant and receipt | Pure policy engine plus evidence |
| Exchange limits | Restricts account activity | Visible order-book impact estimate | Pre-trade depth walk and revision |

## Portability and Defensibility

The engine could run with another exchange. Binance remains the best fit because its MCP tool produces the live evidence and its explicit confirmation boundary complements TradeGuard's review-only design. Defensibility is currently implementation clarity and receipt workflow, not a proprietary model or dataset.

## Ecosystem Thesis

TradeGuard makes Agent OS easier to supervise: it treats the agent's proposal as untrusted input, applies deterministic limits, and surfaces a reasoned rejection before funds are in scope.
