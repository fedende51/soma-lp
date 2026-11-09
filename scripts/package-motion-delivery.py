from pathlib import Path
import hashlib,json,shutil,zipfile
import os

preview_password = os.environ.get('SOMA_PREVIEW_PASSWORD', '').encode('utf-8')
if not preview_password:
    raise SystemExit('Set SOMA_PREVIEW_PASSWORD before packaging the protected site.')

root=Path(__file__).resolve().parents[1];repo=root.parent
template=repo/'delivery/SOMA-upload-plex-stable-faq'
target=repo/'delivery/SOMA-upload-login-fit';target.mkdir(parents=True,exist_ok=True)
for name in ['public_html/soma/.htaccess','soma-private/config.php','soma-private/.htaccess','soma-private/runtime/.gitkeep','READ-ME-FIRST.txt','ASSET-NOTICES.md']:
 dest=target/name;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(template/name,dest)
shutil.copyfile(root/'hosting/php/index.php',target/'public_html/soma/index.php')
shutil.copyfile(root/'hosting/php/login.php',target/'soma-private/login.php')
site_files=[]
for file in sorted((root/'dist').rglob('*')):
 if not file.is_file():continue
 relative=file.relative_to(root/'dist')
 if relative.parts[0] in ['film','font-options'] or relative.name=='font-samples.html':continue
 dest=target/'soma-private/site'/relative;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(file,dest);site_files.append(relative.as_posix())
(target/'UPDATE-NOTES.txt').write_text('''SOMA - Login fits the available screen height

Replace both the public_html/soma files and the complete soma-private folder.
Follow READ-ME-FIRST.txt. Keep soma-private NEXT TO public_html.

- The login adapts its logo size, heading size and spacing to available height.
  Short windows use a more compact layout, and landscape screens place the
  form beside the invitation. The original stacked logo proportions remain.
- All login content fits normal small phone, tablet and desktop viewports
  without a vertical scrollbar. Content is not hidden or clipped; keyboard
  and enlarged-text access remain available when extra room is needed.
- Password text remains 16px, and input/button touch heights stay at least
  44px. Login copy, original artwork, themes and animations are preserved.

- All former typewriter labels now use selected option C, IBM Plex Sans:
  section captions/numbers, the hero category, timestamps, product labels,
  technical illustration text and metadata. The footer uses the same font.
- On phones, the tagline and Back to top share the first footer row, followed
  by the centered SOMA logo, then the centered company copyright. The tagline
  wraps naturally where needed to keep both items readable on narrow phones.
- Only the active language is bold and blue. The inactive language and the
  separator are regular weight and black in light mode, with readable neutral
  light text in dark mode. Language/theme control positions stay fixed.

- The login logo now stacks its animated rings above the original SOMA
  wordmark. Ring width, wordmark width and the space between them follow
  the proportions of logo_soma_light.png and logo_soma_dark.png exactly.
  Both themes retain the original artwork and opposite ring rotation.

- The browser tab icon now shows only the original SOMA rings, without the
  wordmark. The two rings rotate in opposite directions, with the same
  24-second / 30-second periods as the page logo. Both supplied logo variants
  contain identical ring pixels; these original pixels are preserved.
- The login embeds its animation. Only the two brand-only PNG icons are
  available before authentication so browser icon fetchers can use them;
  the website, video, scripts, fonts and model remain password protected.
- Favicon animation uses eight small local PNG updates per second, with no
  per-frame downloads. It pauses when hidden and stops for reduced motion.
  Browsers that keep tab icons static retain the original rings-only icon.
  Static PNG and Apple touch icons are also included.

- Lighting data is now losslessly packed into a 2,293,464-byte WebP instead of
  the 6,312,947-byte HDR. The original 2048 x 1024 HDR values are preserved.
  This file stores lighting data, rather than an ordinary photograph.
- Lighting decoding and identical procedural metal textures are prepared in
  a worker while the page remains responsive. A compatible main-thread
  fallback is available if workers or OffscreenCanvas are unavailable.
- The lighting and engine begin downloading in parallel, and initialization
  starts when the hero is visible, without the previous idle timeout.
- Eight rendered poses match the previous model pixel for pixel. Geometry,
  camera framing, 60 FPS target and one-turn-per-24-seconds speed are unchanged.
- The header demo button is removed. The controls now read JP・EN followed by
  the light/dark switch. Hero and lower-page demo booking remain available.
- The English page title uses a plain hyphen: SOMA Co., Ltd. - A clear plan
  for complex work.
- Login uses the same Manrope type, palette, animated theme change, and
  saved light/dark preference as the website. Both original logo variants
  are embedded so the correct wordmark is visible before authentication.
- The original logo is centered above the invitation. Its two rings keep
  rotating in opposite directions. Reduced-motion preferences stop rotation.
- Blue and teal light glows from both background edges. The heading,
  introduction, password label, submit text and private-access note are centered.
- The top preview information, SOMA / SCHEDULER label and login footer tagline
  are removed. Only the centered company copyright remains in the login footer.
- The website footer, bilingual content, launch video, password protection,
  private-preview note, and fixed FAQ scrolling are preserved.

The configured password is unchanged. No external account or API key is needed.
Do not upload old HDR lighting files from previous packages; they are replaced.
''',encoding='utf-8')
with (target/'ASSET-NOTICES.md').open('a',encoding='utf-8') as f:
 f.write('''\n\n## Lossless lighting delivery - 17 October 2026\n\nThe existing Studio Small 09 environment (Poly Haven, CC0) is now stored as opaque RGBE panels in a lossless WebP. The original 2048 x 1024 mantissas/exponents and HDR radiance are retained. Decode math uses the installed Three.js HDRLoader convention. The three.js MIT notice remains included. The original HDR is kept in project design-assets, outside deployment. The procedural metal textures are unchanged and now generated in a dedicated worker. No additional third-party runtime library was incorporated.\n''')
