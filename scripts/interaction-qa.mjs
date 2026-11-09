import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/site-motion-update';fs.mkdirSync(out,{recursive:true});
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const before=fs.readFileSync(out+'/index-before.html','utf8'),after=fs.readFileSync('dist/index.html','utf8');
const dictionary=s=>JSON.parse(s.match(/const ja = (\{[\s\S]*?\n\});/)[1]);
const nonNavigation=d=>Object.fromEntries(Object.entries(d).filter(([key])=>!key.startsWith('nav')));
assert.deepEqual(nonNavigation(dictionary(fs.readFileSync(out+'/app-before.js','utf8'))),nonNavigation(dictionary(fs.readFileSync('dist/app.js','utf8'))),'Japanese content outside navigation is unchanged');
const copy={homepageBody:hash(after.slice(after.indexOf('<body'))),translations:hash(fs.readFileSync('dist/app.js')),outsideNavigationUnchanged:true};
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const proof=await browser.newPage();
const texts=await proof.evaluate(({before,after})=>{const get=html=>{const doc=new DOMParser().parseFromString(html,'text/html');return [...doc.querySelectorAll('main [data-i18n],footer [data-i18n],dialog [data-i18n]')].map(el=>[el.dataset.i18n,el.innerHTML]);};return {before:get(before),after:get(after)};},{before,after});
assert.deepEqual(texts.after,texts.before,'English content outside navigation is unchanged');await proof.close();
const report={copy,layouts:[],interactions:[],errors:[],failed:[]};
const observe=page=>{page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.failed.push(r.status()+' '+r.url());});};
try{
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});observe(page);
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>window.somaRingState?.().ready);await page.evaluate(()=>document.fonts.ready);
  assert.equal((await page.evaluate(()=>somaRingState())).running,false);
  await page.addScriptTag({path:path.resolve('node_modules/axe-core/axe.min.js')});
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme-toggle').click();
   for(const lang of ['en','ja']){
    if(await page.locator('html').getAttribute('lang')!==lang)await page.locator(`.language-option[data-language="${lang}"]`).click();
    const scan=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});
    assert.deepEqual(scan,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const prefix=`${out}/${width}-${theme}-${lang}`;
    await page.screenshot({path:prefix+'-top.png'});
    if(lang==='en')await page.screenshot({path:prefix+'-full.png',fullPage:true});
    const second=page.locator('.details-list details').nth(1);await second.locator('summary').click();assert.equal(await second.getAttribute('open'),'');
    await second.locator('summary').click();assert.equal(await second.getAttribute('open'),null);
    report.layouts.push({width,theme,lang,violations:scan,static3D:true,overflow:false});
    await page.evaluate(()=>scrollTo(0,0));
   }
  }
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:960},recordVideo:{dir:out+'/moving',size:{width:1440,height:960}}});observe(page);
 await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>somaRingState?.().ready&&somaRingState().seconds>.25);await page.waitForTimeout(1600);
 const a=await page.evaluate(()=>({ring:somaRingState(),outer:gsap.getProperty(document.querySelector('.site-header .ring-outer'),'rotation')}));
 await page.locator('#theme-toggle').click();
 await page.waitForFunction(()=>document.documentElement.classList.contains('theme-transition'));
 await page.waitForTimeout(170);await page.screenshot({path:out+'/theme-mid-transition.png'});
 const mixed=await page.evaluate(()=>({background:getComputedStyle(document.body).backgroundColor,logo:Number(getComputedStyle(document.querySelector('.site-header .brand-name .logo-art-dark')).opacity)}));
 assert.ok(mixed.background!=='rgb(255, 255, 255)'&&mixed.background!=='rgb(16, 23, 25)');assert.ok(mixed.logo>0&&mixed.logo<1);
 await page.waitForFunction(()=>!document.documentElement.classList.contains('theme-transition'));
 const b=await page.evaluate(()=>({ring:somaRingState(),outer:gsap.getProperty(document.querySelector('.site-header .ring-outer'),'rotation')}));
 assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');assert.ok(b.outer>a.outer);assert.ok(b.ring.angle>a.ring.angle);assert.deepEqual(b.ring.camera,a.ring.camera);assert.deepEqual(b.ring.axis,[0,1,0]);
 assert.ok(await page.locator('.site-header .brand-name').evaluate(e=>Number(getComputedStyle(e).opacity)===1));
 report.interactions.push('Theme dissolves with original logos; both rotations retain phase and fixed camera');
 // Rapid reverse changes settle on the most recent requested theme.
 await page.locator('#theme-toggle').click();await page.locator('#theme-toggle').click();await page.waitForTimeout(650);assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
 assert.equal(await page.locator('.hero-ring-stage button').count(),0);const auto=await page.evaluate(()=>somaRingState());await page.waitForTimeout(250);assert.ok((await page.evaluate(()=>somaRingState())).seconds>auto.seconds);
 report.interactions.push('Ring rotates automatically without play/pause controls');
 const row=page.locator('.details-list details').nth(1);await row.scrollIntoViewIfNeeded();await page.waitForTimeout(700);
 const h0=await row.evaluate(e=>e.getBoundingClientRect().height);await row.locator('summary').click();await page.waitForTimeout(70);const hm=await row.evaluate(e=>e.getBoundingClientRect().height);await page.screenshot({path:out+'/faq-mid-open.png'});await page.waitForTimeout(450);const h1=await row.evaluate(e=>e.getBoundingClientRect().height);
 assert.ok(hm>h0&&hm<h1);assert.equal(await row.locator('summary').getAttribute('aria-expanded'),'true');
 assert.equal(await row.locator('summary').evaluate(e=>getComputedStyle(e,'::after').maskImage),'none');
 await page.locator('.details-list').screenshot({path:out+'/faq-expanded.png'});
 await row.locator('summary').focus();await page.keyboard.press('Space');await page.waitForTimeout(400);assert.equal(await row.getAttribute('open'),null);
 await page.keyboard.press('Enter');await page.waitForTimeout(55);await page.keyboard.press('Enter');await page.waitForTimeout(400);assert.equal(await row.getAttribute('open'),null);
 assert.equal(await row.evaluate(e=>e.style.height),'');
 report.interactions.push('FAQ opens, closes, and reverses smoothly with no residual height');
 // Locale changes while an answer is moving must restore its natural translated height.
 await row.locator('summary').click();await page.locator('.language-option[data-language="ja"]').click();await page.waitForTimeout(500);assert.equal(await row.evaluate(e=>e.style.height),'');assert.equal(await row.locator('summary').getAttribute('aria-expanded'),'true');
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(200);assert.equal((await page.evaluate(()=>somaRingState())).running,false);await page.locator('#theme-toggle').click();assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('theme-transition')),false);
 report.interactions.push('Reduced motion disables continuous 3D and theme/disclosure transitions dynamically');
 await page.close();
 // Force the compatibility fallback rather than relying on a browser that has native transitions.
 const fallback=await browser.newPage({viewport:{width:390,height:844}});observe(fallback);await fallback.addInitScript(()=>{CSS.registerProperty=undefined;});await fallback.goto('http://127.0.0.1:4173/');await fallback.waitForTimeout(1600);await fallback.locator('#theme-toggle').click();await fallback.waitForTimeout(100);
 const opacity=await fallback.locator('.site-header .brand-name .logo-art-dark').evaluate(e=>Number(getComputedStyle(e).opacity));assert.ok(opacity>0&&opacity<1);await fallback.waitForTimeout(600);assert.equal(await fallback.locator('html').getAttribute('data-theme'),'dark');await fallback.close();
 report.interactions.push('Compatibility path crossfades the original PNG wordmark layers');
 // A WebGL failure must retain the original high-quality illustration.
 const unavailable=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});observe(unavailable);await unavailable.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){if(type.startsWith('webgl'))return null;return get.call(this,type,...args);};});await unavailable.goto('http://127.0.0.1:4173/');await unavailable.waitForFunction(()=>somaRingState?.().failed);assert.equal(await unavailable.locator('.hero-ring-fallback').evaluate(e=>Number(getComputedStyle(e).opacity)),1);assert.ok(await unavailable.locator('.hero-ring-fallback').evaluate(e=>e.currentSrc.includes('ring-poster-phone-')));await unavailable.close();
 report.interactions.push('No-WebGL fallback retains matching first-frame poster');
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failed,[]);
 fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
