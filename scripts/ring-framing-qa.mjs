import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const out='artifacts/ring-framing',results=[],errors=[];fs.mkdirSync(out,{recursive:true});
try{
 for(const [width,theme] of [[390,'light'],[390,'dark'],[768,'light'],[768,'dark'],[1440,'light'],[1440,'dark']]){
  const page=await browser.newPage({viewport:{width,height:950},reducedMotion:'reduce',deviceScaleFactor:1,hasTouch:width===390});
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(theme=>localStorage.setItem('soma-theme',theme),theme);
  let release;const held=new Promise(resolve=>release=resolve);let requested=false;
  await page.route('**/assets/precision-ring-3d.js?*',async route=>{requested=true;await held;await route.continue();});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('.hero-ring-fallback')?.complete);await page.evaluate(()=>document.fonts.ready);
  const image=await page.locator('.hero-ring-fallback').evaluate(el=>({src:el.currentSrc,rect:el.getBoundingClientRect().toJSON()}));
  assert.ok(image.src.includes(`ring-poster-${width<=640?'phone':'wide'}-`));
  await page.waitForTimeout(1300);assert.ok(requested);assert.equal(await page.locator('.hero-ring-stage.is-ready').count(),0);
  await page.screenshot({path:`${out}/${width}-${theme}-loading.png`});
  release();await page.waitForFunction(()=>window.somaRingState?.().ready);
  const state=await page.evaluate(()=>somaRingState());assert.equal(state.framing,width<=640?'phone':'wide');assert.equal(state.angle,0);assert.equal(state.running,false);
  assert.equal(state.triangles,19562);assert.equal(state.drawCalls,6);
  await page.addScriptTag({path:path.resolve('node_modules/axe-core/axe.min.js')});
  const violations=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>v.id);});
  assert.deepEqual(violations,[]);
  const rendered=await page.locator('.hero-ring-stage').evaluate(el=>el.getBoundingClientRect().toJSON());
  for(const key of ['x','y','width','height'])assert.ok(Math.abs(rendered[key]-image.rect[key])<.1,`${key} stable ${width}`);
  assert.equal(await page.locator('.hero-ring-stage button').count(),0);
  await page.screenshot({path:`${out}/${width}-${theme}-ready.png`});
  if(width===390&&theme==='light'){
   await page.setViewportSize({width:768,height:950});await page.waitForFunction(()=>somaRingState().framing==='wide');await page.waitForTimeout(200);
   await page.setViewportSize({width:390,height:950});await page.waitForFunction(()=>somaRingState().framing==='phone');await page.waitForTimeout(200);
   await page.evaluate(()=>scrollTo(0,0));
   await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(500);await page.waitForFunction(()=>somaRingState().seconds>.3,{},{timeout:10000}).catch(async error=>{console.log(await page.evaluate(()=>({state:somaRingState(),hidden:document.hidden,scrollY})));throw error;});const moving=await page.evaluate(()=>somaRingState());
   await page.waitForTimeout(150);const moved=await page.evaluate(()=>somaRingState());assert.ok(moved.angle>moving.angle);assert.deepEqual(moved.camera,moving.camera);
  }
  assert.equal(state.triangles,state.meshInfo.triangles);
  results.push({width,theme,framing:state.framing,poster:image.src.split('/').pop(),stableBounds:true,phaseZeroHandover:true,meshInfo:state.meshInfo,drawCalls:state.drawCalls,violations});await page.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'/results.json',JSON.stringify({results,errors},null,2));console.log(JSON.stringify({results,errors}));
}finally{await browser.close();}
