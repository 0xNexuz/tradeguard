import { getBook } from '@/lib/market';
import { review, validatePlan, verifyAgentMarket, type Book, type Plan } from '@/lib/risk';

export const dynamic = 'force-dynamic';

type AgentReviewRequest = {
  source: 'binance-agent-os-mcp';
  plan: Plan;
  book: Omit<Book, 'receivedAt'>;
};

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (raw.length > 65536) throw new Error('Payload too large.');
    const payload = JSON.parse(raw) as AgentReviewRequest;
    if (payload.source !== 'binance-agent-os-mcp') throw new Error('Invalid source.');
    validatePlan(payload.plan);
    const receivedAt = Date.now();
    const agentBook: Book = { ...payload.book, receivedAt };
    review(payload.plan, agentBook, receivedAt);
    const book = await getBook();
    const comparison = verifyAgentMarket(agentBook, book);
    const result = review(payload.plan, book);
    return Response.json(
      { ...result, evidenceSource: 'Agent OS request · Binance verified', agentEvidence: { updateId: agentBook.updateId, ...comparison }, execution: 'No order placed' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { error: 'Invalid Agent OS snapshot. The check was blocked.' },
      { status: 400 },
    );
  }
}
