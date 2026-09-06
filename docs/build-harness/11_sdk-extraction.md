# SDK Extraction Candidate

## Reusable Core

The deterministic engine in `lib/risk.ts` is the strongest extraction candidate. It can become a small package such as `@tradeguard/risk` after the submission stabilizes.

## Proposed Public Surface

```ts
review(plan, orderBook, options): ReviewReceipt
validatePlan(plan): ValidationResult
validateOrderBook(orderBook, now): ValidationResult
```

The package should accept an explicit clock, preserve decimal inputs without floating-point ambiguity, and return a versioned receipt schema.

## Keep Outside the Package

- Binance credentials and MCP transport;
- browser WebMCP registration;
- REST fetching and retry policy;
- UI state and animation;
- Vercel, Sites and Cloudflare adapters.

## Extraction Gate

Do not publish the package until:

1. receipt semantics are versioned;
2. money arithmetic uses a documented precision strategy;
3. property-based and adversarial tests cover boundary behavior;
4. provenance and timestamp contracts are explicit; and
5. the consumer can distinguish observed market fields from calculated fields.

## Value

This boundary lets other agent workflows reuse a transparent pre-trade policy engine without inheriting TradeGuard’s UI or deployment stack.

