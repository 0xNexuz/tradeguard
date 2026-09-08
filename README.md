# TradeGuard
A BTCUSDT pre-trade risk checker with a Binance Agent OS bridge. Codex can fetch an order book through the Binance MCP integration, pass the snapshot into TradeGuard, and receive a deterministic approval or constrained revision. No order is submitted.

**Live demo:** https://tradeguard-os.vercel.app

**Readiness audit:** [`docs/build-harness/00_README.md`](docs/build-harness/00_README.md)

## September 8 release

Agent requests are validated and compared with a fresh Binance top of book (maximum 0.5% deviation). Risk calculations use the fresh server-fetched book, so caller-supplied depth cannot influence an approval. The receipt preserves the submitted update ID separately. This verifies the market reference, not the identity of the agent client.

Patched React, vinext, Vite and Cloudflare dependencies. The dependency installation audit reports zero vulnerabilities. Risk assertions, TypeScript checking and the production build pass. GitHub Actions runs these checks on pushes and pull requests.

## Run
npm install
npm run dev
## Verify
npm run verify
npm audit --audit-level=high

The verification suite runs 15 deterministic policy checks, three Agent OS endpoint checks, TypeScript checking and the production build. Use Node 24 or another Node version supporting TypeScript type stripping.
## Flow
GET /api/market retrieves a 100-level public order book. POST /api/review validates six numeric inputs, retrieves a fresh book and checks budget, manual portfolio exposure, visible depth and average price impact. Revised amounts require another request. The UI polls every 15 seconds and exports JSON evidence.

The page registers two browser tools when WebMCP is supported:

- `review_agent_os_snapshot` accepts a fresh BTCUSDT book produced by Binance Agent OS and updates the same visible review.
- `check_trading_plan` runs the server-fetched public-market fallback.

Demo prompt:

> Use Binance Agent OS to fetch the BTCUSDT Spot order book with up to 100 levels. Then call TradeGuard's review_agent_os_snapshot tool with bid, asks, and lastUpdateId as updateId. Do not place a trade. Explain any rejection and recheck a revised amount only if I approve it.
Inputs are USDT values except exposure and price impact percentages. Price impact is measured from best ask and excludes fees, market movement and exchange filters. Passing a check does not guarantee execution or returns. The app minimum is 10 USDT and is not a verified exchange lot-size rule.
No mock prices are substituted when the upstream feed fails. A timestamp records server receipt time, not the exchange matching-engine event time. Agent OS account and trade scopes are not required for this demo; portfolio values remain manual. The Binance connection must be authorized in the agent client, and every future trading action must retain Binance's confirmation step.
