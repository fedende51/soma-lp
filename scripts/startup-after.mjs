import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true}),runs=[];
try{
 for(const throttled of [false,true])for(let run=0;run<3;run++){
  const p=await browser.newPage({viewport:{width:390,height:844}}),cdp=await p.context().newCDPSession(p),requests=[];
  p.on('request',r=>{if(r.url().includes('precision-ring-lighting.webp'))requests.push(r.url());});
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  if(throttled)await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:1250000,uploadThroughput:1250000});
  await p.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});await p.waitForFunction(()=>window.somaRingState?.().running,null,{timeout:45000,polling:50}).catch(async error=>{console.log(JSON.stringify({throttled,run,state:await p.evaluate(()=>somaRingState()),requests}));throw error;});
  const observation=await p.evaluate(({throttled,run})=>({throttled,run,readyMs:somaRingState().readyAt,resources:performance.getEntriesByType('resource').filter(e=>/precision-ring|ring-metal-worker/.test(e.name)).map(e=>({name:e.name,bytes:e.encodedBodySize,start:e.startTime,end:e.responseEnd}))}),{throttled,run});
  assert.equal(requests.length,1,'Lighting must download only once, including with cache disabled');observation.lightingRequests=requests.length;runs.push(observation);console.log(JSON.stringify({throttled,run,readyMs:observation.readyMs}));await p.close();
 }
 const baseline=JSON.parse(fs.readFileSync('artifacts/fast-start-login/baseline.json','utf8')).startup;
 const summary=[false,true].map(throttled=>{
  const values=runs.filter(r=>r.throttled===throttled).map(r=>r.readyMs).sort((a,b)=>a-b),before=baseline.find(r=>r.throttled===throttled).readyMs;
  return {throttled,baselineMs:before,newMedianMs:values[1],improvementPercent:Math.round((1-values[1]/before)*100)};
 });
 const report={conditions:{browser:'Local headless Chrome',viewport:[390,844],cache:'disabled',throttledNetwork:'10 Mbps downstream, 40 ms latency',cpu:'unthrottled desktop CPU',baselineRuns:1,newRuns:3},summary,runs};
 fs.writeFileSync('artifacts/fast-start-login/startup-after.json',JSON.stringify(report,null,2));console.log(JSON.stringify({summary}));
}finally{await browser.close();}
