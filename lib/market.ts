import type { Book } from './risk';
export async function getBook(): Promise<Book> {
  const response = await fetch('https://data-api.binance.vision/api/v3/depth?symbol=BTCUSDT&limit=100', {cache:'no-store',signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('Binance market data is unavailable. Retry shortly.');
  const data = await response.json() as {lastUpdateId:number;bids:string[][];asks:string[][]};
  if(!Array.isArray(data.bids)||!Array.isArray(data.asks)||!data.bids.length||!data.asks.length||!Number.isFinite(data.lastUpdateId)) throw new Error('Invalid Binance response.');
  const book:Book={bid:Number(data.bids[0][0]),asks:data.asks.map(([p,q])=>[Number(p),Number(q)]),receivedAt:Date.now(),updateId:data.lastUpdateId};
  if(!Number.isFinite(book.bid)||book.bid<=0||book.asks.some(([p,q])=>!Number.isFinite(p)||!Number.isFinite(q)||p<=0||q<=0)) throw new Error('Invalid Binance prices.');
  return book;
}