proof=['# Delivery verification','',
 'This is a PHP/Apache package for upload to the existing /soma/ folder. The private folder stays outside public_html. Password hashing, CSRF, expiry, rate limiting and authenticated asset delivery are retained.','',
 'Better Design MCP and Superdesign hosted services were not connected. No hosted design review is claimed. Local Design Taste typography, color, layout, accessibility and review guidance was used.','',
 '## Current verification evidence','']
fit_report=root/'artifacts/login-fit/results.json'
if fit_report.exists():
 proof.extend(['### Login viewport fit','',fit_report.read_text(encoding='utf-8'),''])
labels_report=root/'artifacts/plex-labels-footer/results.json'
if labels_report.exists():
 proof.extend(['### Global label font, phone footer and language states','',labels_report.read_text(encoding='utf-8'),''])
stacked_report=root/'artifacts/stacked-login-logo/results.json'
if stacked_report.exists():
 proof.extend(['### Original stacked login logo','',stacked_report.read_text(encoding='utf-8'),''])
for name in ['results','startup-after','lighting-diff']:
 file=root/f'artifacts/fast-start-login/{name}.json'
 if file.exists():proof.extend(['### '+name,'','```json',file.read_text(encoding='utf-8'),'```',''])
favicon_report=root/'artifacts/animated-favicon/results.json'
if favicon_report.exists():
 proof.extend(['### Animated favicon','',favicon_report.read_text(encoding='utf-8'),''])
proof.extend(['### Matched first-frame posters','',
 'The six phone/tablet/desktop and light/dark framing checks pass: stable bounds, phase-zero handover, the same 19,562 triangles and six draw calls, and no tagged Axe violations. The posters were regenerated from the current source.',''])
for file in ['artifacts/header-update/results.json','artifacts/site-motion-update/host-results.json','artifacts/ring-60fps/results.json']:
 p=root/file
 if p.exists():
  report=json.loads(p.read_text(encoding='utf-8'))
  proof.extend(['### '+file,'',json.dumps({k:v for k,v in report.items() if k in ['checks','errors','failed','views','cadence']},ensure_ascii=False,indent=2),''])
proof.extend(['## Scope','', 'Browser checks use local headless Chrome and the actual PHP package. No physical-phone, Safari, remote-host or field p75 measurement is claimed. Startup comparisons use a cache-disabled local browser; network conditions are recorded with the measurements. The eight lighting comparison poses have zero foreground and silhouette difference.',''])
(target/'VERIFICATION.md').write_text('\n'.join(proof),encoding='utf-8')
include=lambda p:p.is_file() and not (p.parent.name=='runtime' and p.name!='.gitkeep')
files=sorted(p for p in target.rglob('*') if include(p) and p.name!='CHECKSUMS.sha256')
(target/'CHECKSUMS.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(target).as_posix()+'\n' for p in files),encoding='utf-8')
archive=target.with_suffix('.zip')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
 for file in sorted(p for p in target.rglob('*') if include(p)):
  data=file.read_bytes();assert preview_password not in data,file;z.writestr(file.relative_to(target).as_posix(),data)
with zipfile.ZipFile(archive) as z:
 assert z.testzip() is None
 assert all(hashlib.sha256(z.read(p.relative_to(target).as_posix())).hexdigest()==hashlib.sha256(p.read_bytes()).hexdigest() for p in files)
print(json.dumps({'zip':str(archive),'bytes':archive.stat().st_size,'files':len(files)+1,'site_files':len(site_files),'checksums_verified':True,'plaintext_password_absent':True}))
