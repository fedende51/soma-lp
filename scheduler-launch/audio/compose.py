"""SOMA / Make room for change — deterministic original 30-second score.

All timbres are locally synthesized; there are no samples, MIDI files, or external
music assets. Run with Python + numpy + scipy. FFmpeg performs measured two-pass
loudness normalization. This is a musical composition source, not an audio model.
"""
from pathlib import Path
import json
import math
import re
import subprocess
import numpy as np
from scipy import signal
from scipy.io import wavfile

ROOT = Path(__file__).resolve().parent
FFMPEG = Path(r"E:\Projects\Soma\website\.sites-runtime\python\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe")
SR = 48000
DURATION = 30.0
N = int(SR * DURATION)
BPM = 120
RNG = np.random.default_rng(12020261017)
music = np.zeros((N, 2), dtype=np.float64)
sfx = np.zeros_like(music)
rhythm = np.zeros_like(music)
cue_log = []
note_log = []
beat_log = []


def hz(midi):
    return 440.0 * 2.0 ** ((midi - 69.0) / 12.0)


def stereo(mono, pan=0.0, width=0.0):
    """Equal-power dry position; optional tiny interchannel decorrelation."""
    theta = (pan + 1) * np.pi / 4
    l = np.asarray(mono) * np.cos(theta)
    r = np.asarray(mono) * np.sin(theta)
    if width:
        shifted = np.roll(mono, int(width * SR))
        shifted[:int(width * SR)] = 0
        r = 0.93*r + .07*shifted
    return np.column_stack([l, r])


def peak_index(y):
    mono_power = np.mean(y*y, axis=1) if y.ndim == 2 else y*y
    # A 1 ms energy window gives a tactile peak rather than a random sample crest.
    win = np.ones(49) / 49
    return int(np.argmax(np.convolve(mono_power, win, mode="same")))


def put(dest, y, t, gain=1.0, align_peak=False, pan=0.0):
    if y.ndim == 1:
        y = stereo(y, pan)
    pk = peak_index(y)
    start = int(round(t*SR)) - (pk if align_peak else 0)
    source_start = max(0, -start)
    target_start = max(0, start)
    count = min(len(y)-source_start, len(dest)-target_start)
    if count > 0:
        dest[target_start:target_start+count] += gain*y[source_start:source_start+count]
    return {"requested_peak_s": t, "measured_peak_s": (start+pk)/SR,
            "deviation_ms": ((start+pk)/SR-t)*1000,
            "source_peak_s": pk/SR, "start_s": start/SR}


def piano(midi, duration=2.7, velocity=.7):
    """Felt-hammer, stretched-partial struck strings with a soundboard body."""
    t = np.arange(int(duration*SR))/SR
    f = hz(midi)
    out = np.zeros_like(t)
    # Two beating strings. Higher partials decay sooner, with no looping oscillator.
    for detune, weight in [(-.0012, .48), (.0009, .52)]:
        for harmonic in range(1, 13):
            partial_f = f*harmonic*np.sqrt(1+.00013*harmonic*harmonic)*(1+detune)
            if partial_f > 15000:
                continue
            amp = (1/harmonic**1.65) * np.exp(-harmonic*.055)
            tau = (2.15*2**((60-midi)/60))/(1+.21*(harmonic-1))
            phase = RNG.uniform(-.025, .025)
            out += weight*amp*np.sin(2*np.pi*partial_f*t+phase)*np.exp(-t/tau)
    hammer = RNG.normal(0, 1, len(t))
    hammer = signal.sosfilt(signal.butter(2, [650, 7000], fs=SR, btype="bandpass", output="sos"), hammer)
    out += .025*hammer*np.exp(-t/.012)
    # A short attack removes digital clicks and softens the felt strike.
    out *= (1-np.exp(-t/.0021))
    out *= np.minimum(1, np.maximum(0, (duration-t)/.10))
    out = signal.sosfilt(signal.butter(2, 6800, fs=SR, output="sos"), out)
    return out*velocity


