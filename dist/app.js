'use strict';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const original = new Map($$('[data-i18n]').map(el => [el.dataset.i18n, el.innerHTML]));
const ja = {
  "heroCategory": "SOMA SCHEDULER / 生産計画",
  "heroTitlePhone": "複雑な仕事に、<br><span class=\"hero-title-accent\">明確な計画を。</span>",
  "heroTitleWide": "精密な仕事に、<br><span class=\"hero-title-accent\">確かな計画を。</span>",
  "heroCopyPhone": "精密加工のための生産計画。仕事の見通しと、その背景にある現場の知識をひとつに。",
  "heroCopyWide": "設備、稼働時間、そして現場の人に合った生産計画へ。仕事を支える知識も、計画の中に。",
  "heroNoteLabel": "現場の知識を資産に",
  "heroNotePhone": "知識は、そのままに。",
  "heroNoteWide": "現場の経験を、計画の力に。",
  "filmKeyboardHelp": "スペースキーで再生・一時停止、矢印キーで再生位置を移動できます。",
  "companyName": "株式会社SOMA",
  "navProduct": "Scheduler",
  "navApproach": "考え方",
  "navFilm": "紹介動画",
  "navDetails": "よくある質問",
  "navAbout": "会社紹介",
  "book": "デモを予約 <span>↗</span>",
  "heroEyebrow": "精密加工のための、生産計画。",
  "heroTitle": "複雑な仕事に、<br><span>明確な計画を。</span>",
  "heroCopy": "仕事を見渡し、変化に備え、知識をつなぐ。現場の進め方に合わせた生産スケジューリング。",
  "explore": "Schedulerを見る <span>↓</span>",
  "heroBottom": "株式会社SOMA / 計画に、明確な道筋を。",
  "watchShort": "紹介動画を見る",
  "productLabel": "02 / 仕事の流れをつくる。",
  "productTitle": "見通しが変わる。<br>次の一手が変わる。",
  "stageNote": "設備、受注、納期をひとつに。機械加工の現場の進め方に合わせた、見渡せる生産計画ボードです。",
  "approachLabel": "その先の余力を、見通す。",
  "approachTitle": "今週の、その先も。<br><span>見通せる計画へ。</span>",
  "approachCopy": "今の仕事を置くだけではなく、次の受注を考えるために。設備の余力、納期、過去の計画をひとつの視点で。",
  "principle1": "納期と設備の余力を、見通す。",
  "principle1Copy": "予定完了と納期を照らし合わせ、遅れる受注を把握。先の空きや負荷を確認して、見積もりや仕事の受け方を考えられます。",
  "principle2": "過去の計画も、すぐ手元に。",
  "principle2Copy": "過去の日付に戻り、どの設備に、どの受注の工程を計画していたかを確認。紙を探す代わりに、計画の履歴をたどれます。",
  "principle3": "現場のデータを、自分たちの手に。",
  "principle3Copy": "Schedulerはオフラインでの計画に対応。エクスポート、バックアップ、週次計画の印刷で、情報を使いやすい形に。",
  "samplePart": "部品イメージ / ディフューザーリング",
  "knowledgeLabel": "技術者の知識を、繰り返し使える資産に。",
  "knowledgeTitle": "次の受注は、<br><span>一歩先から。</span>",
  "knowledgeCopy": "技術者が決めた加工の道筋を、部品ライブラリに蓄える。受注ごとに独立した工程データを持たせ、計画へつなげます。",
  "knowledgeNote": "ひな形の改善は、これからの仕事へ。既存の受注は、そのままに。",
  "discuss": "現場の仕事について話す <span>↗</span>",
  "filmLabel": "仕事の流れを、動画で。",
  "filmTitle": "次の一手を、<br><span>もっと明確に。</span>",
  "filmCopy": "32秒。ひとつの受注から、新しい計画のかたちへ。",
  "playFilm": "紹介動画を再生",
  "filmFootnote": "受注から次の一手へ、ひと続きのストーリー。",
  "detailsLabel": "現場で使うために。",
  "detailsTitle": "現場のルールを、<br><span>計画の中に。</span>",
  "faq1": "設備ごとの稼働時間に対応していますか？",
  "faq1Copy": "設備ごとのシフト、計画保全、日本の祝日、工場休業日を踏まえて計画できます。実際に仕事ができる時間に合わせたスケジュールを組みます。",
  "faq2": "今の仕事の進め方に合わせられますか？",
  "faq2Copy": "手動で計画することも、残りの工程を自動提案に任せることも、その両方を組み合わせることもできます。バッチ処理、一個流し、検査、外注工程に対応します。",
  "faq3": "日本語で使えますか？",
  "faq3Copy": "はい。日本語と英語に対応しています。段取りや検査など、現場で使う言葉を採用。部品名や受注名を変えることなく、表示言語を切り替えられます。",
  "faq4": "設備やERPと連携しますか？",
  "faq4Copy": "第1フェーズのSchedulerは、計画担当者が更新する計画ボードです。カメラやセンサーによるライブ連携は、別サービスのSoma Data Feedについてご相談ください。複数人での共同作業やERP連携は将来の拡張です。",
  "faq5": "デモでは何を話しますか？",
  "faq5Copy": "お使いの設備、シフト、いくつかの部品工程を伺い、実際の一週間をどう計画するかを一緒に考えます。ご希望の日時は、メールで確認します。",
  "ctaEyebrow": "あなたの現場について、聞かせてください。",
  "ctaTitle": "あなたの現場に、<br><span>明確な計画を。</span>",
  "ctaCopy": "お使いの設備、部品、実際の一週間の仕事をもとに。株式会社SOMAと、計画の次のかたちを一緒に考えます。",
  "footerTag": "仕事に寄り添う、ソフトウェアを。",
  "backTop": "ページの先頭へ ↑",
  "demoRequest": "デモのお問い合わせ",
  "bookingTitle": "よりよい計画を、<br><span class=\"serif\">対話から。</span>",
  "bookingCopy": "30分程度のお打ち合わせを想定しています。ご希望の日時をお選びください。空き状況を確認のうえ、メールでご連絡します。",
  "name": "お名前",
  "email": "メールアドレス",
  "company": "会社名",
  "date": "ご希望日",
  "time": "開始時刻（日本時間 / UTC+9）",
  "message": "改善したいこと（任意）",
  "prepareEmail": "お問い合わせメールを作成 <span>↗</span>",
  "emailNote": "メールアプリが開きます。自動送信・予約確定は行われません。",
  "emailFallback": "メールアプリが開かない場合は、下の内容をコピーして paolino.luis@gmail.com へお送りください。",
  "copyRequest": "内容をコピー ↗",
  "heroProof": "精密加工の現実に、寄り添う。",
  "heroOperation": "繰り返し使える工程",
  "heroPart": "現場の知識は、そのままに。",
  "heroMachine": "次の受注を、一歩先から。",
  "illustrativeComponent": "部品のイメージ",
  "strip1": "設備ごとの稼働時間に対応。",
  "strip2": "工程の知識を、繰り返し使える資産に。",
  "strip3": "日本語 / English",
  "overviewLabel": "受注から納品まで、見通せる計画に。",
  "overviewStatement": "計画は、変わる。<br><span>見通しは、ぶれない。</span>",
  "overviewCopy": "ホワイトボード、表計算、散らばる紙の情報をひとつの計画へ。全体を見渡し、納得して変更できます。",
  "cap1Title": "仕事を、現場の条件とともに。",
  "cap1Copy": "設備ごとのタイムラインに、稼働時間、祝日、計画保全を表示。受注に影響する条件も、同じ計画の中に。",
  "cap2Title": "確かめながら、計画する。",
  "cap2Copy": "手動で配置することも、自動計画の提案を確認することも。対応設備と工程順を踏まえて、仕事を組み立てます。",
  "cap3Title": "計画は変えても、主導権は手元に。",
  "cap3Copy": "後工程への影響を見てから変更を適用。動かされる仕事を確認し、固定した工程を守る。必要なら元に戻せます。",
  "videoProgress": "動画の再生位置"
};
Object.assign(ja, window.somaPageJapanese || {});
const pageTitles = {en: document.title, ja: document.body.dataset.titleJa || '株式会社SOMA - 複雑な工程に、明確な道筋を。'};
let locale = 'en';
try { locale = localStorage.getItem('soma-language') === 'ja' ? 'ja' : 'en'; } catch {}
function t(key) { return somaIconText(locale==='ja' ? (ja[key] || original.get(key) || key) : (original.get(key) || key)); }
function setLanguage(lang) {
  locale=lang;document.documentElement.lang=lang;
  $$('[data-i18n]').forEach(el=>{const value=t(el.dataset.i18n);if(value)el.innerHTML=value;});
  $$('.language-option').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.language===lang)));
  $('#language').setAttribute('aria-label',lang==='ja'?'表示言語':'Language');
  document.title=pageTitles[lang];
  try{localStorage.setItem('soma-language',lang);}catch{}
  window.dispatchEvent(new CustomEvent('soma:language',{detail:lang}));
}
$$('.language-option').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.language!==locale)setLanguage(button.dataset.language);}));
document.body.classList.add('language-ready');
$$('[data-close]').forEach(el=>el.addEventListener('click',()=>$('#'+el.dataset.close).close()));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',ev=>{const b=dialog.getBoundingClientRect();if(ev.target===dialog&&(ev.clientX<b.left||ev.clientX>b.right||ev.clientY<b.top||ev.clientY>b.bottom))dialog.close();}));
$('#open-booking').addEventListener('click',()=>$('#booking-dialog').showModal());$$('.open-booking').forEach(el=>el.addEventListener('click',()=>$('#booking-dialog').showModal()));
const japanDate = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const dateInput=$('#booking-date');
const nextDay=new Date(japanDate()+'T00:00:00Z');do{nextDay.setUTCDate(nextDay.getUTCDate()+1);}while([0,6].includes(nextDay.getUTCDay()));dateInput.value=nextDay.toISOString().slice(0,10);
dateInput.min=dateInput.value;
function validateDate(){const day=new Date(dateInput.value+'T00:00:00Z').getUTCDay();dateInput.setCustomValidity([0,6].includes(day)?(locale==='ja'?'平日をお選びください。':'Please choose a weekday.'):'');}
dateInput.addEventListener('input',validateDate);
$('#booking-form').addEventListener('submit',ev=>{
  ev.preventDefault();validateDate();if(!ev.target.reportValidity())return;
  const d=new FormData(ev.target);
  const subject=`SOMA Scheduler demo - ${d.get('company')}`;
  const body=locale==='ja'?`株式会社SOMA ご担当者様\n\nSOMA Schedulerのデモを希望します。\n\nお名前: ${d.get('name')}\n会社名: ${d.get('company')}\nメール: ${d.get('email')}\n希望日時: ${d.get('date')} ${d.get('time')} 日本時間（UTC+9）\n所要時間: 30分\n\n相談したいこと:\n${d.get('message') || 'デモでお話しできれば幸いです。'}\n\n日時のご確認をお願いいたします。`:`Hello SOMA Co., Ltd. team,\n\nI'd like to explore SOMA Scheduler in a demo.\n\nName: ${d.get('name')}\nCompany: ${d.get('company')}\nEmail: ${d.get('email')}\nPreferred time: ${d.get('date')} at ${d.get('time')} Japan time (UTC+9)\nDuration: 30 minutes\n\nWhat we'd like to improve:\n${d.get('message') || "Let's discuss our workflow during the demo."}\n\nPlease confirm whether this time works. Thank you.`;
  $('#email-fallback').hidden=false;$('#request-text').value=`To: paolino.luis@gmail.com\nSubject: ${subject}\n\n${body}`;
  window.location.href=`mailto:paolino.luis@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
$('#copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#request-text').value);$('#copy-status').textContent=locale==='ja'?'コピーしました':'Copied';}catch{$('#request-text').select();$('#copy-status').textContent=locale==='ja'?'選択した内容をコピーしてください':'Select and copy the text';}});
setLanguage(locale);
if(new URLSearchParams(location.search).get('demo')==='1')$('#booking-dialog').showModal();
