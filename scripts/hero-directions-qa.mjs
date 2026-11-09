import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const out='artifacts/hero-directions-final';fs.mkdirSync(out,{recursive:true});
const scans=[],errors=[],requests=[];let checks=0;
const assert=(ok,message)=>{if(!ok)throw Error(message);checks++;};
try{
 for(const design of ['editorial','spotlight','flow']){
  for(const width of [320,390,768,1440]){
   const p=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
   p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)requests.push(`${r.status()} ${r.url()}`);});
   await p.goto(`http://127.0.0.1:4173/hero-${design}.html`,{waitUntil:'networkidle'});
   await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
   for(const lang of ['en','ja']){
    if(lang==='ja')await p.locator('.language-option[data-language="ja"]').click();
    assert(await p.locator('h1').count()===1,`Single headline ${design}/${width}/${lang}`);
    assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`No overflow ${design}/${width}/${lang}`);
    assert(!await p.locator('a[download],.board-shell').count(),`No download or sample board ${design}/${width}/${lang}`);
    assert(await p.locator('.hero .open-booking').isVisible(),`Demo action visible ${design}/${width}/${lang}`);
    if(design==='editorial'&&width<=390){
     const clear=await p.evaluate(()=>{const p=document.querySelector('.hero-description').getBoundingClientRect(),i=document.querySelector('.hero-part').getBoundingClientRect();return i.left>=p.right;});
     assert(clear,`Copy is clear of the photo ${width}/${lang}`);
    }
    if(width!==320){
     const scan=await p.evaluate(()=>axe.run({include:[['.site-header'],['.direction-hero']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
     scans.push({design,width,lang,violations:scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
     await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${out}/${design}-${width}-${lang}.png`});
     await p.screenshot({path:`${out}/${design}-${width}-${lang}-full.png`,fullPage:true});
    }
   }
   if(width===390){await p.locator('.hero .open-booking').click();assert(await p.locator('#booking-dialog').isVisible(),`Booking works ${design}`);await p.keyboard.press('Escape');}
   await p.close();
  }
  const p=await browser.newPage({viewport:{width:390,height:844}});p.on('pageerror',e=>errors.push(e.message));
  await p.goto(`http://127.0.0.1:4173/hero-${design}.html`);await p.waitForTimeout(1600);
  assert(await p.locator('.site-header .brand-name').evaluate(e=>getComputedStyle(e).opacity==='1'),`Original wordmark settles ${design}`);
  assert(await p.locator('.hero h1').evaluate(e=>getComputedStyle(e).opacity==='1'),`Hero settles ${design}`);
  await p.screenshot({path:`${out}/${design}-motion-settled.png`});await p.close();
 }
 for(const width of [390,1440]){
  const p=await browser.newPage({viewport:{width,height:1100},reducedMotion:'reduce'});p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:4173/hero-directions.html',{waitUntil:'networkidle'});
  for(const design of ['editorial','spotlight','flow']){
   await p.locator(`[data-direction=${design}]`).click();
   await p.waitForFunction(d=>document.querySelector('iframe').contentDocument?.body?.dataset.heroDirection===d,design);
   assert(await p.locator(`[data-direction=${design}]`).getAttribute('aria-pressed')==='true',`Direction switches ${design}/${width}`);
  }
  for(const [device,size]of[['desktop',1440],['tablet',768],['phone',390]]){
   await p.locator(`[data-device=${device}]`).click();
   await p.waitForFunction(size=>document.querySelector('iframe').contentWindow.innerWidth===size,size);
   assert(await p.locator('iframe').evaluate(el=>el.contentWindow.innerWidth)===size,`Real preview viewport ${device}/${width}`);
  }
  assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`Gallery fits ${width}`);
  await p.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
  const scan=await p.evaluate(()=>axe.run({exclude:[['#direction-preview']]},{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
  scans.push({gallery:true,width,violations:scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await p.screenshot({path:`${out}/gallery-${width}.png`,fullPage:true});await p.close();
 }
 fs.writeFileSync(`${out}/results.json`,JSON.stringify({checks,scans,errors,requests},null,2));
 console.log(JSON.stringify({checks,scans,errors,requests}));
 if(scans.some(s=>s.violations.length)||errors.length||requests.length)process.exitCode=1;
}finally{await browser.close();}
