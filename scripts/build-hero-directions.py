"""Rebuild standalone hero directions from the current site without changing its homepage."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
source=(root/'dist/index.html').read_text(encoding='utf-8')
button=re.search(r'<button class="button accent open-booking".*?</button>',source).group(0)
image=(re.search(r'<picture class="hero-ring-picture".*?</picture>',source) or re.search(r'<img class="hero-part".*?>',source)).group(0)
def eyebrow():return '<div class="eyebrow"><span class="status-dot"></span><span data-concept-key="category">SOMA SCHEDULER / PRODUCTION PLANNING</span></div>'
def title(content):return '<h1 id="hero-title" data-concept-key="title">'+content+'</h1>'
def description(content):return '<p class="hero-description" data-concept-key="copy">'+content+'</p>'
def cta():return '<div class="hero-ctas">'+button+'</div>'
main={
'editorial':eyebrow()+title('Complex<br>work.<br><span>A clear plan.</span>')+description('Production planning for precision manufacturing. Built on your team’s knowledge.')+cta(),
'spotlight':eyebrow()+title('Precision work.<br><span>Clearly planned.</span>')+description('Plan production around your machines, your hours, and your team. Keep the knowledge that makes it work.')+cta(),
'flow':eyebrow()+title('Every part.<br><span>A clear path.</span>')+description('Capture the route once. Plan the next order with the knowledge already in place.')+cta()
}
visual={
'editorial':image,
'spotlight':'<div class="spotlight-orbit" aria-hidden="true"></div>'+image,
'flow':'<div class="flow-part"><span class="mono" data-concept-key="part">DIFFUSER RING</span>'+image+'<span class="flow-part-note" data-concept-key="partNote">From your part library</span></div><ol class="flow-route" aria-label="Illustrative routing"><li><span class="flow-number mono" aria-hidden="true">01</span><div><strong data-concept-key="turning">Turning</strong><span data-concept-key="shape">Shape the part</span></div></li><li><span class="flow-number mono" aria-hidden="true">02</span><div><strong data-concept-key="milling">Milling</strong><span data-concept-key="detail">Machine the detail</span></div></li><li><span class="flow-number mono" aria-hidden="true">03</span><div><strong data-concept-key="inspection">Inspection</strong><span data-concept-key="quality">Plan the quality gate</span></div></li></ol><div class="flow-footnote mono" data-concept-key="routeNote">ILLUSTRATIVE ROUTE / REUSABLE KNOWLEDGE</div>'
}
for direction in main:
 hero='<section class="hero direction-hero" aria-labelledby="hero-title"><div class="wrap"><div class="hero-grid"><div class="hero-main">'+main[direction]+'</div><div class="hero-visual">'+visual[direction]+'</div></div></div></section>'
 html,n=re.subn(r'<section class="hero(?: [^\"]*)?".*?</section>',hero,source,count=1,flags=re.S);assert n==1
 html=html.replace('<body>','<body data-hero-direction="'+direction+'">')
 html=html.replace('<script src="motion.js','<script src="hero-concepts.js?v=1" defer></script><script src="motion.js')
 html=html.replace('</head>','<link rel="stylesheet" href="hero-directions.css?v=1"></head>')
 (root/'dist'/('hero-'+direction+'.html')).write_text(html,encoding='utf-8')
print('Built editorial, spotlight and flow hero pages.')
