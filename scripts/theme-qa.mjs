import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const out='artifacts/theme-final';fs.mkdirSync(out,{recursive:true});
let checks=0;const scans=[],errors=[],failed=[];
const assert=(value,label)=>{if(!value)throw Error(label);checks++;};
const observe=p=>{p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failed.push(r.status()+' '+r.url());});};
const axe=async(p,label)=>{
 const result=await p.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
 scans.push({label,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
};
try{
 for(const width of [320,390,640,641,768,1024,1440]){
  const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce',colorScheme:'dark'});observe(p);
  await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
  assert(await p.locator('html').getAttribute('data-theme')==='light','First visit preserves the white design '+width);
  await p.addScriptTag({path:path.resolve('node_modules/axe-core/axe.min.js')});
  for(const theme of ['light','dark']){
   if(await p.locator('html').getAttribute('data-theme')!==theme)await p.locator('#theme-toggle').click();
   for(const lang of ['en','ja']){
    if(await p.locator('html').getAttribute('lang')!==lang)await p.locator(`.language-option[data-language="${lang}"]`).click();
    const label=`${width}/${theme}/${lang}`;
    assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Page fits '+label);
    assert(await p.locator('body').evaluate((e,dark)=>getComputedStyle(e).backgroundColor===(dark?'rgb(16, 23, 25)':'rgb(255, 255, 255)'),theme==='dark'),'Background matches '+label);
    assert(await p.locator('#theme-toggle').getAttribute('aria-pressed')===String(theme==='dark'),'Switch reports theme '+label);
    const expected=lang==='ja'?(theme==='dark'?'ライトモードに切り替え':'ダークモードに切り替え'):(theme==='dark'?'Switch to light mode':'Switch to dark mode');
    assert(await p.locator('#theme-toggle').getAttribute('aria-label')===expected,'Switch label translated '+label);
    assert(await p.locator('#theme-toggle').evaluate(e=>{const b=e.getBoundingClientRect();return b.width>=44&&b.height>=44;}),'Touch target '+label);
    assert(await p.locator('.brand image').evaluateAll((es,dark)=>es.filter(e=>Number(getComputedStyle(e).opacity)>.99).every(e=>e.getAttribute('href').endsWith(dark?'logo_soma_dark.png':'logo_soma_light.png')),theme==='dark'),'Correct original logo assets '+label);
    assert(await p.locator('.floating-operation,.spotlight-caption').count()===0,'Removed overlays stay absent '+label);
    if([320,390,768,1440].includes(width)){
     await axe(p,label);
     await p.screenshot({path:`${out}/${width}-${theme}-${lang}-full.png`,fullPage:true});
     await p.screenshot({path:`${out}/${width}-${theme}-${lang}-top.png`});
     await p.locator('#open-booking').click();await axe(p,label+'/booking');
     assert(!await p.locator('#booking-dialog').evaluate(e=>e.scrollWidth>e.clientWidth),'Booking fits '+label);
     await p.screenshot({path:`${out}/${width}-${theme}-${lang}-booking.png`});await p.keyboard.press('Escape');
     await p.evaluate(()=>scrollTo(0,0));
    }
   }
  }
  await p.reload({waitUntil:'networkidle'});
  assert(await p.locator('html').getAttribute('data-theme')==='dark','Theme survives reload '+width);
  assert(await p.locator('html').getAttribute('lang')==='ja','Theme preserves language '+width);
  await p.close();
 }
 const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});observe(p);
 await p.goto('http://127.0.0.1:4173');await p.locator('#theme-toggle').focus();await p.keyboard.press('Space');
 assert(await p.locator('html').getAttribute('data-theme')==='dark','Keyboard Space changes theme');
 await p.keyboard.press('Enter');assert(await p.locator('html').getAttribute('data-theme')==='light','Keyboard Enter changes theme');
 await p.locator('#theme-toggle').click();await p.goto('http://127.0.0.1:4173/hero-spotlight.html');
 assert(await p.locator('html').getAttribute('data-theme')==='dark','Theme follows navigation to reference page');
 await p.goto('http://127.0.0.1:4173/hero-directions.html');await p.waitForSelector('#direction-preview');
 await p.frameLocator('#direction-preview').locator('html[data-theme=dark]').waitFor();
 await p.locator('#theme-toggle').click();await p.frameLocator('#direction-preview').locator('html[data-theme=light]').waitFor();
 assert(await p.locator('html').getAttribute('data-theme')==='light','Comparison iframe follows theme changes');await p.close();
 const blocked=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});observe(blocked);
 await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('Storage unavailable');}}));
 await blocked.goto('http://127.0.0.1:4173');await blocked.locator('#theme-toggle').click();
 assert(await blocked.locator('html').getAttribute('data-theme')==='dark','Switch works when storage is unavailable');await blocked.close();
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto('http://127.0.0.1:4173');
 assert(!await nojs.locator('#theme-toggle').isVisible()&&await nojs.locator('.site-header .brand-name').isVisible(),'No-JavaScript fallback has visible logo and no dead theme control');await nojs.close();
 const moving=await browser.newPage({viewport:{width:390,height:844}});observe(moving);await moving.goto('http://127.0.0.1:4173');await moving.waitForTimeout(1800);
 const before=await moving.locator('.site-header .ring-outer').evaluate(e=>gsap.getProperty(e,'rotation'));
 await moving.locator('#theme-toggle').click();await moving.waitForTimeout(400);
 assert(await moving.locator('.site-header .brand').evaluate((e,phase)=>gsap.getProperty(e.querySelector('.ring-outer'),'rotation')>phase&&gsap.getProperty(e.querySelector('.ring-outer'),'scaleX')===1&&getComputedStyle(e.querySelector('.brand-name')).opacity==='1',before),'Theme change preserves continuous rotation and wordmark');
 await moving.screenshot({path:out+'/dark-normal-motion.png'});await moving.close();
 const report={checks,scans,errors,failed};fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify(report));if(scans.some(s=>s.violations.length)||errors.length||failed.length)process.exitCode=1;
}finally{await browser.close();}
