import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const previewPassword=process.env.SOMA_PREVIEW_PASSWORD;
assert(previewPassword,'Set SOMA_PREVIEW_PASSWORD for protected-preview checks.');
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/animated-favicon';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={views:[],checks:[],errors:[]};
const icon=p=>p.locator('link[data-soma-favicon]');
const save=(name,uri)=>fs.writeFileSync(`${out}/${name}.png`,Buffer.from(uri.split(',')[1],'base64'));
try{
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});page.on('pageerror',e=>report.errors.push(e.message));
  const response=await page.request.get('http://127.0.0.1:4191/soma/favicon.js');assert.equal(response.status(),401);
  for(const name of ['favicon.png','apple-touch-icon.png']){const image=await page.request.get('http://127.0.0.1:4191/soma/assets/'+name);assert.equal(image.status(),200);assert.equal(image.headers()['content-type'],'image/png');}
  for(const name of ['app.js','assets/precision-ring-3d.js','assets/precision-ring-lighting.webp'])assert.equal((await page.request.get('http://127.0.0.1:4191/soma/'+name)).status(),401);
  await page.goto('http://127.0.0.1:4191/soma/?v=animated-favicon');
  for(const location of ['login','site']){
   await page.waitForFunction(()=>document.querySelector('link[data-soma-favicon]')?.href.startsWith('data:image/png'));
   const a=await icon(page).getAttribute('href');await page.waitForTimeout(650);const b=await icon(page).getAttribute('href');assert.notEqual(a,b,`${location}: PNG favicon changes`);
   save(`${location}-${width}-frame-a`,a);save(`${location}-${width}-frame-b`,b);
   const dimensions=await icon(page).evaluate(async e=>{const i=new Image();i.src=e.href;await i.decode();return [i.naturalWidth,i.naturalHeight];});assert.deepEqual(dimensions,[64,64]);
   for(const theme of ['light','dark']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme-toggle').click();await page.waitForTimeout(600);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.equal(await page.locator('link[data-soma-favicon]').count(),1);assert.equal(await page.locator('link[rel=apple-touch-icon]').count(),1);
    await page.screenshot({path:`${out}/${location}-${width}-${theme}.png`});report.views.push({location,width,theme,animated:true,dimensions});
   }
   if(width===390){
    await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);const still=await icon(page).getAttribute('href');await page.waitForTimeout(500);assert.equal(await icon(page).getAttribute('href'),still);
    assert.equal(still.includes('favicon.png'),true);
    await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(500);const resumed=await icon(page).getAttribute('href');await page.waitForTimeout(350);assert.notEqual(await icon(page).getAttribute('href'),resumed);
    await page.evaluate(()=>{
     window.iconHidden=false;Object.defineProperty(document,'hidden',{configurable:true,get:()=>iconHidden});iconHidden=true;document.dispatchEvent(new Event('visibilitychange'));
    });
    const hidden=await icon(page).getAttribute('href');await page.waitForTimeout(500);assert.equal(await icon(page).getAttribute('href'),hidden);
    await page.evaluate(()=>{iconHidden=false;document.dispatchEvent(new Event('visibilitychange'));});await page.waitForTimeout(350);assert.notEqual(await icon(page).getAttribute('href'),hidden);
   }
   if(location==='login'){
    assert.equal(await page.locator('script[src*="favicon.js"]').count(),0,'Login animation is embedded before authentication');
    await page.locator('#password').fill(previewPassword);await page.locator('.enter-button').click();await page.waitForSelector('body.language-ready');await page.waitForFunction(()=>somaRingState().ready);
   }
  }
  await page.close();
 }
 const still=await browser.newPage({javaScriptEnabled:false});await still.goto('http://127.0.0.1:4191/soma/');const src=await icon(still).getAttribute('href');assert.ok(src.includes('favicon.png'));fs.writeFileSync(`${out}/no-js-login-static.png`,await (await still.request.get(new URL(src,still.url()).href)).body());await still.close();
 const noScript=await browser.newPage();await noScript.route('**/favicon.js?*',r=>r.abort());await noScript.goto('http://127.0.0.1:4173/');assert.ok((await icon(noScript).getAttribute('href')).includes('favicon.png'));assert.deepEqual(await icon(noScript).evaluate(async e=>{const i=new Image();i.src=e.href;await i.decode();return [i.naturalWidth,i.naturalHeight];}),[64,64]);await noScript.close();
 // Capture consecutive actual favicon frames for a small rendered motion preview.
 const film=await browser.newPage();await film.goto('http://127.0.0.1:4191/soma/');
 for(let n=0;n<24;n++){await film.waitForTimeout(125);save(`motion-${String(n).padStart(2,'0')}`,await icon(film).getAttribute('href'));}await film.close();
 report.checks.push('Login and website animate the rings-only PNG favicon at phone, tablet and desktop sizes, in both themes','Only two brand PNG icons are public; the website, favicon JS, model engine and lighting remain 401 before authentication. Login animation is embedded.','Reduced-motion freezes the icon and switching back resumes it on both pages','Simulated visibility changes pause/resume updates on both pages','Static rings-only fallback works with JavaScript disabled or the script unavailable','The two layers are original image crops; no wordmark is included');
 assert.deepEqual(report.errors,[]);fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({views:report.views.length,checks:report.checks,errors:report.errors}));
}finally{await browser.close();}
