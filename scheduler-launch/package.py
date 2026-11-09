from pathlib import Path
import json,zipfile,hashlib

root=Path(__file__).resolve().parent
qa=root/'qa'
quality=json.loads((qa/'quality-bar.json').read_text(encoding='utf-8'))
quality['quality_bar']['brand_decoded_rgb']={'method':'FFmpeg PNG decoding from the final BT.709 master; interior color samples. Source colors may shift by3 channel values through H.264 chroma conversion.','blue_source':[11,121,169],'blue_decoded':[8,120,167],'navy_source':[0,60,91],'navy_decoded':[0,57,90],'max_channel_error':3}
quality['quality_bar']['independent_visual_verdict']='Ship — see final-critic.md; no P0/P1 remaining. Perceptual audio review is a stated human handoff.'
quality['quality_bar']['final_colour_metadata']='BT.709 primaries, transfer, matrix; limited range. Lossless H.264 metadata remux, decoded frames unchanged.'
(qa/'quality-bar.json').write_text(json.dumps(quality,indent=2),encoding='utf-8')
manifest={'title':'SOMA Scheduler — Make room for change','duration_seconds':30,'fps':60,'formats':['1920×1080','1080×1920'],'exports':[{'path':'deliver/'+x['file'],'sha256':hashlib.sha256((root/'deliver'/x['file']).read_bytes()).hexdigest(),'bytes':(root/'deliver'/x['file']).stat().st_size} for x in quality['exports']],'source':'index.html + film.js + timing.json + assets/ + audio/compose.py','facts':'facts.json','review':'qa/final-critic.md','human_check':'Listen on speakers/headphones; confirm current product visual fidelity and public CTA/domain before publishing.'}
(root/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
out=root.parents[1]/'delivery'/'Scheduler-launch-video-2026-10-17.zip'
selected=[]
for p in root.iterdir():
 if p.is_file() and p.suffix in ['.md','.json','.html','.js','.mjs','.py']:selected.append(p)
selected.extend(p for p in (root/'deliver').iterdir() if p.is_file())
selected.extend(p for p in (root/'assets').iterdir() if p.is_file())
for p in (root/'audio').iterdir():
 if p.name in ['compose.py','verify.py','audio-analysis.json','README.md','full-mix.wav','music-only.wav']:selected.append(p)
selected.extend(p for p in qa.iterdir() if p.is_file() and p.suffix in ['.json','.md','.mjs','.py','.txt'])
for folder in ['critic-final','critic-draft']:
 sub=qa/folder
 if sub.exists():selected.extend(p for p in sub.iterdir() if p.is_file() and (p.suffix in ['.json','.md','.py','.cjs','.mjs'] or p.name.startswith(('silent-2fps','phone390-','dense-','all-5fps-','end-edge-'))))
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(set(selected)):z.write(p,'Scheduler-launch/'+p.relative_to(root).as_posix())
print(json.dumps({'archive':str(out),'bytes':out.stat().st_size,'files':len(set(selected))},indent=2))