def ensemble(midis, duration, level=.22, attack=.32, release=.7):
    """Warm bowed harmonic ensemble, with independent vibrato and bow noise."""
    t = np.arange(int(duration*SR))/SR
    result = np.zeros((len(t), 2))
    for k, midi in enumerate(midis):
        note = np.zeros_like(t)
        for v in range(3):
            detune = (v-1)*.0016 + RNG.uniform(-.00025, .00025)
            vibrato_phase = RNG.uniform(0, 2*np.pi)
            phase = 2*np.pi*hz(midi)*(1+detune)*t + .022*np.sin(2*np.pi*(4.2+.14*v)*t+vibrato_phase)
            for h in range(1, 10):
                # The subdued harmonic rolloff is the opposite of a buzzy saw pad.
                note += .33*np.sin(h*phase+RNG.uniform(-.15,.15))/h**1.85*np.exp(-h*.13)
        note *= (.97+.03*np.sin(2*np.pi*.77*t+k))
        env = np.minimum(1,t/attack)
        env = np.sin(env*np.pi/2)**2
        env *= np.minimum(1, np.maximum(0, (duration-t)/release))**1.5
        note *= env*level
        result += stereo(note, -.5+k/max(1,len(midis)-1), .009+.002*k)
    return result


def felt_pulse(strength=1.0, bright=False):
    t = np.arange(int(.22*SR))/SR
    phase = 2*np.pi*(68*t + (32/(2*np.pi*26))*(1-np.exp(-26*t)))
    body = np.sin(phase)*np.exp(-t/.045)
    noise = RNG.normal(0,1,len(t))
    noise = signal.sosfilt(signal.butter(2,[500,3200 if bright else 1900],fs=SR,btype="bandpass",output="sos"),noise)
    body += (.12 if bright else .065)*noise*np.exp(-t/.014)
    body *= (1-np.exp(-t/.0007))
    return body*strength


def brush():
    t = np.arange(int(.16*SR))/SR
    y = RNG.normal(0,1,len(t))
    y = signal.sosfilt(signal.butter(2,[2700,7000],fs=SR,btype="bandpass",output="sos"),y)
    return y*(1-np.exp(-t/.0009))*np.exp(-t/.022)


def tactile(kind):
    t = np.arange(int(.19*SR))/SR
    base = {"press":410,"release":590,"proposal":270,"review":460,
            "apply":340,"route":390,"create":500,"logo":146}[kind]
    y = .47*np.sin(2*np.pi*base*t)*np.exp(-t/.010)
    y += .19*np.sin(2*np.pi*(base*2.31)*t+.4)*np.exp(-t/.006)
    y += .15*np.sin(2*np.pi*(base*.48)*t)*np.exp(-t/.035)
    noise = RNG.normal(0,1,len(t))
    noise = signal.sosfilt(signal.butter(2,[850,4900],fs=SR,btype="bandpass",output="sos"),noise)
    y += .14*noise*np.exp(-t/.004)
    y *= 1-np.exp(-t/.00045)
    if kind in ["apply", "create"]:
        # A very quiet in-key wooden resonance, still a tactile cue, not a bleep.
        y += .035*np.sin(2*np.pi*hz(74)*t)*np.exp(-t/.065)*(1-np.exp(-t/.001))
    if kind == "logo":
        y += .3*np.sin(2*np.pi*73.416*t)*np.exp(-t/.085)*(1-np.exp(-t/.002))
    return y


def surface():
    duration = .52
    t = np.arange(int(duration*SR))/SR
    noise = RNG.normal(0,1,len(t))
    noise = signal.sosfilt(signal.butter(2,[450,3600],fs=SR,btype="bandpass",output="sos"),noise)
    # A small fabric/paper movement, no sci-fi pitch sweep.
    env = np.exp(-.5*((t-.21)/.084)**2)
    env *= np.sin(np.pi*t/duration)**2
    return noise*env*.17


def add_note(t, midi, velocity=.55, duration=2.6, pan=0):
    info = put(music,piano(midi,duration,velocity),t,.25,align_peak=True,pan=pan)
    note_log.append({"time_s":t,"midi":midi,"velocity":velocity,"duration_s":duration,
                     "onset_peak_s":info["measured_peak_s"]})


# Ten six-beat phrases, with longer voicings crossing phrase boundaries.
# D add9 | Bm7 | Gmaj9 | D/F# | Asus4 A | Bm7 | Gmaj7 | D add9 | A | D add9.
harmonies = [
    (0,[50,57,62,66,69],.11), (3,[47,54,57,62,66],.19),
    (6,[43,55,59,62,69],.25), (9,[42,54,57,62,66],.23),
    (12,[45,57,62,64,69],.25), (15,[47,54,57,62,66],.18),
    (18,[43,55,59,62,66],.11), (21,[50,57,62,66,69],.20),
    (24,[45,57,61,64,69],.28), (27,[38,50,57,62,66,69,76],.27),
]
for start,chord,level in harmonies:
    if start != 0:
        put(music,ensemble(chord[1:],3.65,level,attack=.36,release=.8),start-.15)
    add_note(start,chord[0],.68 if start in [6,24,27] else .5,3.1,-.12)

