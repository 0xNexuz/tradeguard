import { getBook } from '../lib/market.js';

type Reply = {
  status(code: number): Reply;
  json(value: unknown): void;
  setHeader(name: string, value: string): void;
};

export default async function handler(
  request: { method?: string },
  response: Reply,
) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    return response.status(200).json(await getBook());
  } catch {
    return response.status(503).json({
      error: 'Binance public market feed unavailable. No demo prices substituted.',
    });
  }
}
