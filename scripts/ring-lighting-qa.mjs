import {createRequire} from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const out='artifacts/fast-start-login',browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const results=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:1});
 await page.route('**/hero-ring.js?*',r=>r.fulfill({body:''}));
 await page.route('**/assets/precision-ring-studio.hdr',r=>r.fulfill({contentType:'application/octet-stream',body:fs.readFileSync('design-assets/precision-ring-studio-original.hdr')}));
 await page.goto('http://127.0.0.1:4173/');
 await page.setContent('<style>body{margin:0}#object{width:1100px;height:1005px}canvas{display:block}</style><div id="object"></div>');
 await page.addScriptTag({content:fs.readFileSync('../delivery/SOMA-upload-plex-stable-faq/soma-private/site/assets/precision-ring-3d.js','utf8')});
 await page.evaluate(()=>window.OldRing=SomaPrecisionRing);
 await page.addScriptTag({url:'http://127.0.0.1:4173/assets/precision-ring-3d.js?v=fast-start'});
 for(const variant of ['before','after']){
  await page.evaluate(async variant=>{window.ring=await (variant==='before'?OldRing:SomaPrecisionRing).create(document.querySelector('#object'),'satin',{environmentUrl:variant==='before'?'assets/precision-ring-studio.hdr':'assets/precision-ring-lighting.webp'});},variant);
  for(const t of [0,3,6,9,12,15,18,21]){
   const data=await page.evaluate(t=>{ring.seek(t);return {png:document.querySelector('canvas').toDataURL(),state:ring.state()};},t);
   assert.equal(data.state.triangles,19562);assert.equal(data.state.drawCalls,6);
   fs.writeFileSync(`${out}/ring-${variant}-${t}.png`,Buffer.from(data.png.split(',')[1],'base64'));results.push({variant,t,state:data.state});
  }
  await page.evaluate(()=>ring.dispose());
 }
 fs.writeFileSync(out+'/lighting-results.json',JSON.stringify(results,null,2));console.log('Eight full-revolution poses rendered for each lighting version.');
}finally{await browser.close();}
