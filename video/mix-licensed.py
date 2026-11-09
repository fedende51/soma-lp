import numpy as np, scipy.io.wavfile as wav, scipy.signal as sig
from pathlib import Path
import subprocess,json
ff='E:/Projects/Soma/website/.sites-runtime/python/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
subprocess.run([ff,'-y','-v','error','-i','video/licensed-audio/classical-vibes-4.mp3','-t','32','-ar','48000','-ac','2','video/licensed-audio/source-window.wav'],check=True)
sr,x=wav.read('video/licensed-audio/source-window.wav');a=x.astype(np.float64)/32768
# Very quiet tactile clicks, not pitched musical effects.
rng=np.random.default_rng(20261017)
for cue in [3.55,10.9,16.85,22.8]:
 n=int(.038*sr);noise=rng.normal(0,1,n);noise=sig.lfilter([1,-.8],[1],noise);noise*=np.hanning(n)*np.exp(-np.arange(n)/(sr*.008))
 noise=noise/(np.max(np.abs(noise))+1e-9)*.032
 peak=int(np.argmax(np.abs(noise)));at=int(cue*sr)-peak;a[at:at+n]+=(noise[:,None]*np.array([[1,.88]]))
a[:int(.25*sr)]*=np.linspace(0,1,int(.25*sr))[:,None]
a[-int(1.6*sr):]*=np.linspace(1,0,int(1.6*sr))[:,None]
wav.write('video/licensed-audio/mix-raw.wav',sr,(np.clip(a,-1,1)*32767).astype(np.int16))
subprocess.run([ff,'-y','-v','error','-i','video/licensed-audio/mix-raw.wav','-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar','48000','video/licensed-audio/soma-mix.wav'],check=True)
print('Licensed soundtrack and tactile accents prepared.')
