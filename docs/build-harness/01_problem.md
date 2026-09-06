# Problem

## One-Line Problem

AI-assisted crypto users cannot reliably enforce their personal risk limits before an agent-proposed order because market evidence, portfolio constraints and the approval decision are usually split across tools.

## Users and Current Process

The primary user is a trader supervising an AI agent. Auditors and hackathon judges are secondary users. Today the user asks an agent for market information, manually checks budget and exposure, then decides whether to act. Binance Agent OS supplies market and account/trading primitives, while the supervising risk policy remains in the agent prompt or the user's judgment.

## Root Cause

Tool access and policy enforcement are separate trust domains. A fluent agent response is not a deterministic proof that the proposed amount fits a cash budget, exposure cap or visible order-book depth.

## Existing Alternatives

| Alternative | Strength | Limitation |
|---|---|---|
| Manual calculator | Transparent | Slow and detached from fresh book data |
| Agent prompt rules | Flexible | Model output is not a hard policy boundary |
| Exchange permissions | Strong execution boundary | Do not express this app's portfolio and impact rules |
| Generic trading bot | Automates execution | Often optimizes entry rather than proving a safe rejection |

## Success Condition

A system must accept a fresh market snapshot and explicit user limits, deterministically reject non-compliant plans, propose a bounded candidate, require a fresh recheck and preserve evidence without executing funds.

## Non-Goals

- Predicting returns or recommending whether BTC will rise.
- Authenticating portfolio balances in the current version.
- Placing, cancelling or transferring funds.

## Validation

Binance's official Agent OS documentation requires user confirmation before trades and warns that agents can use stale or incorrect information. TradeGuard addresses the pre-execution verification gap. No user-interview or production-usage evidence exists; demand beyond the hackathon context is **UNVERIFIED**.
