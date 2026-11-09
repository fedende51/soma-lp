"""Apply the owner's corporate naming and screenshot-sampled gradient."""
from pathlib import Path
import json,shutil
base=Path(__file__).resolve().parents[1];dist=base/'dist'
p=dist/'index.html';html=p.read_text(encoding='utf8')
if 'data-i18n="companyName"' in html:raise SystemExit('Already applied; edit current sources directly.')
shutil.copy2('C:/Users/paoli/AppData/Local/Temp/codex-clipboard-7a1e5ad0-5a31-4f65-8115-720457608479.png',base/'design-assets/brand-gradient-reference.png')
stops=[{'position':0,'color':'#0a3d57'},{'position':23.6,'color':'#0e618b'},{'position':50.2,'color':'#1ba5df'},{'position':84.2,'color':'#03c2b0'},{'position':100,'color':'#77e4d9'}]
(base/'design-assets/brand-gradient.json').write_text(json.dumps({'source':'Owner-supplied gradient screenshot, 17 October 2026','method':'Sampled colored stop-handle centers; positions inferred from screenshot. Original editor numeric values were not supplied.','direction':'left to right','stops':stops},indent=2),encoding='utf8')
html=html.replace('SOMA / A CLEARER WAY TO PLAN','SOMA CO., LTD. / A CLEARER WAY TO PLAN')
html=html.replace('Book a conversation with SOMA.','Book a conversation with SOMA Co., Ltd.')
html=html.replace('<span id="year">2026</span> SOMA</span>','<span id="year">2026</span> <span data-i18n="companyName">SOMA Co., Ltd.</span></span>')
html=html.replace('<span class="mono">SOMA / <span data-i18n="demoRequest">','<span class="mono"><span data-i18n="companyName">SOMA Co., Ltd.</span> / <span data-i18n="demoRequest">')
html=html.replace('SOMA — A clear plan for complex work.','SOMA Co., Ltd. — A clear plan for complex work.')
html=html.replace('v=original-wordmark-gradient','v=company-gradient')
p.write_text(html,encoding='utf8')
p=dist/'app.js';s=p.read_text(encoding='utf8')
s=s.replace('const ja = {','const ja = {\n  "companyName": "株式会社SOMA",')
s=s.replace('"navApproach": "SOMAの考え方"','"navApproach": "株式会社SOMAの考え方"')
s=s.replace('"heroBottom": "SOMA / 計画に、明確な道筋を。"','"heroBottom": "株式会社SOMA / 計画に、明確な道筋を。"')
s=s.replace('SOMAで、計画の次のかたちを一緒に考えます。','株式会社SOMAと、計画の次のかたちを一緒に考えます。')
s=s.replace("'SOMA — 複雑な工程に、明確な道筋を。':'SOMA — A clear plan for complex work.'","'株式会社SOMA — 複雑な工程に、明確な道筋を。':'SOMA Co., Ltd. — A clear plan for complex work.'")
s=s.replace('`SOMA ご担当者様','`株式会社SOMA ご担当者様').replace('`Hello SOMA,','`Hello SOMA Co., Ltd. team,')
p.write_text(s,encoding='utf8')
p=dist/'index.html';p.write_text(p.read_text(encoding='utf8').replace('src="app.js"','src="app.js?v=company-gradient"'),encoding='utf8')
p=dist/'styles.css';s=p.read_text(encoding='utf8');s+='''
/* Owner-supplied five-stop gradient reference, sampled 17 October 2026. */
:root{--brand-stop-1:#0a3d57;--brand-stop-2:#0e618b;--brand-stop-3:#1ba5df;--brand-stop-4:#03c2b0;--brand-stop-5:#77e4d9;--brand-navy:var(--brand-stop-1);--brand-ice:var(--brand-stop-5);--brand-spectrum:linear-gradient(90deg,var(--brand-stop-1) 0%,var(--brand-stop-2) 23.6%,var(--brand-stop-3) 50.2%,var(--brand-stop-4) 84.2%,var(--brand-stop-5) 100%);--brand-text-spectrum:linear-gradient(90deg,#0a3d57 0%,#0e618b 23.6%,#0b7ea9 50.2%,#007f75 84.2%,#19877c 100%);--brand-action-spectrum:linear-gradient(90deg,#86b5ce 0%,#6eb9dd 23.6%,#55c3ec 50.2%,#48d2c0 84.2%,#77e4d9 100%);--brand-pale-spectrum:linear-gradient(90deg,#edf4f8 0%,#e6f3f9 23.6%,#ddf3fc 50.2%,#ddf7f2 84.2%,#edfbf8 100%);--brand-dark-spectrum:linear-gradient(90deg,#0a3d57 0%,#0b4a64 23.6%,#09596d 50.2%,#075f5d 84.2%,#11625e 100%);--brand-light-text-spectrum:linear-gradient(90deg,#b8d5e4 0%,#92d2ee 23.6%,#74d4f8 50.2%,#5ee2cf 84.2%,#b6f0e7 100%)}
footer [data-i18n=companyName]{white-space:nowrap}
''';p.write_text(s,encoding='utf8')
print('Five-stop reference gradient and bilingual corporate names applied.')