# Composed melody. Sustained answers and register changes prevent an arpeggio loop.
melody = [
    (0,66,.72,2.6), (1,69,.57,2.1), (2,64,.50,1.7), (2.5,62,.45,2),
    (3.5,66,.56,2.6), (5,69,.51,2.2),
    (6,71,.62,2.6), (7,69,.53,1.8), (8,74,.85,3.4), (8.5,73,.52,1.8),
    (9,69,.59,2.5), (10.5,66,.52,2), (11.5,64,.43,2.3),
    (12,62,.61,2.6), (13,64,.56,2.2), (14,69,.69,2.5),
    (15,66,.64,2.8), (16.5,62,.46,2.1), (17.5,61,.36,1.4),
    (18,59,.53,3.0), (20,62,.43,2.3),
    (21,66,.75,2.5), (22,69,.64,2.3), (23,64,.55,1.8), (23.5,62,.5,1.7),
    (24,69,.73,2.5), (25,73,.76,2.5), (26,76,.82,2.3), (26.5,73,.51,1.6),
    (27,74,.82,3.0),
]
for i,(start,midi,vel,dur) in enumerate(melody):
    add_note(start,midi,vel,dur,(-.14,.12,-.04)[i%3])

# Sparse voiced piano support and the two principal lifts.
for start,notes,vel in [
    (3,[54,62],.29),(6,[55,62,67],.38),(8,[59,66,69],.46),
    (9,[57,62],.28),(12,[57,64],.34),(14,[57,61,64],.3),
    (15,[54,62],.3),(18,[55,62],.23),(21,[57,62],.29),
    (24,[57,64],.38),(26,[57,61,69],.42),(27,[50,57,62,66,69],.48)]:
    for k,midi in enumerate(notes):
        add_note(start,midi,vel,3.0,(-.3,.3,0,.15,-.15)[k])

# Tactile acoustic pulse grows through the main manipulation passage, falls away
# during the intimate bridge, then resolves with the last harmonic downbeat.
beats = [(0,.18),(2,.13),(3,.16),(4,.13),(5,.15),(6,.21),(7,.18),(8,.31)]
beats += [(t,.23 if t%1==0 else .12) for t in np.arange(9,18,.5)]
beats += [(21,.21),(22,.16),(23,.18)]
beats += [(t,.27 if t%1==0 else .14) for t in np.arange(24,27,.5)]
beats += [(27,.29)]
for t,level in beats:
    info=put(rhythm,felt_pulse(),float(t),level,align_peak=True,pan=0)
    beat_log.append({"time_s":float(t),"strength":level,**info})
for t in [9.5,10.5,11.5,12.5,13.5,14.5,15.5,16.5,17.5,24.5,25.5,26.5]:
    put(rhythm,brush(),t,.029,align_peak=True,pan=.16)
music += rhythm

# A short early-reflection room and longer, quiet air around the musical stems.
# Fixed delays preserve the authored rhythm and introduce no onset drift.
dry = music.copy()
for delay,level in [(.021,.09),(.043,.065),(.079,.055),(.127,.045),(.191,.035),(.293,.03),(.419,.022),(.577,.014)]:
    shift = int(delay*SR)
    music[shift:] += level*dry[:-shift,::-1]

# Precisely aligned interface peaks and low-level, motivated surface movement.
actions=[(9.5,"press",.13),(11,"release",.105),(12,"proposal",.11),
         (15,"review",.11),(17,"apply",.155),(21,"route",.10),
         (25.5,"create",.16),(27,"logo",.16)]
for t,kind,level in actions:
    info=put(sfx,tactile(kind),t,level,align_peak=True,pan=.03)
    cue_log.append({"kind":kind,"target_s":t,"gain":level,**info})
for t in [3,6,15,21,24,27]:
    info=put(sfx,surface(),t,.095,align_peak=True,pan=-.05)
    cue_log.append({"kind":"soft_surface","target_s":t,"gain":.095,**info})

