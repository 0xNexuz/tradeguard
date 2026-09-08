export type Book = { bid: number; asks: [number, number][]; receivedAt: number; updateId: number };
export type AgentBook = Pick<Book, 'bid' | 'asks' | 'updateId'>;
export type Plan = { amount: number; budget: number; portfolio: number; holding: number; exposure: number; slippage: number };
export type Review = { passed: boolean; reasons: string[]; candidate: number; quantity: number; average: number; impact: number; exposureAfter: number; checkedAt: number; book: Book; plan: Plan };
export function validatePlan(p: Plan) {
  if (!p || (['amount','budget','portfolio','holding','exposure','slippage'] as const).some(key => typeof p[key] !== 'number' || !Number.isFinite(p[key]))) throw new Error('All limits must be finite numbers.');
  if (p.amount < 10 || p.amount > 1000000 || p.budget < 0 || p.portfolio <= 0 || p.holding < 0 || p.holding > p.portfolio || p.exposure <= 0 || p.exposure > 100 || p.slippage <= 0 || p.slippage > 5) throw new Error('Enter an order of 10–1,000,000 USDT and valid portfolio limits.');
}
export function verifyAgentMarket(agent: AgentBook, reference: Book) {
  if (!Number.isSafeInteger(agent.updateId) || agent.updateId <= 0 || !Number.isSafeInteger(reference.updateId) || reference.updateId <= 0) throw new Error('Invalid market update ID.');
  if (!Array.isArray(agent.asks) || agent.asks.length < 1 || agent.asks.length > 100) throw new Error('Invalid Agent OS depth.');
  const agentAsk = agent.asks[0]?.[0];
  const referenceAsk = reference.asks[0]?.[0];
  if (![agent.bid, agentAsk, reference.bid, referenceAsk].every(value => typeof value === 'number' && Number.isFinite(value) && value > 0)) throw new Error('Invalid market top of book.');
  const bidDrift = Math.abs(agent.bid / reference.bid - 1) * 100;
  const askDrift = Math.abs(agentAsk / referenceAsk - 1) * 100;
  if (bidDrift > 0.5 || askDrift > 0.5) throw new Error('Agent snapshot does not match the current Binance market.');
  return { bidDrift, askDrift };
}

function simulateBuy(amount: number, asks: [number, number][]) {
  let remaining = amount;
  let quantity = 0;
  for (const [price, qty] of asks) {
    const spend = Math.min(remaining, price * qty);
    quantity += spend / price;
    remaining -= spend;
    if (remaining < 0.000001) break;
  }
  const average = quantity > 0 ? (amount - remaining) / quantity : 0;
  const impact = average > 0 ? (average / asks[0][0] - 1) * 100 : 0;
  return { remaining, quantity, average, impact };
}

function largestCandidate(maxAmount: number, asks: [number, number][], slippage: number) {
  let low = 0;
  let high = Math.floor(maxAmount * 100);
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    const fill = simulateBuy(mid / 100, asks);
    if (fill.remaining <= 0.000001 && fill.impact <= slippage + 1e-9) low = mid;
    else high = mid - 1;
  }
  return low / 100;
}

export function review(p: Plan, book: Book, now = Date.now()): Review {
  validatePlan(p);
  if (!Number.isFinite(book.receivedAt) || now - book.receivedAt > 15000 || book.receivedAt > now + 1000 || !Number.isFinite(book.bid) || book.bid <= 0 || !book.asks.length || book.asks.some(([price,qty],i) => !Number.isFinite(price) || !Number.isFinite(qty) || price <= 0 || qty <= 0 || (i>0 && price < book.asks[i-1][0])) || book.asks[0][0] < book.bid) throw new Error('Order book is stale or invalid. Refresh before checking.');
  const reasons: string[] = [];
  const exposureRoom = Math.max(0, p.portfolio * p.exposure / 100 - p.holding);
  if (p.amount > p.budget) reasons.push('Order exceeds your available cash budget.');
  if (p.amount > exposureRoom) reasons.push('Order exceeds your portfolio exposure limit.');
  const totalDepth = book.asks.reduce((sum,[price,qty])=>sum+price*qty,0);
  const { remaining, quantity, average, impact } = simulateBuy(p.amount, book.asks);
  if (remaining>0.000001) reasons.push('Insufficient visible liquidity in the 100-level snapshot.');
  if (impact > p.slippage) reasons.push('Estimated order-book price impact exceeds your limit.');
  const candidate = largestCandidate(Math.min(p.amount, p.budget, exposureRoom, totalDepth), book.asks, p.slippage);
  if(candidate<10) reasons.push('No revised order above this app’s 10 USDT minimum fits your limits.');
  return { passed:reasons.length===0,reasons,candidate,quantity,average,impact,exposureAfter:(p.holding+p.amount)/p.portfolio*100,checkedAt:now,book,plan:{...p} };
}


