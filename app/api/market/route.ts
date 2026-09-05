import {getBook} from '@/lib/market';
export const dynamic='force-dynamic';
export async function GET() {
  try { return Response.json(await getBook(),{headers:{'Cache-Control':'no-store'}}); }
  catch { return Response.json({error:'Binance public market feed is unavailable. No demo prices were substituted.'},{status:503}); }
}

