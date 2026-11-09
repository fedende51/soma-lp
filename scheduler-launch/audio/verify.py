"""Verify final PCM files and temporary AAC encode; update the measured report."""
from pathlib import Path
import json, re, subprocess
import numpy as np
from scipy.io import wavfile

ROOT=Path(__file__).resolve().parent
FFMPEG=Path(r"E:\Projects\Soma\website\.sites-runtime\python\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe")
report=json.loads((ROOT/"audio-analysis.json").read_text(encoding="utf-8"))
for name,label in [("music-only","music_only"),("full-mix","full_mix")]:
    path=ROOT/f"{name}.wav"
    rate,y=wavfile.read(path)
    x=y.astype(np.float64)/(2**31)
    section=[]
    for start in range(0,30,3):
        v=x[start*rate:(start+3)*rate]
        section.append({"start_s":start,"end_s":start+3,"rms_dbfs":float(20*np.log10(np.sqrt(np.mean(v*v))))})
    report['outputs'][label]['signal_sanity']={
        "finite_samples":bool(np.isfinite(x).all()),
        "clipped_samples_at_full_scale":int(np.count_nonzero(np.abs(x)>=1)),
        "last_sample_peak":float(np.max(np.abs(x[-1]))),
        "stereo_correlation":float(np.corrcoef(x.T)[0,1]),
        "section_rms_dbfs":section,
    }
    temporary=ROOT/f"{name}-codec-check.m4a"
    subprocess.run([str(FFMPEG),"-hide_banner","-y","-i",str(path),"-c:a","aac","-b:a","192k",str(temporary)],capture_output=True,check=True)
    p=subprocess.run([str(FFMPEG),"-hide_banner","-i",str(temporary),"-af","loudnorm=I=-14:TP=-1.5:LRA=10:print_format=json","-f","null","-"],capture_output=True,text=True,check=True)
    measured=json.loads(re.findall(r"\{\s*\"input_i\".*?\}",p.stderr,re.S)[-1])
    report['outputs'][label]['aac_192k_codec_check']={
        "integrated_lufs":float(measured['input_i']),"true_peak_dbtp":float(measured['input_tp']),
        "passes_minus_1_dbtp":float(measured['input_tp'])<=-1,
        "note":"Temporary AAC encode, decoded and measured with FFmpeg. Final picture mux must still be checked separately. Temporary file deleted after measurement."}
    temporary.unlink()
(ROOT/"audio-analysis.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
print(json.dumps({label:{"signal_sanity":report['outputs'][label]['signal_sanity'],"aac_192k_codec_check":report['outputs'][label]['aac_192k_codec_check']} for label in ['music_only','full_mix']},indent=2))
