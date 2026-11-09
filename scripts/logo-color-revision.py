from pathlib import Path
import re, shutil
base=Path(__file__).resolve().parents[1];dist=base/'dist'
if 'class="brand-rings"' in (dist/'index.html').read_text(encoding='utf-8'):
    raise SystemExit('One-time migration already applied; edit the source files directly.')
before=base/'artifacts/rings-before';before.mkdir(parents=True,exist_ok=True)
for name in ['soma-launch.mp4','soma-launch-portrait.mp4']:shutil.copy2(dist/'assets'/name,before/name)
def logo(prefix,href):
    # Radius 52 splits the measured transparent gap between the original rings.
    return f'''<svg class="brand-rings" viewBox="0 0 128 125" width="42" height="42" aria-hidden="true" focusable="false"><defs><clipPath id="{prefix}-inner"><circle cx="64" cy="62.5" r="52"/></clipPath><clipPath id="{prefix}-outer"><path clip-rule="evenodd" d="M-8-8H136V133H-8Z M116 62.5a52 52 0 1 0-104 0a52 52 0 1 0 104 0Z"/></clipPath></defs><g class="logo-ring ring-outer"><image href="{href}" width="128" height="125" clip-path="url(#{prefix}-outer)"/></g><g class="logo-ring ring-inner"><image href="{href}" width="128" height="125" clip-path="url(#{prefix}-inner)"/></g></svg>'''
html=(dist/'index.html').read_text(encoding='utf-8')
html=html.replace('<meta name="theme-color" content="#101719">','<meta name="theme-color" content="#ffffff">')
for key in ['header','footer']:
    html=re.sub(r'<img\b[^>]*src="assets/soma-mark.webp"[^>]*>\s*<span>SOMA</span>',lambda m:logo(key+'-logo','assets/soma-mark.webp')+'<span class="brand-name">SOMA</span>',html,count=1)