# Master gain is static; no pumping or scene-by-scene loudness jumps.
# Fade the resolved chord's natural tail to exact digital silence at 30 seconds.
fade = np.ones(N)
fade[:240] = np.sin(np.linspace(0,np.pi/2,240))**2
tail = int(1.00*SR)
fade[-tail:] = np.cos(np.linspace(0,np.pi/2,tail))**2
music *= fade[:,None]
sfx *= fade[:,None]
music -= np.mean(music,axis=0)
sfx -= np.mean(sfx,axis=0)
music *= fade[:,None]
sfx *= fade[:,None]
full = music+sfx
peak=max(float(np.max(np.abs(music))),float(np.max(np.abs(full))))
static_gain=.78/peak
music*=static_gain
full*=static_gain
wavfile.write(ROOT/"music-only-raw.wav",SR,music.astype(np.float32))
wavfile.write(ROOT/"full-mix-raw.wav",SR,full.astype(np.float32))
wavfile.write(ROOT/"rhythm-analysis-stem.wav",SR,(rhythm*.5).astype(np.float32))


def run_ffmpeg(args):
    p=subprocess.run([str(FFMPEG),"-hide_banner",*args],capture_output=True,text=True,check=True)
    return p.stderr


def loud_json(stderr):
    blocks=re.findall(r"\{\s*\"input_i\".*?\}",stderr,re.S)
    if not blocks:
        raise RuntimeError(stderr[-6000:])
    return json.loads(blocks[-1])


def normalize(name):
    src=ROOT/f"{name}-raw.wav"
    dst=ROOT/f"{name}.wav"
    first=loud_json(run_ffmpeg(["-i",str(src),"-af","loudnorm=I=-14:TP=-1.5:LRA=10:print_format=json","-f","null","-"]))
    filt=("loudnorm=I=-14:TP=-1.5:LRA=10:linear=true:"
          f"measured_I={first['input_i']}:measured_TP={first['input_tp']}:"
          f"measured_LRA={first['input_lra']}:measured_thresh={first['input_thresh']}:"
          f"offset={first['target_offset']}:print_format=json")
    second=loud_json(run_ffmpeg(["-y","-i",str(src),"-af",filt,"-ar",str(SR),"-t","30","-c:a","pcm_s24le",str(dst)]))
    measured=loud_json(run_ffmpeg(["-i",str(dst),"-af","loudnorm=I=-14:TP=-1.5:LRA=10:print_format=json","-f","null","-"]))
    # FFmpeg's dynamic pass and subsequent 48 kHz resampling can differ by a
    # fraction of a LU. Calibrate the actual final file using one static trim.
    correction_db=-14-float(measured['input_i'])
    if abs(correction_db)>.02:
        calibrated=ROOT/f"{name}-calibrated.wav"
        run_ffmpeg(["-y","-i",str(dst),"-af",f"volume={correction_db}dB","-ar",str(SR),"-c:a","pcm_s24le",str(calibrated)])
        calibrated.replace(dst)
        measured=loud_json(run_ffmpeg(["-i",str(dst),"-af","loudnorm=I=-14:TP=-1.5:LRA=10:print_format=json","-f","null","-"]))
    rate,y=wavfile.read(dst)
    sample_peak=float(np.max(np.abs(y.astype(np.float64))))/(2**31)
    return {"path":str(dst),"sample_rate_hz":rate,"channels":y.shape[1],
            "duration_s":len(y)/rate,"sample_count":len(y),"encoding":"PCM signed 24-bit stereo WAV",
            "integrated_lufs":float(measured['input_i']),"true_peak_dbtp":float(measured['input_tp']),
            "loudness_range_lu":float(measured['input_lra']),"sample_peak_dbfs":20*math.log10(sample_peak),
            "normalization_pass":second,"final_static_calibration_db":correction_db,"analysis_pass":measured,
            "target_integrated_lufs":-14,"target_true_peak_dbtp":-1.5}


