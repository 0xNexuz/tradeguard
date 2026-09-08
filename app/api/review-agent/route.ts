import { getBook } from '@/lib/market';
import { review, validatePlan, verifyAgentMarket, type Book, type Plan } from '@/lib/risk';

export const dynamic = 'force-dynamic';

type AgentReviewRequest = {
  source: 'binance-agent-os-mcp';
  plan: Plan;
  book: Omit<Book, 'receivedAt'>;
};

export async function POST(request: Request) {
  let payload: AgentReviewRequest;
  let agentBook: Book;
  try {
    const raw = await request.text();
    if (raw.length > 65536) throw new Error('Payload too large.');
    payload = JSON.parse(raw) as AgentReviewRequest;
    if (payload.source !== 'binance-agent-os-mcp') throw new Error('Invalid source.');
    validatePlan(payload.plan);
    const receivedAt = Date.now();
    agentBook = { ...payload.book, receivedAt };
    review(payload.plan, agentBook, receivedAt);
  } catch {
    return Response.json(
      { error: 'Invalid Agent OS snapshot. The check was blocked.' },
      { status: 400 },
    );
  }
  let book: Book;
  try {
    book = await getBook();
    review(payload.plan, book);
  } catch {
    return Response.json(
      { error: 'Binance verification is unavailable. No review was produced.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  try {
    const comparison = verifyAgentMarket(agentBook, book);
    const result = review(payload.plan, book);
    return Response.json(
      { ...result, evidenceSource: 'Agent OS request · Binance verified', agentEvidence: { updateId: agentBook.updateId, ...comparison }, execution: 'No order placed' },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { error: 'Agent OS snapshot does not match the current Binance market.' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}
