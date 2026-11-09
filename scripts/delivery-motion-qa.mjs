import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const previewPassword=process.env.SOMA_PREVIEW_PASSWORD;
assert(previewPassword,'Set SOMA_PREVIEW_PASSWORD for protected-preview checks.');
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 const blocked=await page.request.get('http://127.0.0.1:4191/soma/assets/precision-ring-lighting.webp');assert.equal(blocked.status(),401);checks.push('Lossless lighting reflection asset requires authentication');
 const blockedJS=await page.request.get('http://127.0.0.1:4191/soma/assets/precision-ring-3d.js');assert.equal(blockedJS.status(),401);checks.push('3D bundle requires authentication');
 await page.goto('http://127.0.0.1:4191/soma/');
 await page.locator('input[type=password]').fill(previewPassword);await page.locator('button[type=submit]').click();
 await page.waitForFunction(()=>window.somaRingState?.().ready);assert.equal((await page.evaluate(()=>somaRingState())).failed,false);checks.push('Configured password unlocks the complete package and 3D version A');
 assert.equal((await page.evaluate(()=>somaRingState())).framing,'phone');assert.ok(await page.locator('.hero-ring-fallback').evaluate(image=>image.currentSrc.includes('ring-poster-phone-')));checks.push('Protected phone selects matching camera and first-frame poster');
 assert.equal(await page.locator('.hero-ring-stage button').count(),0);const angle=await page.evaluate(()=>somaRingState().angle);await page.waitForTimeout(300);assert.ok((await page.evaluate(()=>somaRingState().angle))>angle);checks.push('Phone ring spins automatically without play/pause controls');
 const hdr=await page.request.get('http://127.0.0.1:4191/soma/assets/precision-ring-lighting.webp');assert.equal(hdr.status(),200);assert.equal(hdr.headers()['content-type'],'image/webp');assert.equal((await hdr.body()).length,fs.statSync('dist/assets/precision-ring-lighting.webp').size);checks.push('Authenticated Lossless lighting streams with correct MIME and full length');
 await page.locator('#theme-toggle').click();await page.waitForFunction(()=>!document.documentElement.classList.contains('theme-transition'));assert.equal(await page.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(16, 23, 25)');
 await page.screenshot({path:'artifacts/site-motion-update/host-protected-phone-dark.png'});checks.push('Protected site theme transition completes');
 const row=page.locator('.details-list details').nth(1);await page.locator('.details-section').scrollIntoViewIfNeeded();await page.waitForTimeout(700);await row.locator('summary').click();await page.waitForTimeout(450);assert.equal(await row.locator('summary').getAttribute('aria-expanded'),'true');checks.push('Protected site FAQ transition completes');
 const range=await page.request.get('http://127.0.0.1:4191/soma/assets/soma-launch.mp4',{headers:{Range:'bytes=0-127'}});assert.equal(range.status(),206);assert.equal((await range.body()).length,128);checks.push('Existing film still streams by byte range');
 await page.evaluate(()=>scrollTo(0,0));await page.setViewportSize({width:1280,height:900});
 await page.waitForTimeout(200);
 const controls=()=>page.locator('.header-actions').evaluate(e=>[e,e.querySelector('#language'),e.querySelector('#theme-toggle')].map(el=>{const r=el.getBoundingClientRect();return [r.x,r.y,r.width,r.height];}));
 const positions=await controls();await page.locator('.language-option[data-language="ja"]').click();assert.deepEqual(await controls(),positions);assert.equal(await page.locator('html').getAttribute('lang'),'ja');
 assert.deepEqual(await page.locator('.site-header nav a').evaluateAll(es=>es.map(e=>e.getAttribute('href'))),['#film','#scheduler','#approach','#details']);
 checks.push('Protected header has four ordered links and fixed language/theme geometry after switching to Japanese');
 for(const width of [768,1440]){
  await page.setViewportSize({width,height:950});await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>somaRingState().framing==='wide'&&somaRingState().running);
  const start=await page.evaluate(()=>somaRingState());await page.waitForTimeout(250);const end=await page.evaluate(()=>somaRingState());
  assert.ok(end.angle>start.angle);assert.deepEqual(end.camera,start.camera);assert.deepEqual(end.axis,[0,1,0]);assert.equal(end.meshInfo.triangles,19562);assert.equal(end.drawCalls,6);
 }
 checks.push('Protected tablet and desktop rotate about the machining axis with the calibrated camera fixed');
 assert.equal(await page.getByRole('button',{name:/Sign out|ログアウト/}).count(),0);assert.equal(await page.locator('form[action*="logout"]').count(),0);
 assert.equal(await page.locator('.private-preview-note').innerText(),'Private preview / 限定公開');checks.push('Private preview note remains without a Sign out button');
 const cdp=await page.context().newCDPSession(page);await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:40,downloadThroughput:1250000,uploadThroughput:1250000});
 await page.setViewportSize({width:390,height:844});await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>somaRingState().running,null,{timeout:20000,polling:50});
 const cold=await page.evaluate(()=>({readyMs:somaRingState().readyAt,lightingRequests:performance.getEntriesByType('resource').filter(e=>e.name.includes('precision-ring-lighting.webp')).length}));assert.equal(cold.lightingRequests,1);
 checks.push('Cache-disabled protected PHP page starts 3D in '+Math.round(cold.readyMs)+' ms at 10 Mbps / 40 ms, with one lighting download');
 assert.deepEqual(errors,[]);fs.writeFileSync('artifacts/site-motion-update/host-results.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({checks,errors}));
}catch(error){
 console.log(JSON.stringify({url:page.url(),pageText:(await page.locator('body').innerText()).slice(0,600),errors}));await page.screenshot({path:'artifacts/site-motion-update/host-failure.png'});throw error;
}finally{await browser.close();}
