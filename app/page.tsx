'use client';
import {useState,useEffect,useRef} from 'react';
import {ArrowRight,Check,CircleAlert,Gauge,ShieldCheck,RefreshCw,Download} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {review, type Book,type Plan,type Review} from '@/lib/risk';

const money=(n:number)=>n.toLocaleString('en-US',{maximumFractionDigits:2});
const initial:Plan={amount:1500,budget:1000,portfolio:5000,holding:500,exposure:25,slippage:0.5};
export default function Home(){
 const [plan,setPlan]=useState<Plan>(initial);
 const [book,setBook]=useState<Book|null>(null);
 const [result,setResult]=useState<Review|null>(null);
 const [error,setError]=useState('');
 const [feedError,setFeedError]=useState('');
 const [busy,setBusy]=useState(false);
 const [now,setNow]=useState(0);
 const generation=useRef(0);
 const planRef=useRef(plan);
 const fresh=!!book && now-book.receivedAt<=15000 && !feedError;
 const validResult=!!result && now-result.checkedAt<=15000;
 async function refresh(){
  try{
   const response=await fetch('/api/market',{cache:'no-store',signal:AbortSignal.timeout(12000)});
   const value=await response.json() as Book & Review & {error?:string};
   if(!response.ok) throw new Error(value.error);
   review(initial,value);
   setBook(value);setFeedError('');
  }catch(e){setFeedError(e instanceof Error?e.message:'Market unavailable.');}
 }
 useEffect(()=>{void refresh();const ticker=setInterval(()=>setNow(Date.now()),1000);const poll=setInterval(()=>void refresh(),15000);setNow(Date.now());return()=>{clearInterval(ticker);clearInterval(poll);};},[]);
 function update(key:keyof Plan,value:number){generation.current++;const next={...planRef.current,[key]:value};planRef.current=next;setPlan(next);setResult(null);setError('');setBusy(false);}
 async function check(next=planRef.current){
  const id=++generation.current;setBusy(true);setError('');setResult(null);
  try{
   const response=await fetch('/api/review',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(next),signal:AbortSignal.timeout(15000)});
   const value=await response.json() as Book & Review & {error?:string};
   if(!response.ok) throw new Error(value.error);
   if(id!==generation.current)return;
   setResult(value);setBook(value.book);setFeedError('');setNow(Date.now());return value;
  }catch(e){if(id===generation.current)setError(e instanceof Error?e.message:'Check failed.');}
  finally{if(id===generation.current)setBusy(false);}
 }
 async function revise(){if(!result||result.candidate<10)return;const next={...planRef.current,amount:result.candidate};planRef.current=next;setPlan(next);await check(next);}
 function download(){if(!result)return;const data={...result,source:'Binance Spot public REST API',symbol:'BTCUSDT',accountInputs:'Manually entered; not authenticated balances',execution:'No order placed',limitations:'Snapshot estimate, excludes fees, latency, and exchange order filters.'};const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='tradeguard-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 useEffect(()=>{
  const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>unknown}}).modelContext;
  if(!context?.registerTool)return;const lifecycle=new AbortController();
  try{Promise.resolve(context.registerTool({name:'check_trading_plan',description:'Check the current visible BTC buy plan using a fresh Binance order book. Updates the review; never submits a trade.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute:async(input:unknown)=>{if(!input||typeof input!=='object'||Object.keys(input).length)throw new Error('No arguments accepted. Configure fields first.');const output=await check();return output?{passed:output.passed,reasons:output.reasons,candidate:output.candidate,updateId:output.book.updateId,execution:'No order placed'}:{error:'Check failed or superseded. See the visible error.'};}},{signal:lifecycle.signal})).catch(()=>{});
  }catch{}return()=>lifecycle.abort();
 },[]);
 const phase=busy?'checking':result?(result.passed&&validResult?'verified':'revised'):'ready';
 const headline=busy?'Reading the order book…':error?'Check unavailable':result?(validResult?(result.passed?'Within the checked limits.':'Your plan needs a revision.'):'This review has expired.'):'Ready when you are.';
 return <main className="app-shell">
 <div className="cosmic-backdrop" aria-hidden="true"/>
 <header className="topbar"><a className="brand" href="#workspace" aria-label="TradeGuard home"><img className="brand-logo" src="/tradeguard-mark.svg" alt=""/><span>TRADEGUARD</span></a><nav className="nav-links" aria-label="Main navigation"><a className="active" href="#workspace">Workspace</a><a href="#guardrails">Guardrails</a><a href="#activity">Evidence</a></nav><div className="mode-pill"><span/>{fresh?'Live Binance feed':feedError?'Feed unavailable':'Refreshing feed'}</div></header>
 <section className="intro"><div className="intro-art" aria-hidden="true"><img src="/human-machine.png" alt=""/><span className="connection-glow"/></div><div className="intro-copy"><p className="eyebrow">TRADEGUARD / PRE-TRADE CHECKS</p><h1>Your intent.<br/><em>Under control.</em></h1><p>Check a trading plan before it becomes a trade.</p></div><div className="intro-note"><ShieldCheck size={18}/><span>Live market evidence.<br/>Your limits, enforced.</span></div></section>
 <section className="workspace" id="workspace" aria-label="Live trading plan checks">
 <div className="plan-panel glass-panel"><div className="panel-heading"><div><p className="panel-index">01 / PLAN</p><h2>Check a BTC buy</h2></div><span className="data-pill">Read-only market access</span></div>
 <div className="market-tape" aria-live="polite"><div><span>Best ask / USDT</span><strong>{book?money(book.asks[0][0]):'—'}</strong></div><div><span>Best bid / USDT</span><strong>{book?money(book.bid):'—'}</strong></div><div><span>Spread</span><strong>{book?((book.asks[0][0]/book.bid-1)*100).toFixed(4)+'%':'—'}</strong></div></div>
 <p className="feed-note">{book?'Snapshot received '+new Date(book.receivedAt).toLocaleTimeString()+' · '+Math.max(0,Math.floor((now-book.receivedAt)/1000))+'s ago':'Connecting to Binance Spot…'} <button onClick={()=>void refresh()} aria-label="Refresh market data"><RefreshCw size={14}/></button></p>
 {feedError&&<p className="error-note" role="alert">{feedError}</p>}
 <div className="fields-row"><div className="field-shell"><span>Trading pair / side</span><strong>BTC / USDT · Buy</strong></div><label className="field-shell amount-field"><span>Order amount</span><Input aria-label="Order amount" type="number" min={10} max={1000000} value={plan.amount} onChange={e=>update('amount',Number(e.target.value))}/><b>USDT</b></label></div>
 <div className="real-limits" id="guardrails"><p>Enter your own portfolio values. These are not connected account balances.</p>
 {([['budget','Cash budget / USDT'],['portfolio','Portfolio value / USDT'],['holding','Current BTC value / USDT'],['exposure','Maximum BTC exposure / %'],['slippage','Maximum price impact / %']] as [keyof Plan,string][]).map(([key,label])=><label key={key}><span>{label}</span><Input aria-label={label} type="number" min={key==='slippage'?0.01:0} step={key==='slippage'?0.05:1} value={plan[key]} onChange={e=>update(key,Number(e.target.value))}/></label>)}
 </div><Button className="check-button" onClick={()=>void check()} disabled={busy}>{busy?'Checking live liquidity…':'Check against live market'}{busy?<span className="spinner"/>:<ArrowRight size={18}/>}</Button>
 <p className="scope-note">Checks budget, BTC exposure and estimated buy price impact. Fees and exchange order filters are not included.</p></div>
 <aside className={'agent-panel glass-panel phase-'+phase} aria-live="polite"><img className="agent-figure" src="/liquid-agent.png" alt="Liquid chrome TradeGuard figure"/><div className="agent-scrim"/><div className="agent-content"><p className="panel-index">02 / RISK REVIEW</p><div className={'status-orb '+phase}>{result?.passed&&validResult?<Check size={20}/>:result||error?<CircleAlert size={20}/>:<Gauge size={20}/>}</div><p className="status-label">{busy?'Fetching fresh evidence':result?'Deterministic risk checks':'No review yet'}</p><h2>{headline}</h2>
 {error&&<p className="error-note" role="alert">{error}</p>}
 {result?<><div className="checks">{[['Cash budget',result.plan.amount<=result.plan.budget,money(result.plan.amount)+' / '+money(result.plan.budget)+' USDT'],['BTC exposure',result.exposureAfter<=result.plan.exposure,result.exposureAfter.toFixed(2)+'% / '+result.plan.exposure+'%'],['Estimated price impact',result.impact<=result.plan.slippage,result.impact.toFixed(4)+'% / '+result.plan.slippage+'%']].map(([label,passed,detail])=><div key={String(label)} className={passed?'passed':'failed'}><span>{passed?<Check size={13}/>:'!'}</span><p>{label}<small>{detail}</small></p></div>)}</div>
 {result.reasons.map(reason=><p className="reason" key={reason}>{reason}</p>)}
 <div className={'revision-card '+(result.passed?'verified-card':'')}><span>{result.passed?'Snapshot-based assessment':'Proposed maximum'}</span><strong>{result.passed?money(result.quantity)+' BTC estimated':money(result.candidate)+' USDT'}</strong>{!result.passed&&result.candidate>=10&&<Button className="revision-button" disabled={busy} onClick={()=>void revise()}>Recheck revised amount <ArrowRight size={16}/></Button>}{!validResult&&<Button className="revision-button" onClick={()=>void check()} disabled={busy}>Refresh this review <RefreshCw size={16}/></Button>}<p className="scope-note">No trade executed. Market conditions can change after this snapshot.</p></div></>:<p className="empty-review">Each check fetches the latest 100 sell levels, estimates the fill, and compares your plan with the limits you enter.</p>}
 </div></aside>
 <div className="process-strip" id="activity"><div className="process-step active"><span>01</span><div><b>CHECK</b><small>Fresh Binance snapshot</small></div></div><div className="process-line"/><div className={'process-step '+(result&&!result.passed?'active':'')}><span>02</span><div><b>REPLAN</b><small>Apply your constraints</small></div></div><div className="process-line"/><div className={'process-step '+(result?.passed&&validResult?'active':'')}><span>03</span><div><b>VERIFY</b><small>Recheck on fresh data</small></div></div></div>
 <div className="evidence-bar"><div><strong>Inspect the evidence</strong><p>{result?'Binance update ID '+result.book.updateId+' · '+new Date(result.checkedAt).toLocaleString():'Run a check to export the inputs, order book, calculations and outcome.'}</p></div><Button onClick={download} disabled={!result} variant="outline"><Download size={16}/> Export review</Button></div>
 </section><footer><span>TradeGuard / Binance public data</span><span>Manual account inputs · No AI model or Agent OS session connected · No trades</span></footer></main>;
}


