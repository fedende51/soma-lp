import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/mesh-optimization';fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={phases:[],errors:[]};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.route('**/hero-ring.js?*',route=>route.fulfill({status:200,contentType:'text/javascript',body:''}));
 await page.goto('http://127.0.0.1:4173/');
 await page.setContent('<html><head><style>body{margin:0}.object{width:1100px;height:1005px}canvas{display:block}</style></head><body><div id="before" class="object"></div><div id="after" class="object"></div></body></html>');
 await page.addScriptTag({content:fs.readFileSync(out+'/before.js','utf8')});
 await page.addScriptTag({url:'http://127.0.0.1:4173/assets/precision-ring-3d.js?v=optimized-mesh'});
 await page.evaluate(async()=>{
  window.beforeRing=await SomaPrecisionRingBefore.create(document.querySelector('#before'),'satin',{environmentUrl:'assets/precision-ring-studio.hdr'});
  window.afterRing=await SomaPrecisionRing.create(document.querySelector('#after'),'satin',{environmentUrl:'assets/precision-ring-studio.hdr'});
 });
 for(const seconds of [0,3,6,9,12,15,18,21]){
  const frames=await page.evaluate(seconds=>{
   const render=(ring,id)=>{ring.seek(seconds);return {png:document.querySelector('#'+id+' canvas').toDataURL('image/png'),state:ring.state()};};
   return {before:render(beforeRing,'before'),after:render(afterRing,'after')};
  },seconds);
  for(const [name,result] of Object.entries(frames))fs.writeFileSync(`${out}/${name}-${seconds}.png`,Buffer.from(result.png.split(',')[1],'base64'));
  assert.equal(frames.before.state.triangles,79572);assert.ok(frames.after.state.triangles<24000);
  assert.equal(frames.before.state.drawCalls,17);
  assert.equal(frames.after.state.meshInfo.triangles,frames.after.state.triangles);
  assert.equal(frames.after.state.drawCalls,6);assert.ok(frames.after.state.meshInfo.geometryBytes<500000);
  assert.deepEqual(frames.after.state.camera,frames.before.state.camera);assert.equal(frames.after.state.angle,frames.before.state.angle);
  report.phases.push({seconds,before:frames.before.state,after:frames.after.state});
 }
 assert.deepEqual(report.errors,[]);fs.writeFileSync(out+'/results.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({phases:report.phases.length,before:report.phases[0].before.meshInfo,after:report.phases[0].after.meshInfo,drawCalls:report.phases[0].after.drawCalls,errors:report.errors}));
}finally{await browser.close();}