html=html.replace('<link rel="stylesheet" href="styles.css">',"<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion-intro');window.somaIntroFallback=setTimeout(()=>document.documentElement.classList.remove('motion-intro'),1800);}</script><link rel=\"stylesheet\" href=\"styles.css\">")
for old,new in {'#b5bfb8':'#b8cdd9','#e4e9e0':'#e9f5fa','#f2f4eb':'#f4fafc','#c0cec2':'#bed9e6','#416459':'#315e78','#568374':'#43809f'}.items():html=html.replace(old,new)
(dist/'index.html').write_text(html,encoding='utf-8')
css=(dist/'styles.css').read_text(encoding='utf-8')
palette={'#f4f5f0':'#ffffff','#121b1b':'#07344d','#111d18':'#052e46','#087467':'#086b9c','#b9f0ce':'#61dedb','#52645e':'#536976','#d1d9d0':'#d5e4ed','#e4ebe1':'#eff7fb','#e5ebe1':'#eff7fb','#b7c7ba':'#c2d7e3','#a9beae':'#9fc6d9','#3d5144':'#315a70','#64766b':'#5d8297','#244534':'#114e6a','#aab8ab':'#91b3c6','#b7c4b5':'#91b3c6','#193022':'#07344d','#fdfef8':'#ffffff','#233e2a12':'#0b638312'}
for old,new in sorted(palette.items(),key=lambda p:-len(p[0])):css=css.replace(old,new)
css+='''
/* SOMA ring palette: white, deep blue, sky blue and cyan. */
:root{--brand-navy:#003c5b;--brand-blue:#0b79a9;--brand-cyan:#00b9c1;--brand-ice:#61dedb;--color-surface:#fff;--color-text:#07344d;--color-muted:#536976;--color-border:#d5e4ed;--color-accent:var(--brand-ice);--color-on-accent:var(--brand-navy);--color-dark:#052e46;--color-dark-raised:#0b3c55;--color-dark-muted:#c2d7e3;--color-dark-border:#315a70;--color-teal-text:#086b9c}
.brand-rings{display:block;flex:none;width:42px;height:42px;overflow:visible}.brand-name{display:inline-block}.logo-ring{transform-origin:64px 62.5px}footer .brand-rings{width:35px;height:35px}.brand{color:var(--brand-navy)}.hero h1>span{color:var(--brand-blue)}.hero .status-dot{background:var(--brand-cyan)}.hero-visual,.knowledge-visual{background:#eff7fb}.floating-operation{background:#fff}.button.accent{background:var(--brand-navy);color:#fff}.operation-check{color:var(--brand-blue)}.site-header :focus-visible,.hero :focus-visible{outline-color:var(--brand-blue)}.film-section,.cta-section{background:var(--color-dark)}.film-section :focus-visible,.cta-section :focus-visible{outline-color:var(--brand-ice)}.film-stage,#launch-video{background:#fff}.film-control[aria-pressed=true]{color:var(--brand-ice);background:#114e6a}.film-start{background:#052e46f2}.film-controls{background:var(--color-dark)}
html.motion-intro .site-header .logo-ring,html.motion-intro .site-header .brand-name,html.motion-intro .hero .eyebrow,html.motion-intro .hero h1,html.motion-intro .hero-description,html.motion-intro .hero-ctas,html.motion-intro .hero-proof,html.motion-intro .hero-visual{opacity:0}
@media(prefers-reduced-motion:reduce){html.motion-intro .site-header .logo-ring,html.motion-intro .site-header .brand-name,html.motion-intro .hero .eyebrow,html.motion-intro .hero h1,html.motion-intro .hero-description,html.motion-intro .hero-ctas,html.motion-intro .hero-proof,html.motion-intro .hero-visual{opacity:1}}
'''
(dist/'styles.css').write_text(css,encoding='utf-8')
filmcss=(dist/'film/film.css').read_text(encoding='utf-8')
filmPalette={'#f4f5f0':'#ffffff','#121b1b':'#07344d','#0f2b2410':'#07344d0d','#52645e':'#536976','#087e75':'#0b79a9','#cfdbd4':'#d5e4ed','#10241d0a':'#07344d0a','#087467':'#086b9c','#ebf5ef':'#eaf7fc','#a8c9bb':'#aad1e3','#e0f1e7':'#e5f4fb','#74ab97':'#77b9d3','#d3ded7':'#d5e4ed','#6cb294':'#6eb5cf','#d8eee0':'#e0f2fb','#164c37':'#064c6b','#138e7460':'#179bc660','#f0f1ed':'#f1f5f8','#b7c2ba':'#afc5d2','#f4fff7':'#f4fcff','#89d3b5':'#79cde2','#b5f2c9':'#77e0e5','#e1f4e6':'#def4fd','#8dd9b5':'#8ed8ea','#10241d':'#07344d','#63736b':'#536976','#111d18':'#052e46','#b9f0ce':'#61dedb'}
for old,new in sorted(filmPalette.items(),key=lambda p:-len(p[0])):filmcss=filmcss.replace(old,new)
filmcss+='\n#brand .brand-rings{width:48px;height:48px;overflow:visible}body.portrait #brand .brand-rings{width:52px;height:52px}\n'
(dist/'film/film.css').write_text(filmcss,encoding='utf-8')
filmhtml=(dist/'film/index.html').read_text(encoding='utf-8').replace('<img src="../assets/soma-mark.webp" alt=""><span>SOMA</span>',logo('film-logo','../assets/soma-mark.webp')+'<span class="brand-name">SOMA</span>',1)
(dist/'film/index.html').write_text(filmhtml,encoding='utf-8')
filmjs=(dist/'film/film.js').read_text(encoding='utf-8').replace('[11,93,72]','[0,60,91]').replace('[185,240,206]','[97,222,219]').replace('[8,116,103]','[8,107,156]').replace('[8,126,117]','[11,121,169]').replace("'#0b5d48'","'#003c5b'").replace("'#cfdbd4'","'#d5e4ed'").replace('#138e7460','#179bc660')
filmjs=filmjs.replace('const dark=spring', '''const easeOut=v=>1-Math.pow(1-clamp(v),3),outer=easeOut(t/.88),inner=easeOut((t-.05)/.9),word=easeOut((t-.96)/.32);
 $('#brand .ring-outer').setAttribute('transform',`translate(64 62.5) rotate(${-210*(1-outer)}) scale(${outer}) translate(-64 -62.5)`);
 $('#brand .ring-inner').setAttribute('transform',`translate(64 62.5) rotate(${230*(1-inner)}) scale(${inner}) translate(-64 -62.5)`);
 $('#brand .brand-name').style.opacity=word;$('#brand i').style.opacity=word;
 const dark=spring''',1)
(dist/'film/film.js').write_text(filmjs,encoding='utf-8')
print('Ring palette and original logo layers applied.')
