# SOMA Scheduler original audio

`compose.py` composes and synthesizes the complete score and tactile interface effects locally with Python, numpy, and scipy. No music or audio samples were downloaded, copied, or generated with an external service. The deterministic seed is `12020261017`.

Musical direction: 120 BPM, D major with B minor/G major colour, a short recurring struck-string motif, warm bowed harmonic ensemble, and restrained felt pulses/brush percussion. The route reveal has an upper-register lift at 8 seconds; the bridge at 18 seconds becomes intimate; the last rising phrase resolves to D add9 at 27 seconds and tails to 30.

Outputs are `music-only.wav` and `full-mix.wav`, 48 kHz stereo 24-bit PCM, exactly 30 seconds. Each file receives independent FFmpeg two-pass loudness normalization to −14 LUFS and a −1.5 dBTP ceiling for AAC headroom, followed by a small measured static trim to calibrate the actual 48 kHz final file. Actual final-file measurements, sources, composition events, and cue alignment are in `audio-analysis.json`.

The interface cues are aligned using each source sound's measured 1 ms energy peak. Acoustic pulse verification independently filters and detects the low pulse peaks; filter group delay is documented in the analysis.

No critical listening is asserted. A human speaker/headphone and picture-sync review remains necessary before public release. Audio measurements do not establish listening quality.

Run from any directory with `python E:/Projects/Soma/website/scheduler-launch/audio/compose.py`, then `python E:/Projects/Soma/website/scheduler-launch/audio/verify.py` for signal sanity and a temporary 192 kb/s AAC codec check. FFmpeg is resolved to the project's existing runtime binary. The source uses only original local synthesis; no third-party audio credit is required.
