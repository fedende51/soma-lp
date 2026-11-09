'use strict';
(() => {
 const direction=document.body.dataset.heroDirection;if(!direction)return;
 const dictionary={
  editorial:{en:{title:'Complex<br>work.<br><span>A clear plan.</span>',copy:'Production planning for precision manufacturing. Built on your team’s knowledge.',noteLabel:'ENGINEERING KNOWLEDGE',noteTitle:'The knowledge stays.'},ja:{title:'複雑な仕事に、<br><span>明確な計画を。</span>',copy:'精密加工のための生産計画。仕事の見通しと、その背景にある現場の知識をひとつに。',noteLabel:'現場の知識を資産に',noteTitle:'知識は、そのままに。'}},
  spotlight:{en:{title:'Precision work.<br><span>Clearly planned.</span>',copy:'Plan production around your machines, your hours, and your team. Keep the knowledge that makes it work.',noteTitle:'Your expertise. Built into the plan.'},ja:{title:'精密な仕事に、<br><span>確かな計画を。</span>',copy:'設備、稼働時間、そして現場の人に合った生産計画へ。仕事を支える知識も、計画の中に。',noteTitle:'現場の経験を、計画の力に。'}},
  flow:{en:{title:'Every part.<br><span>A clear path.</span>',copy:'Capture the route once. Plan the next order with the knowledge already in place.',part:'DIFFUSER RING',partNote:'From your part library',turning:'Turning',shape:'Shape the part',milling:'Milling',detail:'Machine the detail',inspection:'Inspection',quality:'Plan the quality gate',routeNote:'ILLUSTRATIVE ROUTE / REUSABLE KNOWLEDGE'},ja:{title:'ひとつの部品に、<br><span>明確な道筋を。</span>',copy:'工程は一度決めて、繰り返し使う。次の受注は、蓄積した知識から計画できます。',part:'ディフューザーリング',partNote:'部品ライブラリから',turning:'旋削',shape:'部品の形状をつくる',milling:'フライス加工',detail:'細部を加工する',inspection:'検査',quality:'品質確認も計画に',routeNote:'工程のイメージ / 繰り返し使える知識'}}
 };
 function update(){
  const lang=document.documentElement.lang==='ja'?'ja':'en',copy=dictionary[direction]?.[lang];if(!copy)return;
  document.querySelectorAll('[data-concept-key]').forEach(el=>{const key=el.dataset.conceptKey;el.innerHTML=key==='category'?(lang==='ja'?'SOMA SCHEDULER / 生産計画':'SOMA SCHEDULER / PRODUCTION PLANNING'):(copy[key]||'');});
  const route=document.querySelector('.flow-route');if(route)route.setAttribute('aria-label',lang==='ja'?'工程のイメージ':'Illustrative routing');
  document.title=`${lang==='ja'?'株式会社SOMA':'SOMA Co., Ltd.'} - ${direction[0].toUpperCase()+direction.slice(1)} / Hero direction`;
 }
 window.addEventListener('soma:language',()=>{update();window.ScrollTrigger?.refresh();});update();
})();
