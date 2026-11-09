import {createRequire} from 'node:module';import {spawn,execFileSync} from 'node:child_process';import {once} from 'node:events';import fs from 'node:fs';import path from 'node:path';import{fileURLToPath}from'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));process.chdir(root);
const require=createRequire('C:/Users/paoli/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');const{chromium}=require('playwright');
const ff=path.resolve('../.sites-runtime/python/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe');
const portrait=process.argv.includes('--portrait'),draft=process.argv.includes('--draft'),test=process.argv.includes('--test'),stills=process.argv.includes('--stills');
const workerArg=process.argv.find(s=>s.startsWith('--worker=')),workerOnly=workerArg?Number(workerArg.split('=')[1]):null;
const out=portrait?'portrait':'landscape',W=portrait?1080:1920,H=portrait?1920:1080,width=draft||test?W/2:W,height=draft||test?H/2:H,fps=draft||test?30:60,samples=draft||test?1:4,duration=test?4:30;
const dir=path.resolve('qa',out);fs.mkdirSync(dir,{recursive:true});fs.mkdirSync('deliver',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-background-timer-throttling']});
async function page(){const p=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});p.on('pageerror',e=>console.error(e));await p.goto('http://127.0.0.1:4195/?render=1'+(portrait?'&portrait=1':''));await p.waitForFunction(()=>window.READY,{timeout:30000});return p}
try{
 if(stills){const p=await page();const times=Array.from({length:60},(_,i)=>i*.5+.15);for(const t of[2.9,3,3.1,8.9,9,9.1,11.9,12,12.1,14.9,15,15.1,17,17.9,18,18.1,20.9,21,21.1,23.9,24,24.1,26.9,27,27.1])times.push(t);for(const t of times){await p.evaluate(t=>seek(t),t);await p.screenshot({path:`${dir}/t-${t.toFixed(2).padStart(5,'0')}.jpg`,type:'jpeg',quality:90})}await p.evaluate(()=>seek(0));await p.screenshot({path:`deliver/poster-${out}.jpg`,type:'jpeg',quality:95});fs.writeFileSync(dir+'/geometry.json',JSON.stringify(await p.evaluate(()=>M),null,2));console.log(`Captured ${times.length} frames for ${out}`);await p.close();
 }else{
 const workers=test?1:4;let complete=0;const total=duration*fps*samples;const prefix=test?'test':draft?'draft':'master';
 await Promise.all(Array.from({length:workers},(_,i)=>i).filter(i=>workerOnly===null||i===workerOnly).map(async i=>{const p=await page();const segment=duration/workers,frames=Math.round(segment*fps),file=`${dir}/${prefix}-${i}.mp4`;
 const vf=samples===1?'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p':`tmix=frames=${samples}:weights=1 1 1 1,select=eq(mod(n\\,${samples})\\,${samples-1}),setpts=N/(${fps}*TB),scale=out_color_matrix=bt709:out_range=tv,format=yuv420p`;
 const enc=spawn(ff,['-y','-v','error','-f','image2pipe','-framerate',String(fps*samples),'-vcodec','mjpeg','-i','pipe:0','-vf',vf,'-r',String(fps),'-c:v','libx264','-preset',draft||test?'veryfast':'medium','-crf',draft||test?'22':'16','-pix_fmt','yuv420p','-colorspace','bt709','-color_primaries','bt709','-color_trc','bt709','-color_range','tv','-threads','2',file],{stdio:['pipe','ignore','pipe']});let err='';enc.stderr.on('data',d=>err+=d);enc.stdin.on('error',()=>{});const done=once(enc,'close');
 for(let n=0;n<frames*samples;n++){const f=Math.floor(n/samples),sub=n%samples,time=i*segment+f/fps+(sub-(samples-1)/2)/(fps*samples);if(enc.exitCode!==null)throw Error(err);await p.evaluate(t=>seek(t),Math.max(0,time));const data=await p.screenshot({type:'jpeg',quality:draft||test?86:96});if(!enc.stdin.write(data))await once(enc.stdin,'drain');complete++;if(complete%600===0)console.log(`${out} ${prefix} ${Math.round(complete/total*100)}%`)}enc.stdin.end();const[code]=await done;if(code!==0)throw Error(err);await p.close();console.log(`Segment ${i+1}/${workers} finished`)}));
 const list=Array.from({length:workers},(_,i)=>`file '${prefix}-${i}.mp4'`).join('\n');fs.writeFileSync(dir+`/${prefix}-concat.txt`,list);
 const silent=path.resolve(dir,`${prefix}-silent.mp4`);execFileSync(ff,['-y','-v','error','-f','concat','-safe','0','-i',dir+`/${prefix}-concat.txt`,'-c','copy',silent]);
 const target=test?dir+'/pipeline-test.mp4':draft?dir+'/draft.mp4':path.resolve('deliver',`scheduler-launch-${out}.mp4`);
 const audio='audio/full-mix.wav';if(fs.existsSync(audio)){execFileSync(ff,['-y','-v','error','-i',silent,'-i',audio,'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','256k','-t',String(duration),'-movflags','+faststart',target])}else fs.copyFileSync(silent,target);
 if(!test&&!draft)execFileSync(ff,['-y','-v','error','-i',silent,'-i','audio/music-only.wav','-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','256k','-t','30','-movflags','+faststart',path.resolve('deliver',`scheduler-launch-${out}-music-only.mp4`)]);
 if(!draft&&!test)execFileSync('python',[path.resolve('qa/tag-exports.py'),target,path.resolve('deliver',`scheduler-launch-${out}-music-only.mp4`)]);
 console.log(`Rendered ${target}`);
 }
}finally{await browser.close()}
