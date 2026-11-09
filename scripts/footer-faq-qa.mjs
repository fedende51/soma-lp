import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const previewPassword=process.env.SOMA_PREVIEW_PASSWORD;
assert(previewPassword,'Set SOMA_PREVIEW_PASSWORD for protected-preview checks.');
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/footer-faq-update';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={baseline:[],views:[],errors:[]};
const watch=async page=>{
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.addInitScript(()=>{window.scrollCalls=[];const native=window.scrollTo.bind(window);window.scrollTo=(...args)=>{scrollCalls.push({args,y:scrollY});return native(...args);};});
};
const footerProof=async page=>page.locator('.footer-tagline').evaluate(e=>{
 const range=document.createRange();range.selectNodeContents(e);
 return {text:e.textContent,font:getComputedStyle(e).fontFamily,lines:range.getClientRects().length,width:e.getBoundingClientRect().width,overflow:document.documentElement.scrollWidth>innerWidth};
});
try{
 // The previous controller briefly sends the page to zero on every toggle,
 // even on browsers that happen to restore the final position successfully.
 for(const width of [390,768]){
  const p=await browser.newPage({viewport:{width,height:844},hasTouch:true,isMobile:width===390});await watch(p);
  await p.route('**/interactions.js?*',r=>r.fulfill({status:200,contentType:'text/javascript',body:fs.readFileSync('../delivery/SOMA-upload-60fps/soma-private/site/interactions.js','utf8')}));
  await p.goto('http://127.0.0.1:4173/');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
  const row=p.locator('.details-list summary').nth(1);await row.scrollIntoViewIfNeeded();await p.waitForTimeout(500);await p.evaluate(()=>scrollCalls.length=0);
  await row.tap();await p.waitForTimeout(450);const calls=await p.evaluate(()=>scrollCalls);
  assert.ok(calls.some(c=>c.args[0]===0&&c.args[1]===0));report.baseline.push({width,calls});await p.close();
 }
 for(const width of [320,390,768,1440]){
  const p=await browser.newPage({viewport:{width,height:844},hasTouch:true,isMobile:width<=390});await watch(p);
  await p.goto('http://127.0.0.1:4191/soma/?v=plex-stable-faq');await p.evaluate(()=>document.fonts.ready);
  const login=await p.locator('footer').evaluate(e=>({text:e.textContent.trim(),font:getComputedStyle(e).fontFamily,overflow:document.documentElement.scrollWidth>innerWidth}));assert.equal(login.overflow,false);assert.ok(login.font.includes('IBM Plex Sans'));assert.equal(login.text,'© 2026 SOMA Co., Ltd.');
  assert.equal(await p.locator('.footer-tagline br').count(),0);await p.screenshot({path:`${out}/${width}-login.png`});
  await p.locator('input[type=password]').fill(previewPassword);await p.locator('button[type=submit]').click();await p.waitForSelector('body.language-ready');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(1500);
  assert.equal(await p.getByRole('button',{name:/Sign out|ログアウト/}).count(),0);assert.equal(await p.locator('form[action*="logout"]').count(),0);
  assert.equal(await p.locator('.private-preview-note').innerText(),'Private preview / 限定公開');
  const states=[];
  for(const lang of ['en','ja']){
   await p.locator(`.language-option[data-language="${lang}"]`).click();await p.evaluate(()=>document.fonts.ready);
   const footer=await footerProof(p);assert.equal(footer.lines,1);assert.equal(footer.overflow,false);assert.ok(footer.font.includes('IBM Plex Sans'));
   await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
   const violations=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>v.id);});assert.deepEqual(violations,[]);
   const toggles=[];
   for(let index=0;index<5;index++){
    const row=p.locator('.details-list details').nth(index),summary=row.locator('summary');
    await summary.scrollIntoViewIfNeeded();await p.waitForTimeout(450);
    for(let action=0;action<2;action++){
     const start=await p.evaluate(()=>{scrollCalls.length=0;return scrollY;});
     const wasExpanded=await summary.getAttribute('aria-expanded');await summary.tap();await p.waitForTimeout(420);
     const after=await p.evaluate(()=>({y:scrollY,calls:scrollCalls}));assert.ok(start>1000&&after.y>1000,'Remains at section 04');
     assert.equal(after.calls.some(c=>c.args[0]===0&&c.args[1]===0),false,'No scroll-to-top during open or close');
     assert.notEqual(await summary.getAttribute('aria-expanded'),wasExpanded);assert.equal(await row.evaluate(e=>e.style.height),'');
     toggles.push({index,action,before:start,after:after.y,scrollCalls:after.calls});
    }
   }
   await p.locator('.details-list').screenshot({path:`${out}/${width}-${lang}-faq.png`});
   await p.locator('footer').scrollIntoViewIfNeeded();await p.waitForTimeout(600);await p.screenshot({path:`${out}/${width}-${lang}-footer.png`});
   states.push({lang,footer,violations,toggles});
   await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.waitForTimeout(200);
  }
  report.views.push({width,login,states});await p.close();
 }
 assert.deepEqual(report.errors,[]);fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({baseline:report.baseline.map(b=>({width:b.width,scrollToZeroCalls:b.calls.filter(c=>c.args[0]===0&&c.args[1]===0).length})),views:report.views.map(v=>({width:v.width,login:v.login,states:v.states.map(s=>({lang:s.lang,lines:s.footer.lines,violations:s.violations,toggles:s.toggles.length}))})),errors:report.errors}));
}finally{await browser.close();}
