'use strict';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const original = new Map($$('[data-i18n]').map(el => [el.dataset.i18n, el.innerHTML]));
const ja = {
  "heroCategory": "SOMA SCHEDULER / 多品種少量の機械加工工場向け",
  "heroTitlePhone": "複雑な仕事に、<br><span class=\"hero-title-accent\">明確な計画を。</span>",
  "heroTitleWide": "精密な仕事に、<br><span class=\"hero-title-accent\">確かな計画を。</span>",
  "heroCopyPhone": "納期を約束する前に、間に合うかがわかる。すべての設備と受注を、ひとつのボードに。",
  "heroCopyWide": "納期を約束する前に、本当に間に合うかがわかる。工場のすべての設備をひとつのボードで計画し、変更の影響もすぐに確認できます。",
  "heroNoteLabel": "現場の知識を資産に",
  "heroNotePhone": "知識は、そのままに。",
  "heroNoteWide": "現場の経験を、計画の力に。",
  "filmKeyboardHelp": "スペースキーで再生・一時停止、矢印キーで再生位置を移動できます。",
  "companyName": "株式会社SOMA",
  "navProduct": "Scheduler",
  "navApproach": "日本の工場向け",
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
  "productLabel": "02 / できること",
  "productTitle": "設備、受注、納期を<br>ひとつのボードに。",
  "stageNote": "今はホワイトボードやExcelで計画している、多品種少量の機械加工工場のために。",
  "approachLabel": "日本の工場のために",
  "approachTitle": "日本の現場に、<br><span>そのまま合う。</span>",
  "approachCopy": "ERPの導入も、専任のIT担当も不要です。単体で使え、日本語と英語に対応し、工場の実際のカレンダーに沿って計画します。",
  "principle1": "工場のカレンダーを、そのまま。",
  "principle1Copy": "設備ごとのシフト、メンテナンス、日本の祝日、工場の休業日を最初から計画に反映します。",
  "principle2": "現場の言葉で使える。",
  "principle2Copy": "日本語と英語に対応。段取りや検査といった現場の用語を使い、部品名や受注名は入力したとおりに表示します。",
  "principle3": "オフラインで使え、印刷もできる。",
  "principle3Copy": "インターネットがなくても計画でき、データはいつでも書き出し・バックアップ可能。週間計画を印刷して現場に貼り出せます。",
  "samplePart": "部品イメージ / ディフューザーリング",
  "knowledgeLabel": "部品の工程を再利用",
  "knowledgeTitle": "一度登録した工程を、<br><span>何度でも。</span>",
  "knowledgeCopy": "部品の工程（加工内容、設備、時間）は、古いExcelやホワイトボードに残っていることがほとんどです。部品ライブラリに一度登録すれば、新しい受注ごとに作業用のコピーをつくれます。",
  "knowledgeNote": "登録した工程を改善しても、進行中の受注には影響しません。",
  "discuss": "現場の仕事について話す <span>↗</span>",
  "filmLabel": "実際の動きを見る",
  "filmTitle": "ひとつの受注が、<br><span>計画になるまで。</span>",
  "filmCopy": "最初の工程登録から設備ごとの計画まで、ひとつの受注の流れを紹介します。リピート注文なら数秒で計画できます。",
  "playFilm": "紹介動画を再生",
  "filmFootnote": "受注から次の一手へ、ひと続きのストーリー。",
  "detailsLabel": "よくある質問",
  "detailsTitle": "よくいただく<br><span>ご質問。</span>",
  "faq1": "設備ごとの稼働時間に対応していますか？",
  "faq1Copy": "設備ごとのシフト、計画保全、日本の祝日、工場休業日を踏まえて計画できます。実際に仕事ができる時間に合わせたスケジュールを組みます。",
  "faq2": "今の仕事の進め方に合わせられますか？",
  "faq2Copy": "手動で計画することも、残りの工程を自動提案に任せることも、その両方を組み合わせることもできます。バッチ処理、一個流し、検査、外注工程に対応します。",
  "faq3": "日本語で使えますか？",
  "faq3Copy": "はい。日本語と英語に対応しています。段取りや検査など、現場で使う言葉を採用。部品名や受注名を変えることなく、表示言語を切り替えられます。",
  "faq4": "設備やERPと連携しますか？",
  "faq4Copy": "現時点では連携していませんが、なくても始められます。Schedulerは単体で使え、計画担当者がボードを更新します。ERP連携や複数人での同時編集は今後対応予定です。",
  "faq5": "デモでは何を話しますか？",
  "faq5Copy": "お使いの設備、シフト、いくつかの部品工程を伺い、実際の一週間をどう計画するかを一緒に考えます。ご希望の日時は、メールで確認します。",
  "ctaEyebrow": "あなたの現場について、聞かせてください。",
  "ctaTitle": "一週間の計画を、<br><span>一緒に。</span>",
  "ctaCopy": "お使いの設備、いくつかの部品、実際の一週間分の受注をお持ちください。デモの中で、一緒にボードに並べてみます。",
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
  "emailFallback": "メールアプリが開かない場合は、下の内容をコピーして hello@somakk.com へお送りください。",
  "copyRequest": "内容をコピー ↗",
  "heroProof": "精密加工の現実に、寄り添う。",
  "heroOperation": "繰り返し使える工程",
  "heroPart": "現場の知識は、そのままに。",
  "heroMachine": "次の受注を、一歩先から。",
  "illustrativeComponent": "部品のイメージ",
  "strip1": "設備ごとの稼働時間に対応。",
  "strip2": "工程の知識を、繰り返し使える資産に。",
  "strip3": "日本語 / English",
  "overviewLabel": "選ばれる理由",
  "overviewStatement": "計画が変わっても、<br><span>影響がすぐにわかる。</span>",
  "overviewCopy": "特急の注文や設備の故障のたびに、ホワイトボードを書き直す必要はありません。変更を確定する前に、後工程への影響を確認できます。",
  "cap1Title": "守れる納期を、答えられる。",
  "cap1Copy": "シフト、休日、計画メンテナンスを踏まえた設備ごとの空き状況を、納期と並べて確認。回答する前に見通しが立ちます。",
  "cap2Title": "トラブルがあっても、すぐに計画し直せる。",
  "cap2Copy": "手動で動かすことも、自動計画の提案を使うことも。後ろ倒しになる仕事を確認し、固定した工程はそのまま。必要なら元に戻せます。",
  "cap3Title": "過去の計画を、すぐに探せる。",
  "cap3Copy": "どの日に、どの設備で、どの受注の工程を計画したか。ホワイトボードの写真や古いファイルを探さずに確認できます。",
  "demoLabel": "試してみる / サンプルデータ",
  "demoHint": "工程をドラッグして時間を変えてみてください。変更を適用する前に、ほかにどの工程が動き、どの受注が遅れるかを確認できます。",
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
  $('#email-fallback').hidden=false;$('#request-text').value=`To: hello@somakk.com\nSubject: ${subject}\n\n${body}`;
  window.location.href=`mailto:hello@somakk.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
$('#copy-request').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#request-text').value);$('#copy-status').textContent=locale==='ja'?'コピーしました':'Copied';}catch{$('#request-text').select();$('#copy-status').textContent=locale==='ja'?'選択した内容をコピーしてください':'Select and copy the text';}});
setLanguage(locale);
if(new URLSearchParams(location.search).get('demo')==='1')$('#booking-dialog').showModal();
