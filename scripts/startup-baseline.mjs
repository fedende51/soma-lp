import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/fast-start-login';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={views:[],startup:[]};
try{
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:1000}});
  await page.goto('http://127.0.0.1:4191/soma/');await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`${out}/before-login-${width}.png`,fullPage:true});
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>window.somaRingState?.().ready);
  await page.screenshot({path:`${out}/before-site-${width}.png`,fullPage:true});
  report.views.push({width});await page.close();
 }
 for(const throttled of [false,true]){
  const page=await browser.newPage({viewport:{width:390,height:844}}),cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  if(throttled)await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:1250000,uploadThroughput:1250000});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.somaRingState?.().running,null,{timeout:45000,polling:50});
  report.startup.push(await page.evaluate(throttled=>({throttled,readyMs:performance.now(),resources:performance.getEntriesByType('resource').filter(e=>/precision-ring/.test(e.name)).map(e=>({name:e.name,bytes:e.encodedBodySize,start:e.startTime,end:e.responseEnd}))}),throttled));await page.close();
 }
 fs.writeFileSync(`${out}/baseline.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report.startup));
}finally{await browser.close();}
