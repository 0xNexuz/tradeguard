import assert from 'node:assert/strict';
import handler from '../api/review-agent.ts';

const plan={amount:1500,budget:1000,portfolio:5000,holding:500,exposure:25,slippage:0.5};
const market={lastUpdateId:11,bids:[['100','2']],asks:[['101','10'],['102','10']]};
const request=(book)=>({method:'POST',body:{source:'binance-agent-os-mcp',plan,book}});
function response(){
  const state={statusCode:200,body:null,headers:{}};
  return {state,status(code){state.statusCode=code;return this;},json(value){state.body=value;},setHeader(name,value){state.headers[name]=value;}};
}

const originalFetch=globalThis.fetch;
try {
  globalThis.fetch=async()=>new Response(JSON.stringify(market),{status:200});
  const ok=response();
  await handler(request({bid:100,asks:[[101,10]],updateId:10}),ok);
  assert.equal(ok.state.statusCode,200);
  assert.equal(ok.state.body.candidate,750);
  assert.equal(ok.state.body.evidenceSource,'Agent OS request · Binance verified');
  assert.equal(ok.state.body.execution,'No order placed');

  const mismatch=response();
  await handler(request({bid:50,asks:[[51,10]],updateId:10}),mismatch);
  assert.equal(mismatch.state.statusCode,400);

  globalThis.fetch=async()=>new Response('unavailable',{status:503});
  const unavailable=response();
  await handler(request({bid:100,asks:[[101,10]],updateId:10}),unavailable);
  assert.equal(unavailable.state.statusCode,503);
} finally {
  globalThis.fetch=originalFetch;
}

console.log('3 Agent OS endpoint checks passed: verified review, mismatch rejection, and upstream failure.');
