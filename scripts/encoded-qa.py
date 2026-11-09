from pathlib import Path
import subprocess,json,sys
import numpy as np
from PIL import Image,ImageDraw
binary=next(Path('.sites-runtime/python/imageio_ffmpeg/binaries').glob('ffmpeg-*.exe'))
portrait='--portrait' in sys.argv
source='dist/assets/soma-launch-portrait.mp4' if portrait else 'dist/assets/soma-launch.mp4'
thumbw,thumbh=(270,338) if portrait else (480,270)
framew,frameh=(160,200) if portrait else (160,90)
out=Path('artifacts/encoded-portrait' if portrait else 'artifacts/encoded');out.mkdir(parents=True,exist_ok=True)
subprocess.run([str(binary),'-y','-v','error','-i',source,'-vf',f'fps=1,scale={thumbw}:{thumbh}','-q:v','3',str(out/'second-%02d.jpg')],check=True)
images=sorted(out.glob('second-*.jpg'));sheet=Image.new('RGB',(4*thumbw,8*(thumbh+24)),'#101719');draw=ImageDraw.Draw(sheet)
for i,p in enumerate(images):
    x=(i%4)*thumbw;y=(i//4)*(thumbh+24);sheet.paste(Image.open(p),(x,y));draw.text((x+8,y+thumbh+4),f'{i:02d}s',fill='#a8bcbe')
sheet.save(out/'storyboard.jpg')
raw=subprocess.run([str(binary),'-v','error','-i',source,'-vf',f'scale={framew}:{frameh},format=gray','-f','rawvideo','-'],check=True,capture_output=True).stdout
frames=np.frombuffer(raw,np.uint8).reshape(-1,frameh,framew).astype(np.int16)
diff=np.abs(np.diff(frames,axis=0)).mean(axis=(1,2))
seams={str(s):float(diff[s*60-1]) for s in [8,16,24]}
report={'frames':len(frames),'resolution':'1080x1350' if portrait else '1920x1080','fps':60,'seconds':32,'frame_difference_mean':float(diff.mean()),'frame_difference_p99':float(np.quantile(diff,.99)),'segment_seams':seams,'black_frames':int((frames.mean(axis=(1,2))<3).sum()),'fully_white_frames':int((frames.min(axis=(1,2))>250).sum())}
assert len(frames)==1920
assert all(v<5 for v in seams.values()),seams
assert report['black_frames']==0
assert report['fully_white_frames']==0
(out/'report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report))
