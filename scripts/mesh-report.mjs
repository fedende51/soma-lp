import {createRequire} from 'node:module';
import fs from 'node:fs';
import {gzipSync,brotliCompressSync} from 'node:zlib';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{
 const page=await browser.newPage({viewport:{width:1440,height:950},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>window.somaRingState?.().ready);
 const state=await page.evaluate(()=>somaRingState());
 const files=Object.fromEntries(['visuals/precision-ring-3d.js','dist/assets/precision-ring-3d.js','dist/assets/precision-ring-lighting.webp','dist/assets/ring-metal-worker.js'].map(file=>{
  const bytes=fs.readFileSync(file);return [file,{bytes:bytes.length,gzipBytes:gzipSync(bytes,{level:9}).length,brotliBytes:brotliCompressSync(bytes).length}];
 }));
 const report={format:'procedural JavaScript; generated in browser, no GLB download',mesh:state.meshInfo,renderedTriangles:state.triangles,drawCalls:state.drawCalls,files,geometryMemoryNote:'Sum of unique position/normal/UV/index buffer bytes. Instance transforms are reported separately. Excludes textures, environment maps and renderer allocations.'};
 fs.writeFileSync('design-assets/mesh-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
