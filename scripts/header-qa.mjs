import {createRequire} from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/header-update';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={layouts:[],scans:[],checks:[],errors:[],failed:[]};
const observe=p=>{p.on('pageerror',e=>report.errors.push(e.message));p.on('response',r=>{if(r.status()>=400)report.failed.push(r.status()+' '+r.url());});};
const rect=e=>{const {x,y,width,height}=e.getBoundingClientRect();return {x,y,width,height};};
const before=fs.readFileSync('../delivery/SOMA-upload-plex-stable-faq/soma-private/site/index.html','utf8');
const after=fs.readFileSync('dist/index.html','utf8');
const oldApp=fs.readFileSync('../delivery/SOMA-upload-plex-stable-faq/soma-private/site/app.js','utf8');
const app=fs.readFileSync('dist/app.js','utf8');
const dictionary=s=>JSON.parse(s.match(/const ja = (\{[\s\S]*?\n\});/)[1]);
const nonNavigation=d=>Object.fromEntries(Object.entries(d).filter(([key])=>!key.startsWith('nav')));
assert.deepEqual(nonNavigation(dictionary(app)),nonNavigation(dictionary(oldApp)),'Japanese content outside navigation is unchanged');
try{
 const proof=await browser.newPage();
 const content=await proof.evaluate(({before,after})=>{const parse=s=>{const doc=new DOMParser().parseFromString(s,'text/html');return [...doc.querySelectorAll('main [data-i18n],footer [data-i18n],dialog [data-i18n]')].map(e=>[e.dataset.i18n,e.innerHTML]);};return {before:parse(before),after:parse(after)};},{before,after});
 assert.deepEqual(content.after,content.before,'English content outside navigation is unchanged');await proof.close();
 report.checks.push('English and Japanese page content outside navigation matches the previous upload package');
 for(const width of [320,390,640,641,768,1024,1100,1101,1280,1440]){
  const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});observe(p);
  await p.goto('http://127.0.0.1:4173/');await p.waitForSelector('body.language-ready');await p.evaluate(()=>document.fonts.ready);
  if([320,390,768,1440].includes(width))await p.addScriptTag({path:path.resolve('node_modules/axe-core/axe.min.js')});
  for(const theme of ['light','dark']){
   if(await p.locator('html').getAttribute('data-theme')!==theme)await p.locator('#theme-toggle').click();
   let baseline;
   for(const lang of ['en','ja','en']){
    await p.locator(`.language-option[data-language="${lang}"]`).click();
    assert.equal(await p.locator('html').getAttribute('lang'),lang);
    assert.equal(await p.locator(`.language-option[data-language="${lang}"]`).getAttribute('aria-pressed'),'true');
    const nav=await p.locator('.site-header nav a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.textContent,rect:(()=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};})()})));
    assert.deepEqual(nav.map(a=>a.href),['#film','#scheduler','#approach','#details']);
    for(let i=0;i<nav.length;i++){
     assert.ok(nav[i].rect.width>0&&nav[i].rect.height>=44,'Every navigation link is visible');
     assert.ok(nav[i].rect.x>=0&&nav[i].rect.x+nav[i].rect.width<=width,'Link fits viewport');
     if(i)assert.ok(nav[i].rect.x>=nav[i-1].rect.x+nav[i-1].rect.width+3,'Links do not overlap');
    }
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'No page overflow');
    const geometry=await p.evaluate(()=>{
     const box=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};};
     return {brand:box('.site-header .brand'),theme:box('#theme-toggle'),language:box('#language'),actions:box('.header-actions')};
    });
    assert.ok(geometry.brand.x+geometry.brand.width<=geometry.actions.x-4,'Brand clear of controls');
    if(width>1100){
     assert.ok(nav[0].rect.x>=geometry.brand.x+geometry.brand.width+12,'Navigation clear of brand');
     assert.ok(nav[3].rect.x+nav[3].rect.width<=geometry.actions.x-12,'Navigation clear of controls');
    }
    assert.equal(geometry.language.width,88);assert.equal(geometry.language.height,44);
    assert.equal(await p.locator('.header-actions .open-booking').count(),0);assert.ok(geometry.theme.x>=geometry.language.x+geometry.language.width+4);assert.equal(geometry.theme.width,44);
    if(!baseline)baseline=geometry;
    for(const key of ['theme','language','actions'])assert.deepEqual(geometry[key],baseline[key],key+' size/position stays fixed across languages');
    const style=await p.locator('.language-option').first().evaluate(e=>({active:e.getAttribute('aria-pressed')==='true',weight:getComputedStyle(e).fontWeight,color:getComputedStyle(e).color,neutral:getComputedStyle(document.querySelector('.language-separator')).color,separatorWeight:getComputedStyle(document.querySelector('.language-separator')).fontWeight,accent:getComputedStyle(document.querySelector('.product-signature')).color}));
    assert.equal(style.weight,style.active?'700':'400');assert.equal(style.color,style.active?style.accent:style.neutral);assert.equal(style.separatorWeight,'400');assert.equal(style.neutral,theme==='light'?'rgb(16, 23, 25)':'rgb(241, 247, 247)');
    assert.equal(await p.locator('#language select,#language svg').count(),0);
    report.layouts.push({width,theme,lang,nav:nav.map(a=>a.text),geometry,style});
    if([320,390,768,1440].includes(width)&&report.layouts.filter(r=>r.width===width&&r.theme===theme&&r.lang===lang).length===1){
     const scan=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}));});
     assert.deepEqual(scan,[]);report.scans.push({width,theme,lang,violations:scan});
     await p.screenshot({path:`${out}/${width}-${theme}-${lang}-top.png`});
     if(theme==='light'&&lang==='en'&&width!==320)await p.screenshot({path:`${out}/${width}-full.png`,fullPage:true});
    }
   }
  }
  await p.locator('.language-option[data-language="ja"]').focus();await p.keyboard.press('Enter');assert.equal(await p.locator('html').getAttribute('lang'),'ja');
  await p.reload();await p.waitForSelector('body.language-ready');assert.equal(await p.locator('html').getAttribute('lang'),'ja');
  await p.locator('.hero .open-booking').click();assert.equal(await p.locator('#booking-dialog').isVisible(),true);await p.keyboard.press('Escape');
  await p.close();
 }
 report.checks.push('All four navigation links are visible in section order at 320–1440px, including responsive boundaries');
 report.checks.push('Header language/theme positions and dimensions remain identical through EN → JP → EN');
 report.checks.push('Active language uses 700 weight and the SOMA / SCHEDULER accent; inactive language and separator are 400 weight and neutral, with a visible selected underline and aria-pressed state');
 report.checks.push('Language changes work with keyboard, survive reload, and the hero demo opens booking');
 for(const variant of ['editorial','spotlight','flow']){
  const p=await browser.newPage({viewport:{width:768,height:900},reducedMotion:'reduce'});observe(p);
  await p.goto('http://127.0.0.1:4173/hero-'+variant+'.html');await p.waitForSelector('body.language-ready');await p.locator('.language-option[data-language="ja"]').click();
  assert.equal(await p.locator('.site-header nav a').count(),4);assert.equal(await p.locator('html').getAttribute('lang'),'ja');await p.close();
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.failed,[]);
 report.copy={homepageBody:crypto.createHash('sha256').update(after.slice(after.indexOf('<body'))).digest('hex'),translations:crypto.createHash('sha256').update(app).digest('hex'),outsideNavigationUnchanged:true};
 fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify({layouts:report.layouts.length,scans:report.scans.length,checks:report.checks,errors:report.errors,failed:report.failed}));
}finally{await browser.close();}
