import {getBook} from '@/lib/market';
import {validatePlan, review, type Plan} from '@/lib/risk';
export const dynamic='force-dynamic';
export async function POST(request:Request) {
  let plan:Plan;
  try { const raw=await request.text(); if(raw.length>4096) throw new Error(); plan=JSON.parse(raw); validatePlan(plan); }
  catch { return Response.json({error:'Invalid plan. Check your numeric fields and limits.'},{status:400}); }
  try { const book=await getBook(); return Response.json(review(plan,book),{headers:{'Cache-Control':'no-store'}}); }
  catch { return Response.json({error:'A fresh Binance order book could not be verified. Check blocked; retry shortly.'},{status:503}); }
}

