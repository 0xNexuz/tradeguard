import { review, validatePlan, type Book, type Plan } from '../lib/risk.js';

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

export default function handler(
  request: { method?: string; body?: unknown },
  response: Reply,
) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    const payload = (typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body) as Payload;
    if (payload.source !== 'binance-agent-os-mcp') throw new Error();
    validatePlan(payload.plan);
    const book: Book = { ...payload.book, receivedAt: Date.now() };
    return response.status(200).json({
      ...review(payload.plan, book),
      evidenceSource: 'Binance Agent OS MCP',
      execution: 'No order placed',
    });
  } catch {
    return response.status(400).json({
      error: 'Invalid Agent OS snapshot. The check was blocked.',
    });
  }
}
