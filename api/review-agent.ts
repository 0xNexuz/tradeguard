import { getBook } from '../lib/market.js';
import { review, validatePlan, verifyAgentMarket, type Book, type Plan } from '../lib/risk.js';

type Reply = {
  status(code: number): Reply;
  json(value: unknown): void;
  setHeader(name: string, value: string): void;
};
type Payload = {
  source: 'binance-agent-os-mcp';
  plan: Plan;
  book: Omit<Book, 'receivedAt'>;
};

export default async function handler(
  request: { method?: string; body?: unknown },
  response: Reply,
) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }
  let payload: Payload;
  let agentBook: Book;
  try {
    payload = (typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body) as Payload;
    if (payload.source !== 'binance-agent-os-mcp') throw new Error();
    validatePlan(payload.plan);
    const receivedAt = Date.now();
    agentBook = { ...payload.book, receivedAt };
    review(payload.plan, agentBook, receivedAt);
  } catch {
    return response.status(400).json({
      error: 'Invalid Agent OS snapshot. The check was blocked.',
    });
  }
  let book: Book;
  try {
    book = await getBook();
    review(payload.plan, book);
  } catch {
    return response.status(503).json({
      error: 'Binance verification is unavailable. No review was produced.',
    });
  }
  try {
    const comparison = verifyAgentMarket(agentBook, book);
    return response.status(200).json({
      ...review(payload.plan, book),
      evidenceSource: 'Agent OS request · Binance verified',
      agentEvidence: { updateId: agentBook.updateId, ...comparison },
      execution: 'No order placed',
    });
  } catch {
    return response.status(400).json({
      error: 'Agent OS snapshot does not match the current Binance market.',
    });
  }
}
