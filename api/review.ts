import { getBook } from '../lib/market.js';
import { review, validatePlan, type Plan } from '../lib/risk.js';

type Reply = {
  status(code: number): Reply;
  json(value: unknown): void;
  setHeader(name: string, value: string): void;
};

export default async function handler(
  request: { method?: string; body?: unknown },
  response: Reply,
) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }
  let plan: Plan;
  try {
    plan = (typeof request.body === 'string'
      ? JSON.parse(request.body)
      : request.body) as Plan;
    validatePlan(plan);
  } catch {
    return response.status(400).json({
      error: 'Invalid plan. Check your numeric fields and limits.',
    });
  }
  try {
    return response.status(200).json(review(plan, await getBook()));
  } catch {
    return response.status(503).json({
      error: 'A fresh Binance order book could not be verified. Check blocked.',
    });
  }
}
