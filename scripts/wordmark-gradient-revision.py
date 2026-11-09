"""One-time, pixel-preserving SVG crops from the owner's two approved PNGs."""
from pathlib import Path
import hashlib,json,re,shutil
base=Path(__file__).resolve().parents[1];dist=base/'dist'
if 'viewBox="104 1022 1193 147"' in (dist/'index.html').read_text(encoding='utf8'):
    raise SystemExit('Already applied. Edit the current source files directly.')
sources={}
for kind in ['light','dark']:
    name=f'logo_soma_{kind}.png';source=base.parent/name
    shutil.copy2(source,dist/'assets'/name)
    sources[kind]={'source':name,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'wordmark_viewbox':[104,1022,1193,147],'rings_viewbox':[330,228,742,730],'ring_center':[700,593],'split_radius':320}
(base/'design-assets/logo-crops.json').write_text(json.dumps(sources,indent=2),encoding='utf8')

def rings(prefix,href):
    return f'''<svg class="brand-rings" viewBox="330 228 742 730" width="42" height="42" aria-hidden="true" focusable="false"><defs><clipPath id="{prefix}-inner"><circle cx="700" cy="593" r="320"/></clipPath><clipPath id="{prefix}-outer"><path clip-rule="evenodd" d="M320 220H1080V966H320Z M1020 593a320 320 0 1 0-640 0a320 320 0 1 0 640 0Z"/></clipPath></defs><g class="logo-ring ring-outer"><image href="{href}" width="1400" height="1400" clip-path="url(#{prefix}-outer)"/></g><g class="logo-ring ring-inner"><image href="{href}" width="1400" height="1400" clip-path="url(#{prefix}-inner)"/></g></svg>'''
def word(href):
    return f'''<svg class="brand-name" viewBox="104 1022 1193 147" width="160" height="20" aria-hidden="true" focusable="false"><image href="{href}" width="1400" height="1400"/></svg>'''

p=dist/'index.html';html=p.read_text(encoding='utf8')
for key in ['header','footer']:
    html=re.sub(r'<svg class="brand-rings".*?</svg>',lambda m:rings(key+'-logo','assets/logo_soma_light.png'),html,count=1) if key=='header' else html
    if key=='footer':
        start=html.index('<footer class="wrap">');html=html[:start]+re.sub(r'<svg class="brand-rings".*?</svg>',lambda m:rings('footer-logo','assets/logo_soma_light.png'),html[start:],count=1)
html=html.replace('<span class="brand-name">SOMA</span>',word('assets/logo_soma_light.png'))
html=html.replace('v=logo-rings','v=original-wordmark-gradient')
p.write_text(html,encoding='utf8')
p=dist/'motion.js';p.write_text(p.read_text(encoding='utf8').replace("svgOrigin:'64 62.5'","svgOrigin:'700 593'"),encoding='utf8')
p=dist/'player.js';p.write_text(p.read_text(encoding='utf8').replace('v=logo-rings','v=original-wordmark-gradient'),encoding='utf8')
p=dist/'styles.css';css=p.read_text(encoding='utf8')
css+='''
/* The owner's complete ring spectrum, with accessible text/action variants. */
:root{--brand-spectrum:linear-gradient(110deg,#003c5b 0%,#169fda 35%,#00b9bd 68%,#72e2d8 100%);--brand-text-spectrum:linear-gradient(110deg,#003c5b 0%,#0c729f 35%,#007e87 68%,#18887c 100%);--brand-action-spectrum:linear-gradient(110deg,#8cc9ee 0%,#4bc8df 35%,#22c6c8 68%,#72e2d8 100%);--brand-pale-spectrum:linear-gradient(110deg,#edf4fa 0%,#e2f5fb 35%,#dcf5f2 70%,#ecfaf5 100%);--brand-dark-spectrum:linear-gradient(115deg,#052e46 0%,#06475c 55%,#075c61 100%);--brand-light-text-spectrum:linear-gradient(110deg,#b7ddf4 0%,#6cdbed 40%,#73e4d5 75%,#c0f4e7 100%)}
.logo-ring{transform-origin:700px 593px}.brand-name{display:block;flex:none;width:160px;height:auto;overflow:hidden}footer .brand-name{width:120px}.hero h1>span{color:#086b82;background:var(--brand-text-spectrum);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}.button.accent,.button.dark,.cta-section .button.dark{background:var(--brand-action-spectrum);color:var(--brand-navy)}.hero-visual,.knowledge-visual{background:var(--brand-pale-spectrum)}.hero-visual:after{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--brand-spectrum);pointer-events:none}.film-section,.cta-section{background:var(--brand-dark-spectrum)}.cta-grid h2>span{color:#9ce5df;background:var(--brand-light-text-spectrum);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}.section-label{border-image:var(--brand-spectrum) 1}.film-player{border-color:#4c8d9d}.film-controls{background:#052e46}.film-start{background:#052e46f2}.film-section .section-label{border-image:var(--brand-light-text-spectrum) 1}.knowledge-visual{border-top:3px solid;border-image:var(--brand-spectrum) 1}
@media(max-width:640px){.header-inner{gap:16px}.site-header .brand-name{width:clamp(110px,34vw,150px)}.brand{gap:10px}footer .brand-name{width:110px}}
''';p.write_text(css,encoding='utf8')

# Keep the film's branding faithful to the same approved files.
p=dist/'film/index.html';html=p.read_text(encoding='utf8')
html=re.sub(r'<svg class="brand-rings".*?</svg>',lambda m:rings('film-logo','../assets/logo_soma_light.png'),html,count=1)
html=html.replace('<span class="brand-name">SOMA</span>',word('../assets/logo_soma_light.png'))
html=html.replace('<div id="soma" class="panel"><span>SOMA</span>','<div id="soma" class="panel">'+word('../assets/logo_soma_dark.png'))
p.write_text(html,encoding='utf8')
p=dist/'film/film.js';s=p.read_text(encoding='utf8').replace('translate(64 62.5)','translate(700 593)').replace('translate(-64 -62.5)','translate(-700 -593)')
# All styles remain a pure function of seek(t); the gradient changes on the same surface.
s=s.replace("let current=scenes.find",'''const brandGradient=Math.max(0,Math.min(1,brand));
 s.style.backgroundImage=`linear-gradient(110deg,rgba(0,60,91,${brandGradient}),rgba(5,101,127,${brandGradient}) 45%,rgba(4,120,121,${brandGradient}))`;
 let current=scenes.find''')
p.write_text(s,encoding='utf8')
p=dist/'film/film.css';s=p.read_text(encoding='utf8')
s+='''
#brand .brand-name{width:175px;height:auto;overflow:hidden}body.portrait #brand .brand-name{width:190px}#soma>.brand-name{width:620px;height:auto;overflow:hidden}body.portrait #soma>.brand-name{width:620px}#soma i{color:#f4fcff}#headline em{background:linear-gradient(110deg,#003c5b,#0c729f 38%,#007e87 72%,#18887c);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent}#apply{background:linear-gradient(110deg,#003c5b,#08617d 50%,#087c7d)}#progress-line{background:linear-gradient(110deg,#003c5b,#169fda 35%,#00b9bd 68%,#72e2d8)}
''';p.write_text(s,encoding='utf8')
print('Original logo crops and full brand spectrum applied.')