def detect_beats():
    # Independent onset measurement of the generated rhythm stem. Filtered power
    # follows the low acoustic pulse; local maxima are measured near authored grid.
    mono=np.mean(rhythm,axis=1)
    low=signal.sosfilt(signal.butter(3,[35,220],fs=SR,btype="bandpass",output="sos"),mono)
    env=signal.convolve(low**2,np.ones(97)/97,mode="same")
    measured=[]
    for beat in beat_log:
        target=beat["time_s"]
        lo=max(0,int((target-.035)*SR)); hi=min(N,int((target+.035)*SR))
        idx=lo+int(np.argmax(env[lo:hi]))
        measured.append({"target_s":target,"detected_peak_s":idx/SR,"deviation_ms":(idx/SR-target)*1000})
    # Spectral flux at 5 ms hops + autocorrelation verifies the musical pulse;
    # strong/weak accents may produce octave-related candidates, all reported.
    f,tt,z=signal.stft(mono,fs=SR,nperseg=1024,noverlap=784)
    magnitude=np.abs(z[(f>35)&(f<2500)])
    flux=np.sum(np.maximum(0,np.diff(magnitude,axis=1)),axis=0)
    corr=signal.correlate(flux-np.mean(flux),flux-np.mean(flux),mode="full")
    corr=corr[len(corr)//2:]
    hop=240/SR
    candidates=[]
    for bpm in [60,80,100,120,140,160,180,240]:
        lag=round((60/bpm)/hop)
        candidates.append({"bpm":bpm,"autocorrelation":float(corr[lag]/corr[0])})
    return {"method":"Scipy band-pass 35–220 Hz, 2 ms centered power envelope; local peaks ±35 ms of expected acoustic pulses. Independent 1024-sample STFT flux at 5 ms hop with autocorrelation.",
            "authored_bpm":BPM,"grid_period_s":.5,"musical_pulse_events":len(beat_log),
            "max_absolute_filtered_peak_deviation_ms":max(abs(x['deviation_ms']) for x in measured),
            "median_absolute_filtered_peak_deviation_ms":float(np.median([abs(x['deviation_ms']) for x in measured])),
            "detected_pulse_peaks":measured,"tempo_autocorrelation_candidates":candidates,
            "caveat":"Band-pass group delay shifts acoustic energy peaks several milliseconds. Exact UI cue placement uses the individual unfiltered 1 ms energy peak, reported separately."}


if __name__=="__main__":
    print("Synthesized original music, rhythm, and interface effects.",flush=True)
    music_measure=normalize("music-only")
    print("Music-only normalized and measured.",flush=True)
    full_measure=normalize("full-mix")
    print("Full mix normalized and measured.",flush=True)
    report={"title":"SOMA Scheduler — Make room for change","composer":"Original local composition generated for SOMA with this deterministic Python source", 
            "seed":12020261017,"duration_s":30,"bpm":120,"key":"D major, with B minor and G major colour; suspended A resolves to D",
            "sources":{"music":"Locally synthesized additive struck-string piano, harmonic bowed ensemble, acoustic-style pulses and brushes. No external samples or generated third-party music.",
                       "sfx":"Locally synthesized tactile modal clicks and filtered surface noise.","code":str(Path(__file__).resolve()),"third_party_audio_assets":[]},
            "arc":[{"start_s":a,"end_s":b,"description":d} for a,b,d in [
                (0,3,"Intimate four-note piano motif; sparse felt pulse"),(3,6,"Warm ensemble enters under a melodic answer"),
                (6,9,"G major expansion; upper-register piano lift at 8 seconds"),(9,15,"Rhythmic direct manipulation passage; A suspended chord resolves"),
                (15,18,"Piano answer with restrained rhythm; apply click at 17"),(18,21,"Intimate low-register bridge; percussion falls away"),
                (21,24,"Recognizable opening motif returns"),(24,27,"Final rising phrase and fuller dominant chord"),(27,30,"Resolved D add9 chord, natural sustained tail and final fade")]],
            "outputs":{"music_only":music_measure,"full_mix":full_measure},"beat_analysis":detect_beats(),
            "sfx_cues":cue_log,"max_sfx_peak_alignment_deviation_ms":max(abs(c['deviation_ms']) for c in cue_log),
            "composition_notes":note_log,
            "verification":{"measurement_only":True,"listening_performed":False,"limitations":"No critical listening session was available. Measured loudness, true peak, durations and alignment do not establish perceived timbre, speaker balance, or picture synchronization. Parent film should mux these exact files and review against rendered actions."}}
    (ROOT/"audio-analysis.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps({"music_only":music_measure,"full_mix":full_measure,"beat_sync_max_ms":report['beat_analysis']['max_absolute_filtered_peak_deviation_ms'],"sfx_sync_max_ms":report['max_sfx_peak_alignment_deviation_ms']},indent=2),flush=True)
