# TradeGuard
A live BTCUSDT pre-trade risk checker using Binance public market data. No account connection, AI model or trading execution is included.
## Run
npm install
npm run dev
## Verify
node --experimental-strip-types tests/risk.test.mjs
npx tsc --noEmit
npm run build
Use Node 24 or another Node version supporting TypeScript type stripping for the risk assertions.
## Flow
GET /api/market retrieves a 100-level public order book. POST /api/review validates six numeric inputs, retrieves a fresh book and checks budget, manual portfolio exposure, visible depth and average price impact. Revised amounts require another request. The UI polls every 15 seconds and exports JSON evidence.
Inputs are USDT values except exposure and price impact percentages. Price impact is measured from best ask and excludes fees, market movement and exchange filters. Passing a check does not guarantee execution or returns. The app minimum is 10 USDT and is not a verified exchange lot-size rule.
No mock prices are substituted when the upstream feed fails. A timestamp records server retrieval time, not the exchange matching-engine event time.
