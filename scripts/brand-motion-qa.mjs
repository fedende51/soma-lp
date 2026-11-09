import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/ring-motion';fs.mkdirSync(out,{recursive:true});
const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
let checks=0;const assert=(ok,label)=>{if(!ok)throw Error(label);checks++;};
const failures=[];
try{
 for(const width of [390,768,1440]){
  const ctx=await b.newContext({viewport:{width,height:900},recordVideo:{dir:out,size:{width:Math.min(width,1440),height:900}}});
  const p=await ctx.newPage();p.on('pageerror',e=>failures.push(e.message));
  await p.addInitScript(()=>{
   window.__motionSamples=[];
   addEventListener('DOMContentLoaded',()=>{
    const start=performance.now();
    const sample=()=>{
     const g=window.gsap,o=document.querySelector('.site-header .ring-outer'),i=document.querySelector('.site-header .ring-inner'),n=document.querySelector('.site-header .brand-name'),h=document.querySelector('.hero h1');
     if(g&&o)window.__motionSamples.push({t:performance.now()-start,outer:+g.getProperty(o,'rotation'),inner:+g.getProperty(i,'rotation'),scale:+g.getProperty(o,'scaleX'),word:+getComputedStyle(n).opacity,y:+g.getProperty(h,'y'),heading:+getComputedStyle(h).opacity});
     if(performance.now()-start<1600)requestAnimationFrame(sample);
    };requestAnimationFrame(sample);
   });
  });
  await p.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});
  for(const [index,wait]of [120,200,280,350,450].entries()){
   await p.waitForTimeout(wait);await p.screenshot({path:`${out}/${width}-intro-${index}.png`});
  }
  const samples=await p.evaluate(()=>window.__motionSamples);
  fs.writeFileSync(`${out}/${width}-samples.json`,JSON.stringify(samples,null,2));
  assert(samples.some(s=>s.outer<-10&&s.inner>10&&s.scale>0&&s.scale<1),'Rings scale and rotate in opposite directions '+width);
  assert(samples.some(s=>s.word===0&&s.scale>.95),'Wordmark waits for rings '+width);
  assert(samples.some(s=>s.heading>0&&s.heading<1&&s.y<0),'Information fades while moving downward '+width);
  assert(samples.at(-1).word===1&&samples.at(-1).scale===1,'Logo reaches final state '+width);
  assert(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Animated layout fits '+width);
  const rotations=selector=>p.locator(selector).evaluate(e=>[+gsap.getProperty(e.querySelector('.ring-outer'),'rotation'),+gsap.getProperty(e.querySelector('.ring-inner'),'rotation')]);
  const headerStart=await rotations('.site-header .brand');await p.waitForTimeout(700);
  const headerEnd=await rotations('.site-header .brand');
  assert(headerEnd[0]>headerStart[0]&&headerEnd[1]<headerStart[1],'Header keeps rotating in opposite directions '+width);
  await p.locator('.product-capabilities').scrollIntoViewIfNeeded();await p.waitForTimeout(1100);
  assert(await p.locator('.capability-list li').evaluateAll(es=>es.every(e=>getComputedStyle(e).opacity==='1')),'Content settles '+width);
  await p.screenshot({path:`${out}/${width}-product.png`});
  await p.locator('footer').scrollIntoViewIfNeeded();await p.waitForTimeout(1500);
  assert(await p.locator('footer .brand-name').evaluate(e=>getComputedStyle(e).opacity==='1'),'Footer logo settles '+width);
  const footerStart=await rotations('footer .brand');await p.waitForTimeout(700);
  const footerEnd=await rotations('footer .brand');
  assert(footerEnd[0]>footerStart[0]&&footerEnd[1]<footerStart[1],'Footer keeps rotating in opposite directions '+width);
  const headerPaused=await rotations('.site-header .brand');await p.waitForTimeout(300);
  const headerStillPaused=await rotations('.site-header .brand');
  assert(headerPaused.every((v,i)=>v===headerStillPaused[i]),'Offscreen header rotation pauses '+width);
  await p.evaluate(()=>scrollTo(0,0));await p.waitForTimeout(300);
  assert(await p.locator('.site-header .brand').evaluate(e=>gsap.getProperty(e.querySelector('.ring-outer'),'scaleX')===1&&getComputedStyle(e.querySelector('.brand-name')).opacity==='1')&&(await rotations('.site-header .brand'))[0]>headerPaused[0],'Header resumes without replaying its entrance '+width);
  await ctx.close();
 }
 const reduced=await b.newPage({reducedMotion:'reduce',viewport:{width:390,height:844}});
 await reduced.goto('http://127.0.0.1:4173');
 assert(await reduced.locator('.hero h1').evaluate(e=>getComputedStyle(e).opacity==='1'&&getComputedStyle(e).transform==='none'),'Reduced motion: content static and visible');
 assert(await reduced.locator('.ring-outer').first().getAttribute('transform')===null,'Reduced motion: no ring rotation');
 await reduced.close();
 const changed=await b.newPage({viewport:{width:390,height:844}});await changed.goto('http://127.0.0.1:4173');await changed.waitForTimeout(1800);
 await changed.emulateMedia({reducedMotion:'reduce'});await changed.waitForTimeout(100);
 assert(await changed.locator('.site-header .logo-ring').evaluateAll(es=>es.every(e=>gsap.getProperty(e,'rotation')===0&&gsap.getProperty(e,'scaleX')===1&&!gsap.getTweensOf(e).length)),'Changing reduced-motion preference stops and reverts both rings');
 await changed.emulateMedia({reducedMotion:'no-preference'});await changed.waitForTimeout(1800);
 assert(await changed.locator('.site-header .logo-ring').evaluateAll(es=>es.every(e=>gsap.getTweensOf(e).filter(t=>t.repeat()===-1&&t.isActive()).length===1)),'Restoring motion starts exactly one rotation per ring');await changed.close();
 const missing=await b.newPage({viewport:{width:390,height:844}});
 await missing.route('**/assets/gsap.min.js',r=>r.abort());await missing.route('**/motion.js',r=>r.abort());
 await missing.goto('http://127.0.0.1:4173');await missing.waitForTimeout(2000);
 assert(await missing.locator('.hero h1').evaluate(e=>getComputedStyle(e).opacity==='1'),'Missing motion scripts reveal content safely');await missing.close();
 const nojs=await b.newPage({javaScriptEnabled:false});await nojs.goto('http://127.0.0.1:4173');
 assert(await nojs.locator('.site-header .brand-name').isVisible(),'Logo works without JavaScript');await nojs.close();
 assert(!failures.length,'No animation errors');
 fs.writeFileSync(out+'/results.json',JSON.stringify({checks,failures},null,2));console.log(JSON.stringify({checks,failures}));
}finally{await b.close();}
