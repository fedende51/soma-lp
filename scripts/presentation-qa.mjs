import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const folder='artifacts/brochure-verified';fs.mkdirSync(folder,{recursive:true});
const results=[],errors=[],failures=[];let count=0;
const assert=(ok,message)=>{if(!ok)throw Error(message);count++};
try{
 for(const width of [320,360,390,430,640,641,768,1024,1440]){
  const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)failures.push(r.status()+' '+r.url());});
  await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
  await p.addScriptTag({path:path.resolve('node_modules/axe-core/axe.min.js')});
  for(const lang of ['en','ja']){
   if(lang==='ja')await p.locator('.language-option[data-language="ja"]').click();
   assert(!await p.locator('.board-shell,[data-order],[data-scenario],#film-dialog').count(),`No interactive sample or video modal ${width}/${lang}`);
   assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),`No overflow ${width}/${lang}`);
   assert(!/[↗▶✓↓↳→↺⌄×↑]/u.test(await p.locator('body').innerText()),`Vector icons ${width}/${lang}`);
   assert(await p.locator('.capability-list li').count()===3,`Product overview ${width}/${lang}`);
   const expected=width<=640?(lang==='en'?'Complex work. A clear plan.':'複雑な仕事に、 明確な計画を。'):(lang==='en'?'Precision work. Clearly planned.':'精密な仕事に、 確かな計画を。');
   assert((await p.locator('.hero h1').innerText()).replace(/\s+/g,' ').trim()===expected,`Selected responsive headline ${width}/${lang}`);
   if([320,390,768,1440].includes(width)){
    const scan=await p.evaluate(async()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
    results.push({width,lang,violations:scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
    await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`${folder}/${width}-${lang}-full.png`,fullPage:true});
    await p.locator('#scheduler').screenshot({path:`${folder}/${width}-${lang}-product.png`});
    await p.locator('#film').screenshot({path:`${folder}/${width}-${lang}-film.png`});
   }
  }
  await p.close();
 }
 const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce',hasTouch:true});p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 assert(!await p.locator('a[download],.film-download').count(),'No film download link');
 assert(await p.locator('#film-player').evaluate(el=>Math.abs(el.getBoundingClientRect().height-el.querySelector('.film-stage').getBoundingClientRect().height)<1),'Player has no control strip below the picture');
 assert(await p.locator('.film-controls').evaluate(el=>getComputedStyle(el).visibility==='hidden'),'Poster starts without control chrome');
 await p.locator('#open-film').click();await p.waitForFunction(()=>document.querySelector('video').currentTime>.2);
 assert(await p.locator('video').evaluate(v=>v.videoWidth===1080&&v.videoHeight===1350),'Phone selects the composed portrait film');
 assert(await p.locator('#film-player').evaluate(el=>el.classList.contains('playing')),'Film section starts inline playback');
 assert(!await p.locator('video').evaluate(v=>v.controls),'Custom controls replace native chrome after JS');
 await p.locator('video').hover();await p.waitForFunction(()=>getComputedStyle(document.querySelector('.film-controls')).opacity==='0');
 assert(await p.locator('video').evaluate(v=>!v.paused),'Film keeps playing as overlay controls fade away');
 await p.locator('video').tap();
 assert(await p.locator('video').evaluate(v=>!v.paused)&&await p.locator('#film-player').evaluate(el=>el.classList.contains('controls-active')),'Touch reveals controls without interrupting playback');
 await p.locator('video').focus();
 assert(await p.locator('.film-controls').evaluate(el=>getComputedStyle(el).opacity==='1'),'Keyboard focus reveals the overlay');
 await p.locator('#film-toggle').click();assert(await p.locator('video').evaluate(v=>v.paused),'Pause button works');
 await p.locator('#film-progress').fill('18.5');await p.locator('#film-progress').dispatchEvent('input');
 await p.waitForFunction(()=>Math.abs(document.querySelector('video').currentTime-18.5)<.2&&document.querySelector('video').readyState>=2);
 assert((await p.locator('#film-elapsed').innerText())==='0:18','Seek updates visible time');
 await p.locator('#film-mute').click();assert(await p.locator('video').evaluate(v=>v.muted),'Mute button works');
 await p.locator('#film-captions').click();assert(await p.locator('#film-captions').getAttribute('aria-pressed')==='true','Captions button works');
 assert(await p.locator('video').evaluate(v=>[...v.textTracks].find(t=>t.language==='en').mode==='showing'),'English captions enabled');
 await p.locator('.language-option[data-language="ja"]').click();assert(await p.locator('video').evaluate(v=>[...v.textTracks].find(t=>t.language==='ja').mode==='showing'),'Captions follow Japanese');
 assert(await p.locator('#film-toggle').getAttribute('aria-label')==='動画を再生','Player labels translated');
 await p.locator('video').focus();await p.keyboard.press('ArrowRight');
 await p.waitForFunction(()=>Math.abs(document.querySelector('video').currentTime-23.5)<.2);
 assert(await p.locator('video').evaluate(v=>Math.abs(v.currentTime-23.5)<.2),'Keyboard arrows seek within the film');
 await p.keyboard.press('Space');await p.waitForFunction(()=>!document.querySelector('video').paused);await p.keyboard.press('Space');
 assert(await p.locator('video').evaluate(v=>v.paused),'Keyboard Space plays and pauses');
 await p.locator('#film-player').screenshot({path:`${folder}/player-paused-phone.png`});
 await p.locator('#film-fullscreen').click();await p.waitForFunction(()=>!!document.fullscreenElement);assert(await p.evaluate(()=>document.fullscreenElement.id==='film-player'),'Fullscreen keeps the custom controls');await p.evaluate(()=>document.exitFullscreen());
 await p.locator('#open-booking').click();assert(await p.locator('#booking-dialog').isVisible(),'Booking dialog works');
 await p.locator('input[name=name]').fill('Website Visitor');await p.locator('input[name=email]').fill('visitor@example.com');await p.locator('input[name=company]').fill('Sample Shop');
 await p.locator('#booking-date').fill('2026-10-18');await p.locator('#booking-date').dispatchEvent('input');assert(!await p.locator('#booking-date').evaluate(el=>el.validity.valid),'Weekend rejected');
 await p.locator('#booking-date').fill('2026-10-19');await p.locator('#booking-date').dispatchEvent('input');await p.locator('#booking-form button[type=submit]').click();assert(await p.locator('#request-text').inputValue().then(v=>v.includes('Website Visitor')&&v.includes('hello@somakk.com')),'Booking email fallback works');await p.keyboard.press('Escape');
 await p.goto('http://127.0.0.1:4173/?demo=1');assert(await p.locator('#booking-dialog').isVisible(),'Direct booking link works');await p.keyboard.press('Escape');
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});await nojs.goto('http://127.0.0.1:4173');assert(await nojs.locator('video').getAttribute('controls')!==null,'Native controls remain without JavaScript');assert(!await nojs.locator('#open-film').isVisible(),'No dead custom overlay without JavaScript');await nojs.close();
 await p.goto('http://127.0.0.1:4173/film/index.html?render=1');await p.waitForFunction(()=>window.READY);assert(await p.evaluate(()=>{seek(16.5);const s=document.querySelector('#stage').innerHTML;seek(28);seek(0);seek(16.5);return s===document.querySelector('#stage').innerHTML;}),'Film authoring keeps deterministic seek');
 fs.writeFileSync(`${folder}/results.json`,JSON.stringify({count,results,errors,failures},null,2));console.log(JSON.stringify({count,results,errors,failures}));
 if(results.some(r=>r.violations.length)||errors.length||failures.length)process.exitCode=1;
}finally{await browser.close();}
