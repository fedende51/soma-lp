import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill,openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const serveUrl=await bundle({entryPoint:path.resolve('video/index.jsx'),publicDir:path.resolve('dist/assets'),outDir:path.resolve('video/bundle')});
const browser=await openBrowser('chrome',{browserExecutable:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
try{
  const composition=await selectComposition({serveUrl,id:'SomaLaunch',puppeteerInstance:browser});
  fs.mkdirSync('artifacts/film',{recursive:true});
  for(const frame of [90,250,420,650,810,1000])await renderStill({serveUrl,composition,frame,output:path.resolve(`artifacts/film/${frame}.jpg`),imageFormat:'jpeg',puppeteerInstance:browser});
  await renderStill({serveUrl,composition,frame:1000,output:path.resolve('dist/assets/film-poster.jpg'),imageFormat:'jpeg',puppeteerInstance:browser});
  console.log('Storyboard frames rendered');
  if(process.argv.includes('--stills'))process.exitCode=0;
  else{let previous=-1;await renderMedia({serveUrl,composition,codec:'h264',crf:18,pixelFormat:'yuv420p',outputLocation:path.resolve('dist/assets/soma-launch.mp4'),puppeteerInstance:browser,concurrency:4,onProgress:({progress})=>{const n=Math.floor(progress*10);if(n!==previous){console.log(`Rendering ${n*10}%`);previous=n;}}});console.log('Rendered dist/assets/soma-launch.mp4');}
}finally{await browser.close({silent:true});}
