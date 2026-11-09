import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const html=fs.readFileSync('dist/index.html','utf8');
const local=[...html.matchAll(/(?:src|href)="([^"#?]+)"/g)].map(m=>m[1]).filter(p=>!p.includes(':'));
for(const asset of local)assert(fs.existsSync(path.join('dist',asset)),`Missing asset: ${asset}`);
assert.equal((html.match(/<h1\b/g)||[]).length,1,'Exactly one h1');
assert(html.includes('id="open-booking"'),'Booking is available');
for(const lang of ['en','ja']){const s=fs.readFileSync(`dist/assets/captions-${lang}.vtt`,'utf8');assert(s.startsWith('WEBVTT'));assert(s.includes('00:32.000'));}
const probe=JSON.parse(execFileSync('node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe',['-v','quiet','-print_format','json','-show_streams','-show_format','dist/assets/soma-launch.mp4'],{encoding:'utf8'}));
const video=probe.streams.find(s=>s.codec_type==='video');const audio=probe.streams.find(s=>s.codec_type==='audio');
assert.equal(video.width,1920);assert.equal(video.height,1080);assert.equal(video.codec_name,'h264');assert.equal(video.r_frame_rate,'60/1');assert(Math.abs(Number(probe.format.duration)-32)<.1);assert(audio,'Audio track exists');
console.log(JSON.stringify({assets:local.length,film:{duration:probe.format.duration,width:video.width,height:video.height,fps:video.r_frame_rate,audio:audio.codec_name},result:'All checks passed'}));

const portraitProbe=JSON.parse(execFileSync('node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe',['-v','quiet','-print_format','json','-show_streams','-show_format','dist/assets/soma-launch-portrait.mp4'],{encoding:'utf8'}));
const portraitVideo=portraitProbe.streams.find(s=>s.codec_type==='video');assert.equal(portraitVideo.width,1080);assert.equal(portraitVideo.height,1350);assert.equal(portraitVideo.r_frame_rate,'60/1');assert(Math.abs(Number(portraitProbe.format.duration)-32)<.1);assert(portraitProbe.streams.some(s=>s.codec_type==='audio'));console.log('Phone film: 1080x1350, 60 fps, 32 seconds, audio verified.');
