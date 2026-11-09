import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const generated=[];
try{
 for(const mode of ['phone','wide']){
  const page=await browser.newPage({viewport:{width:mode==='phone'?390:1440,height:1100},deviceScaleFactor:1});
  await page.route('**/hero-ring.js?*',route=>route.fulfill({status:200,contentType:'text/javascript',body:''}));
  await page.goto('http://127.0.0.1:4173/');await page.setContent('<html><head><style>body{margin:0}#object{width:1100px;height:1005px}canvas{display:block}</style></head><body><div id="object"></div></body></html>');
  await page.addScriptTag({url:'http://127.0.0.1:4173/assets/precision-ring-3d.js?posters=matched-framing'});
  for(const width of [600,800,1100]){
   const height=Math.round(width*1005/1100);
   const data=await page.evaluate(async({width,height})=>{
    const host=document.querySelector('#object');host.style.width=width+'px';host.style.height=height+'px';
    const ring=await SomaPrecisionRing.create(host,'satin',{environmentUrl:'assets/precision-ring-lighting.webp',responsiveFraming:true});ring.seek(0);
    const png=host.querySelector('canvas').toDataURL('image/png'),webp=host.querySelector('canvas').toDataURL('image/webp',.96),state=ring.state();ring.dispose();return {png,webp,state};
   },{width,height});
   const file=`dist/assets/ring-poster-${mode}-${width}.webp`;await fs.writeFile(file,Buffer.from(data.webp.split(',')[1],'base64'));
   if(width===1100)await fs.writeFile(`artifacts/ring-framing/poster-${mode}.png`,Buffer.from(data.png.split(',')[1],'base64'));
   generated.push({file,width,height,framing:data.state.framing,bytes:(await fs.stat(file)).size});
  }
  await page.close();
 }
 const sha=crypto.createHash('sha256').update(await fs.readFile('visuals/precision-ring-3d.js')).digest('hex');
 await fs.writeFile('design-assets/ring-poster-manifest.json',JSON.stringify({modelSourceSha256:sha,phase:0,generated},null,2));console.log(JSON.stringify(generated));
}finally{await browser.close();}
