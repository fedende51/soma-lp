import {createRequire} from 'node:module';
import {spawn,execFileSync} from 'node:child_process';
import {once} from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');
import {ffmpeg} from './runtime.mjs';
const draft=process.argv.includes('--draft'),stills=process.argv.includes('--stills'),portrait=process.argv.includes('--portrait');
const width=portrait?(draft?540:1080):(draft?960:1920),height=portrait?(draft?676:1350):(draft?540:1080),fps=draft?30:60,samples=draft?1:4;
const renderDir=portrait?'artifacts/flow-portrait':'artifacts/flow';fs.mkdirSync(renderDir,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
async function createPage(){const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});page.on('pageerror',e=>console.error(e.message));await page.goto('http://127.0.0.1:4173/film/index.html?render=1'+(portrait?'&portrait=1':''),{waitUntil:'networkidle'});await page.waitForFunction(()=>window.READY===true,{timeout:30000});return page;}
try{
 const preview=await createPage();fs.writeFileSync(portrait?'video/cues-portrait.json':'video/cues.json',JSON.stringify(await preview.evaluate(()=>window.M),null,2));
 if(stills){for(let i=0;i<64;i++){await preview.evaluate(t=>seek(t),i*.5+.12);await preview.screenshot({path:`${renderDir}/beat-${String(i).padStart(2,'0')}.jpg`,type:'jpeg',quality:86});}for(const t of [2.2,2.4,4.8,5.0,7.4,7.6,15.0,15.2,17.55,17.75,20.1,20.3,22.65,22.85,25.2,25.4,27.75,27.95]){await preview.evaluate(t=>seek(t),t);await preview.screenshot({path:`${renderDir}/transition-${t}.jpg`,type:'jpeg',quality:90});}console.log('64 beat frames and 10 transition frames captured');await preview.close();}
 else{
  await preview.evaluate(()=>seek(8.6));await preview.screenshot({path:portrait?'dist/assets/film-poster-portrait.jpg':'dist/assets/film-poster.jpg',type:'jpeg',quality:92});await preview.close();
  const segments=draft?2:4;let complete=0;const total=32*fps*samples;
  await Promise.all(Array.from({length:segments},async(_,worker)=>{
   const page=await createPage();const seconds=32/segments;const frames=Math.round(seconds*fps);const segment=path.resolve(`${renderDir}/${draft?'draft':'master'}-${worker}.mp4`);
   const filter=samples>1?`tmix=frames=${samples}:weights=1 1 1 1,select=eq(mod(n\\,${samples})\\,${samples-1}),setpts=N/(${fps}*TB),scale=out_color_matrix=bt709:out_range=tv,format=yuv420p`:'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p';
   const args=['-y','-v','error','-f','image2pipe','-framerate',String(fps*samples),'-vcodec','mjpeg','-i','pipe:0','-vf',filter,'-r',String(fps),'-c:v','libx264','-preset',draft?'veryfast':'medium','-crf',draft?'23':'17','-pix_fmt','yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-color_range','tv',segment];
   const enc=spawn(ffmpeg,args,{stdio:['pipe','ignore','pipe']});let error='';enc.stderr.on('data',d=>error+=d);enc.stdin.on('error',e=>{console.error(error||e.message);});const ended=once(enc,'close');
   for(let i=0;i<frames*samples;i++){
    if(enc.exitCode!==null)throw new Error(error);
    const frame=Math.floor(i/samples),sub=i%samples;const time=worker*seconds+frame/fps+(sub-(samples-1)/2)/(fps*samples);
    await page.evaluate(t=>seek(t),Math.max(0,time));const data=await page.screenshot({type:'jpeg',quality:draft?84:95});if(!enc.stdin.write(data))await once(enc.stdin,'drain');complete++;
    if(complete%240===0)console.log(`${draft?'Draft':'Master'} ${Math.round(complete/total*100)}%`);
   }
   enc.stdin.end();const[code]=await ended;if(code!==0)throw new Error(error);await page.close();console.log(`Segment ${worker+1}/${segments} complete`);
  }));
  const list=Array.from({length:segments},(_,i)=>`file '${(draft?'draft':'master')+'-'+i}.mp4'`).join('\n');fs.writeFileSync(path.join(renderDir,'concat.txt'),list);
  const output=path.resolve(draft?path.join(renderDir,'soma-flow-draft.mp4'):(portrait?'dist/assets/soma-launch-portrait.mp4':'dist/assets/soma-launch.mp4'));
  execFileSync(ffmpeg,['-y','-v','error','-f','concat','-safe','0','-i',path.resolve(renderDir,'concat.txt'),'-i',path.resolve('video/licensed-audio/soma-mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-t','32','-movflags','+faststart',output]);
  console.log(`Rendered ${output}`);
 }
}finally{await browser.close();}
