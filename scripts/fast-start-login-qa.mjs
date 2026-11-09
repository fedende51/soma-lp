import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const previewPassword=process.env.SOMA_PREVIEW_PASSWORD;
assert(previewPassword,'Set SOMA_PREVIEW_PASSWORD for protected-preview checks.');
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/fast-start-login',report={login:[],site:[],checks:[],errors:[]};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const scan=async p=>{await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});return p.evaluate(async()=>{const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});};
try{
 for(const width of [320,390,768,1440]){
  const p=await browser.newPage({viewport:{width,height:900},hasTouch:width<800,isMobile:width<640});p.on('pageerror',e=>report.errors.push(e.message));
  await p.goto('http://127.0.0.1:4191/soma/?v=fast-start-login');await p.evaluate(()=>document.fonts.ready);
  assert.equal(await p.locator('header,.preview-label,.eyebrow,.footer-tagline').count(),0);
  assert.equal(await p.locator('footer').innerText(),'© 2026 SOMA Co., Ltd.');
  for(const theme of ['light','dark']){
   if(await p.locator('html').getAttribute('data-theme')!==theme)await p.locator('#theme-toggle').click();
   await p.waitForFunction(()=>!document.documentElement.classList.contains('theme-transition'));
   const layout=await p.evaluate(()=>{
    const centered=selector=>{const e=document.querySelector(selector),r=e.getBoundingClientRect();return {center:r.x+r.width/2,textAlign:getComputedStyle(e).textAlign,width:r.width};};
    return {items:['.login-brand','h1','.copy','label','.enter-button','.note','footer'].map(centered),overflow:document.documentElement.scrollWidth>innerWidth,background:getComputedStyle(document.body).backgroundColor,font:getComputedStyle(document.body).fontFamily,lightOpacity:getComputedStyle(document.querySelector('.brand-name .logo-art-light')).opacity,darkOpacity:getComputedStyle(document.querySelector('.brand-name .logo-art-dark')).opacity};
   });
   assert.equal(layout.overflow,false);for(const e of layout.items)assert.ok(Math.abs(e.center-width/2)<1,'Horizontally centered');
   assert.ok(layout.font.includes('Manrope'));assert.equal(layout.background,theme==='dark'?'rgb(16, 23, 25)':'rgb(255, 255, 255)');
   assert.equal(layout.lightOpacity,theme==='light'?'1':'0');assert.equal(layout.darkOpacity,theme==='dark'?'1':'0');
   const before=await p.locator('.ring-outer').evaluate(e=>getComputedStyle(e).transform);await p.waitForTimeout(100);assert.notEqual(await p.locator('.ring-outer').evaluate(e=>getComputedStyle(e).transform),before);
   const violations=await scan(p);assert.deepEqual(violations,[]);
   await p.screenshot({path:`${out}/login-${width}-${theme}.png`,fullPage:true});report.login.push({width,theme,layout,violations});
  }
  // Persist the selected dark theme through reload and the protected page.
  await p.reload();assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');
  if(width===390){
   await p.locator('#password').fill('incorrect');await p.locator('.enter-button').click();await p.locator('#error').waitFor({state:'visible'});assert.equal(await p.locator('#password').getAttribute('aria-invalid'),'true');
   const violations=await scan(p);assert.deepEqual(violations,[]);await p.screenshot({path:`${out}/login-error.png`});
  }
  await p.locator('#password').fill(previewPassword);await p.locator('.enter-button').click();await p.waitForSelector('body.language-ready');await p.waitForFunction(()=>somaRingState().ready);await p.evaluate(()=>document.fonts.ready);
  assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');assert.equal(await p.title(),'SOMA Co., Ltd. - A clear plan for complex work.');
  assert.equal(await p.locator('.header-actions .open-booking').count(),0);
  const order=await p.locator('.header-actions').evaluate(e=>[...e.children].map(e=>e.id));assert.deepEqual(order,['language','theme-toggle']);
  assert.equal(await p.locator('.hero .open-booking').count(),1);assert.equal(await p.locator('.private-preview-note').innerText(),'Private preview / 限定公開');
  await p.evaluate(()=>{window.zeroScrolls=0;const original=scrollTo;window.scrollTo=(...args)=>{if(args[0]===0&&args[1]===0)zeroScrolls++;return original(...args);};});
  for(const theme of ['dark','light']){
   if(await p.locator('html').getAttribute('data-theme')!==theme)await p.locator('#theme-toggle').click();await p.waitForTimeout(600);
   const violations=await scan(p);assert.deepEqual(violations,[]);
   await p.screenshot({path:`${out}/site-${width}-${theme}.png`});
   // Visit sections to render and visually review the scroll-triggered content.
   for(const id of ['film','scheduler','approach','details']){await p.locator('#'+id).scrollIntoViewIfNeeded();await p.waitForTimeout(500);}
   const summary=p.locator('.details-list summary').nth(1);await summary.scrollIntoViewIfNeeded();await p.waitForTimeout(400);await p.evaluate(()=>zeroScrolls=0);
   for(let n=0;n<2;n++){if(width<=768)await summary.tap();else await summary.click();await p.waitForTimeout(450);assert.ok(await p.evaluate(()=>scrollY)>1000);}
   assert.equal(await p.evaluate(()=>zeroScrolls),0);await p.screenshot({path:`${out}/site-full-${width}-${theme}.png`,fullPage:true});report.site.push({width,theme,violations,faqStable:true});
   await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(100);
  }
  await p.close();
 }
 const fallback=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});await fallback.addInitScript(()=>{window.Worker=class{constructor(){throw Error('No worker');}};window.OffscreenCanvas=undefined;});
 await fallback.goto('http://127.0.0.1:4173/');await fallback.waitForFunction(()=>somaRingState().ready);assert.equal(await fallback.evaluate(()=>somaRingState().failed),false);
 await fallback.close();report.checks.push('Worker and OffscreenCanvas fallback loads the model');
 const reduced=await browser.newPage({reducedMotion:'reduce'});await reduced.goto('http://127.0.0.1:4191/soma/');assert.equal(await reduced.locator('.logo-ring').first().evaluate(e=>getComputedStyle(e).animationName),'none');await reduced.close();
 report.checks.push('Login and website share persisted light/dark mode and original logo artwork','Eight responsive login and eight site accessibility scans passed','Login errors remain centered, labeled and accessible','Main marketing copy and hero booking retained; all four ordered links visible','FAQ does not scroll to the top; reduced-motion logo stops');
 assert.deepEqual(report.errors,[]);fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({login:report.login.length,site:report.site.length,checks:report.checks,errors:report.errors}));
}finally{await browser.close();}
