# SOMA Scheduler — launch product film

Open `deliver/review.html` through the included local server to preview and download both formats and both mixes.

```
node E:/Projects/Soma/website/scheduler-launch/serve.mjs
```

The server binds only to the local device on port4195. This is a review artifact; it has not replaced or republished the existing website.

## Delivery

- `deliver/scheduler-launch-landscape.mp4`: 1920×1080,60fps,30s, original music plus tactile effects.
- `deliver/scheduler-launch-portrait.mp4`: independently composed1080×1920,60fps,30s.
- `deliver/*-music-only.mp4`: same picture with only the original score.
- `deliver/contact-sheet.jpg` and `contact-sheet-portrait.jpg`:18 encoded frames each.
- `deliver/poster-*.jpg` and `captions-en.vtt`.
- `brief.md`, `facts.json`, `style-bible.md`, `timing.json`, `research.md`, `ledger.md`, `qa/quality-bar.json` and independent critic reports.

The original UI visuals are an illustrative reconstruction of documented behavior, not a screen recording. Example data is labeled inside the film. The current P1 manual planning scope is kept separate from future integrations and live shop-floor tracking. No performance statistics, customer endorsements or public product URL are invented.

## Rebuild

`index.html` and `film.js` contain the film. Fonts and unchanged original logos are local in `assets/`, including font license notices. Every animated value is derived from `seek(t)`; there are no running simulations. Authoring playback uses requestAnimationFrame only to select the current film time; exports sample pure time.

`timing.json` sets the beat grid, scene starts and action cues. `prepare.py` regenerates the baseline facts/timing from the BRD. Preserve editorial fact annotations when regenerating. The locally composed music and effects are reproducible with `audio/compose.py`; run `audio/verify.py` for signal checks. `audio/audio-analysis.json` records source peak alignment and independent pulse analysis.

The render script uses the existing bundled Playwright dependency and the project's FFmpeg runtime. Start the local server first, then:

```
node E:/Projects/Soma/website/scheduler-launch/render.mjs --test
node E:/Projects/Soma/website/scheduler-launch/render.mjs --draft
node E:/Projects/Soma/website/scheduler-launch/render.mjs --draft --portrait
node E:/Projects/Soma/website/scheduler-launch/render.mjs --stills
node E:/Projects/Soma/website/scheduler-launch/render.mjs
node E:/Projects/Soma/website/scheduler-launch/render.mjs --portrait
node E:/Projects/Soma/website/scheduler-launch/qa/check-layout.mjs
python E:/Projects/Soma/website/scheduler-launch/qa/verify-exports.py
python E:/Projects/Soma/website/scheduler-launch/package.py
```

Masters sample four temporal subframes for each frame, blend them for motion blur, and encode H.264/yuv420p/BT.709 with AAC and faststart. A metadata-only remux explicitly sets BT.709 primaries, transfer and matrix plus limited range without reencoding. Four independently rendered 7.5s segments preserve frame-derived continuity; `--worker=3` can rebuild only the final segment after an isolated end-card change.

## Checks and limits

Use the final output checks and critic reports, not source execution alone, to judge the result. The previous website film remains at `E:/Projects/Soma/website/dist/assets/soma-launch.mp4`; the earlier30fps drafts remain under `qa/` for comparison.

Before public release, listen on actual speakers/headphones, compare the illustrative panels with the current application, confirm the chosen public CTA/domain and assess the example schedule with a product owner. No critical listening is claimed from level measurements or browser playback. The delivery contains no voiceover and does not require generated speech or likeness permissions.
