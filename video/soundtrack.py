"""Original synthesized score: restrained pulse, warm chords, transition accents."""
import wave
import numpy as np
from pathlib import Path
rate=44100
duration=36
rng=np.random.default_rng(24)
audio=np.zeros((rate*duration,2),dtype=np.float64)
def add(signal,start,pan=0):
    a=int(start*rate); b=min(a+len(signal),len(audio))
    if b<=a:return
    s=signal[:b-a]
    audio[a:b,0]+=s*(.8-.3*pan)
    audio[a:b,1]+=s*(.8+.3*pan)
def tone(freq,seconds,amp=.1,decay=2):
    t=np.arange(int(rate*seconds))/rate
    return (np.sin(2*np.pi*freq*t)+.18*np.sin(4*np.pi*freq*t)) * np.exp(-decay*t)*np.minimum(t*50,1)*amp
chords=[[130.81,164.81,196],[110,130.81,164.81],[87.31,110,130.81],[98,123.47,146.83]]
for i in range(12):
    chord=chords[i%4];start=i*3
    for j,freq in enumerate(chord):
        t=np.arange(int(rate*3.6))/rate
        pad=np.sin(2*np.pi*freq*t)*np.sin(np.pi*np.minimum(t/3.6,1))**2*.029
        add(pad,start,(-.45,0,.45)[j])
    for j in range(5):
        add(tone(chord[j%3]*2,.9,.06,4),start+j*.6,(-.5,.4,0,.6,-.3)[j])
    add(tone(chord[0]/2,2.4,.12,1.7),start)
for start in np.arange(.6,34.8,.6):
    t=np.arange(int(rate*.06))/rate
    click=rng.normal(size=len(t))*np.exp(-t*110)*.025
    add(click,float(start),.15)
for start in [5.5,10.5,18.5,24.5,30.5]:
    t=np.arange(int(rate*.45))/rate
    air=rng.normal(size=len(t));air=np.convolve(air,np.ones(25)/25,mode='same')
    add(air*np.sin(np.pi*t/.45)**2*.12,start-.3,-.1)
fade=np.minimum(np.arange(len(audio))/rate/1.5,1)*np.minimum((len(audio)-np.arange(len(audio)))/rate/2.5,1)
audio*=fade[:,None]
audio=np.tanh(audio*1.2)
out=Path('dist/assets/soundtrack.wav');out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes((audio*32767).astype('<i2').tobytes())
print(f'Original stereo score: {duration}s, {rate} Hz')
