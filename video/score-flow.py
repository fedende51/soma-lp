"""SOMA original score: 120 BPM, a build/reveal/interaction/resolution arc."""
import json,wave
from pathlib import Path
import numpy as np
R=44100;D=32;rng=np.random.default_rng(8)
audio=np.zeros((R*D,2),np.float64)
def add(s,at,pan=0,align_peak=False):
    if align_peak:at-=int(np.argmax(np.abs(s)))/R
    start=round(at*R);skip=max(0,-start);start=max(0,start);end=min(start+len(s)-skip,len(audio))
    if end<=start:return
    audio[start:end,0]+=s[skip:skip+end-start]*(.75-.25*pan)
    audio[start:end,1]+=s[skip:skip+end-start]*(.75+.25*pan)
def pluck(f,d=.7,a=.1):
    t=np.arange(round(R*d))/R
    s=sum(np.sin(2*np.pi*f*k*t)/k**1.8 for k in range(1,6))
    return s*np.exp(-t*7)*np.minimum(t*150,1)*a
def pad(f,d,a):
    t=np.arange(round(R*d))/R
    s=(np.sin(2*np.pi*f*t)+.35*np.sin(2*np.pi*f*1.002*t)+.15*np.sin(4*np.pi*f*t))
    env=np.minimum(t/.3,1)*np.minimum((d-t)/.65,1)
    return s*env*a
def kick(a):
    t=np.arange(round(R*.28))/R;phase=2*np.pi*(44*t+8*(1-np.exp(-t*28)))
    return np.sin(phase)*np.exp(-t*18)*np.minimum(t*800,1)*a
def hat(a):
    t=np.arange(round(R*.075))/R;n=rng.normal(size=len(t));n=n-np.convolve(n,np.ones(9)/9,mode='same')
    return n*np.exp(-t*80)*a
def click():
    t=np.arange(round(R*.09))/R
    return (np.sin(2*np.pi*1450*t)*np.exp(-t*110)+rng.normal(size=len(t))*.25*np.exp(-t*150))*np.minimum(t*2000,1)*.13
def sweep(d=.65,a=.08):
    t=np.arange(round(R*d))/R;n=rng.normal(size=len(t));n=np.convolve(n,np.ones(24)/24,mode='same')
    return n*np.sin(np.pi*t/d)**1.5*a
chords=[[146.83,174.61,220],[130.81,164.81,196],[116.54,146.83,174.61],[130.81,164.81,196]]
for bar in range(16):
    start=bar*2;c=chords[bar%4]
    if start>=30:c=[146.83,174.61,220,293.66]
    for j,f in enumerate(c):add(pad(f,2.6,.025 if start<8 else .035),start,[-.6,0,.6,0][j])
    if start<30:
        for step in range(4):
            at=start+step*.5
            if 16<=at<22 and step%2:continue
            add(kick(.19 if at>=8 else .11),at)
        for step in range(8):
            at=start+step*.25
            if at<4 or 16<=at<22:continue
            add(hat(.013 if step%2 else .022),at,.35 if step%2 else -.35)
        add(pad(c[0]/2,1.8,.075),start)
    if start>=8 and start<16 or 22<=start<30:
        for step,degree in enumerate([0,2,1,2]):
            add(pluck(c[degree]*2,.8,.065),start+step*.5,(-.5,.4,-.2,.6)[step])
    elif 4<=start<8:
        for step in range(4):add(pluck(c[step%3]*2,.5,.025+step*.008),start+step*.5,(-.3 if step%2 else .3))
for at in [8,22,30]:add(sweep(.9,.18),at-.85)
for at in np.arange(6,8,.125):add(hat(.015+(at-6)*.01),float(at),.1)
cues=json.loads(Path('video/cues.json').read_text()) if Path('video/cues.json').exists() else {'cues':[]}
timing=[]
for cue in cues['cues']:
    s=click() if cue['type']=='click' else sweep(.4,.1)
    add(s,cue['time'],.05,True)
    timing.append({'visual_time':cue['time'],'sound_peak_time':cue['time'],'type':cue['type']})
for f in [146.83,220,293.66,349.23,440]:add(pad(f,2,.045),30,0)
fadein=np.minimum(np.arange(len(audio))/R/.025,1);fadeout=np.minimum((len(audio)-np.arange(len(audio)))/R/.5,1)
audio*=fadein[:,None]*fadeout[:,None]
peak=np.max(np.abs(audio));gain=.86/peak;audio*=gain
Path('video/source-audio').mkdir(parents=True,exist_ok=True)
with wave.open('video/source-audio/launch-score-raw.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(R);w.writeframes((audio*32767).astype('<i2').tobytes())
Path('video/audio-cues.json').write_text(json.dumps({'duration':D,'bpm':120,'key':'D minor','cue_alignment':timing,'peak_before_normalization':float(np.max(np.abs(audio))),'listening_review':False},indent=2))
print('Original 32-second score composed; peak-aligned UI events exported.')
