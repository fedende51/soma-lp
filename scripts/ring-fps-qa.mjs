import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/ring-60fps';fs.mkdirSync(out,{recursive:true});
const report={cadence:[],views:[],errors:[]};
// Execute the actual page controller against a controlled display clock. Verify
// motion by elapsed time across refresh rates, rather than assuming one turn
// advances by a fixed amount on every frame.
async function simulated(hz){
 let queued,id=0,observer,media,visible=true,hidden=false;const seeks=[];
 const image={closest:()=>null,replaceWith(){},className:''};
 const container=()=>({className:'',append(){},setAttribute(){},querySelector:()=>({addEventListener(){}}),classList:{add(){},remove(){}}});
 const fakeRing={seek:t=>seeks.push(t),state:()=>({angle:(seeks.at(-1)||0)*Math.PI*2/24}),dispose(){}};
 const context={fetch:async()=>({ok:true,blob:async()=>({})}),performance:{now:()=>0},document:{querySelector:()=>image,createElement:container,addEventListener(){},get hidden(){return hidden;}},window:{addEventListener(){}},matchMedia:()=>({matches:false,addEventListener(fn,cb){media=cb;}}),IntersectionObserver:class{constructor(cb){observer=cb;}observe(){}},requestAnimationFrame:cb=>{queued=cb;return ++id;},cancelAnimationFrame(){queued=null;},setTimeout:cb=>cb(),SomaPrecisionRing:{create:async()=>fakeRing}};
 context.window.SomaPrecisionRing=context.SomaPrecisionRing;
 vm.runInNewContext(fs.readFileSync('dist/hero-ring.js','utf8'),context);
 observer([{isIntersecting:visible}]);await new Promise(resolve=>setImmediate(resolve));
 for(let frame=0;frame<=hz*24;frame++){const cb=queued;queued=null;assert.ok(cb);cb(frame*1000/hz);}
 const state=context.window.somaRingState(),fps=(state.renderedFrames-1)/24;
 assert.ok(Math.abs(fps-60)<.1,`${hz} Hz targets 60 FPS, got ${fps}`);assert.ok(Math.abs(state.angle-Math.PI*2)<1e-8,'Full rotation takes exactly 24 seconds');
 report.cadence.push({displayHz:hz,renderFps:fps,rotationSeconds:24,angle:state.angle});
}
for(const hz of [60,90,120,144])await simulated(hz);
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 for(const width of [390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:950}});page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/?v=60fps');await page.waitForFunction(()=>somaRingState?.().seconds>.4);
  const a=await page.evaluate(()=>({now:performance.now(),state:somaRingState()}));
  await page.waitForTimeout(2100);const b=await page.evaluate(()=>({now:performance.now(),state:somaRingState()}));
  const fps=(b.state.renderedFrames-a.state.renderedFrames)/((b.now-a.now)/1000);
  const secondsPerTurn=(b.state.seconds-a.state.seconds)*Math.PI*2/(b.state.angle-a.state.angle);
  assert.equal(b.state.frameLimit,60);assert.ok(fps>50&&fps<=62,`Rendered cadence at ${width}: ${fps}`);assert.ok(Math.abs(secondsPerTurn-24)<1e-8);
  assert.deepEqual(b.state.camera,a.state.camera);assert.equal(b.state.triangles,19562);
  await page.screenshot({path:`${out}/${width}-moving.png`});
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(500);await page.waitForFunction(()=>!somaRingState().running,{},{polling:50,timeout:5000});
  const frozen=await page.evaluate(()=>somaRingState().renderedFrames);await page.waitForTimeout(100);assert.equal(await page.evaluate(()=>somaRingState().renderedFrames),frozen);
  report.views.push({width,observedFps:Math.round(fps*10)/10,rotationSeconds:secondsPerTurn,reducedMotionStops:true});await page.close();
 }
 assert.deepEqual(report.errors,[]);fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
