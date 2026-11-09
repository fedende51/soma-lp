'use strict';
const $=s=>document.querySelector(s),clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const portrait=new URLSearchParams(location.search).has('portrait'),FW=portrait?1080:1920,FH=portrait?1350:1080;
if(portrait)document.body.classList.add('portrait');
const D=32,SP={w:20,z:1};
function spring(t,{w,z}=SP){if(t<=0)return 0;if(z>=1){const x=w*t;return 1-Math.exp(-x)*(1+x)}const wd=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z*w/wd*Math.sin(wd*t))}
class Track{constructor(v){this.v=v;this.last=v;this.events=[]}to(t,v,s=SP){this.events.push([t,v-this.last,s]);this.last=v;return this}at(t){return this.events.reduce((v,[a,d,s])=>v+d*spring(t-a,s),this.v)}}
const times=[2.3,4.9,7.45,15.1,17.65,20.2,22.75,25.3,27.85];
function track(initial,values){const t=new Track(initial);values.forEach((v,i)=>t.to(times[i],v));return t;}
const X=track(portrait?56:96,portrait?[56,56,56,56,56,56,56,56,56]:[1040,100,100,185,185,820,620,100,100]);
const Y=track(portrait?850:758,portrait?[610,580,520,580,620,550,550,640,980]:[420,440,345,430,430,395,450,450,810]);
const W=track(portrait?700:640,portrait?[968,968,968,968,968,968,968,968,560]:[740,1720,1720,1550,1550,1000,1200,1720,440]);
const H=track(5,portrait?[390,570,650,515,390,600,570,250,120]:[350,320,515,385,325,460,430,200,100]);
const R=track(2,[14,16,14,14,14,14,14,4,6]);
const scenes=[
 {a:0,b:2.3,text:'Production never<br><em>stands still.</em>',top:245,size:138,sub:'The plan has to move with it.',sy:610},
 {a:2.56,b:4.88,text:'A deadline<br><em>moves.</em>',top:270,size:128,sub:'One order. A ripple through the shop.',sy:590},
 {a:5.12,b:7.43,text:'Every step.<br><em>Connected.</em>',top:160,size:116,sub:'',sy:0},
 {a:7.68,b:10.0,text:'Meet <em>SOMA.</em>',top:175,size:124,sub:'',sy:0},
 {a:10.24,b:15.06,text:'One move.<br><em>A clearer next step.</em>',top:125,size:92,sub:'',sy:0},
 {a:15.36,b:17.6,text:'Review <em>the ripple.</em>',top:200,size:114,sub:'',sy:0},
 {a:17.92,b:20.15,text:'You keep <em>control.</em>',top:205,size:114,sub:'',sy:0},
 {a:20.48,b:22.7,text:'Knowledge,<br><em>kept.</em>',top:260,size:124,sub:'Define the route once.',sy:580},
 {a:23.04,b:25.25,text:'Next order.<br><em>A head start.</em>',top:170,size:116,sub:'',sy:0},
 {a:28.16,b:33,text:'Your production.<br><em>A clear plan.</em>',top:260,size:132,sub:'Production planning for precision manufacturing.',sy:620}
];
function opacity(t,a,b){return spring(t-a,{w:25,z:1})*(1-Math.pow(clamp((t-b)/.15),2))}
function show(el,t,a,b){const o=opacity(t,a,b);el.style.opacity=o;el.style.visibility=o>.001?'visible':'hidden';el.style.filter=`blur(${(1-o)*6}px)`;el.style.transform=`translateY(${(1-o)*12}px)`}
function layout(){const z=Math.min(innerWidth/FW,innerHeight/FH);$('#stage').style.transform=`scale(${z})`;$('#stage').style.left=`${(innerWidth-FW*z)/2}px`;$('#stage').style.top=`${(innerHeight-FH*z)/2}px`}
const clicks=[3.55,10.9,16.85,22.8];window.M={duration:D,bpm:93.75,cues:clicks.map(time=>({time,type:'click'})),scenes:scenes.map(s=>({start:s.a,end:s.b,title:s.text.replace(/<[^>]+>/g,' ')}))};
window.seek=function(raw){const t=clamp(raw,0,D),s=$('#surface');
 const easeOut=v=>1-Math.pow(1-clamp(v),3),outer=easeOut(t/.88),inner=easeOut((t-.05)/.9),word=easeOut((t-.96)/.32);
 $('#brand .ring-outer').setAttribute('transform',`translate(700 593) rotate(${-210*(1-outer)}) scale(${outer}) translate(-700 -593)`);
 $('#brand .ring-inner').setAttribute('transform',`translate(700 593) rotate(${230*(1-inner)}) scale(${inner}) translate(-700 -593)`);
 $('#brand .brand-name').style.opacity=word;$('#brand i').style.opacity=word;
 const dark=spring(t-17.65)-spring(t-20.2),brand=spring(t-25.3)-spring(t-27.85),cta=spring(t-27.85),initial=1-spring(t-2.3);
 const bg=[255,255,255].map((v,i)=>Math.round(v+( [0,60,91][i]-v)*dark+([97,222,219][i]-v)*brand+([8,107,156][i]-v)*cta+([11,121,169][i]-v)*initial));
 Object.assign(s.style,{left:X.at(t)+'px',top:Y.at(t)+'px',width:W.at(t)+'px',height:H.at(t)+'px',borderRadius:R.at(t)+'px',background:`rgb(${bg.join(',')})`,borderColor:dark>.5?'#003c5b':'#d5e4ed'});
 const brandGradient=Math.max(0,Math.min(1,brand));
 s.style.backgroundImage=`linear-gradient(110deg,rgba(0,60,91,${brandGradient}),rgba(5,101,127,${brandGradient}) 45%,rgba(4,120,121,${brandGradient}))`;
 let current=scenes.find(sc=>t>=sc.a&&t<sc.b+.16);
 const head=$('#headline'),sub=$('#subhead');
 if(current){const portraitTop=current.a===0?260:current.a===2.56?200:current.a===28.16?270:160;head.innerHTML=current.text;head.style.top=(portrait?portraitTop:current.top)+'px';head.style.fontSize=(portrait?Math.min(112,current.size):current.size)+'px';head.style.opacity=opacity(t,current.a,current.b);head.style.transform=`translateY(${(1-spring(t-current.a))*20}px)`;sub.innerHTML=current.sub;sub.style.top=(portrait?(current.a===0?580:current.a===2.56?475:current.a===20.48?445:660):current.sy)+'px';sub.style.opacity=opacity(t,current.a+.12,current.b)}else{head.innerHTML='';head.style.top='0px';head.style.fontSize='132px';head.style.opacity=0;head.style.transform='translateY(0px)';sub.innerHTML='';sub.style.top='0px';sub.style.opacity=0}
 show($('#order'),t,2.6,4.88);show($('#ripple'),t,5.16,7.43);show($('#board'),t,7.8,15.06);show($('#review'),t,15.42,17.6);show($('#confirmed'),t,18.02,20.15);show($('#library'),t,20.56,23.0);show($('#repeat'),t,23.1,25.25);show($('#soma'),t,25.68,27.75);show($('#cta'),t,28.3,33);
 $('#due-date').textContent=t<3.58?'Due Friday':'Due Thursday';$('#due-date').style.transform=`scale(${1-.04*Math.exp(-Math.pow((t-3.58)/.09,2))})`;
 const drag=clamp((t-11.25)/2.2),follow=spring(t-13.55,{w:16,z:1});$('#turn-block').style.transform=`translateX(${drag*(portrait?130:280)}px)`;$('#mill-block').style.transform=`translateX(${follow*(portrait?95:175)}px)`;$('#check-block').style.transform=`translateX(${follow*(portrait?65:130)}px)`;
 $('#turn-block').style.boxShadow=`0 0 0 ${t>10.9&&t<14?3:0}px #179bc660`;
 const rows=[...document.querySelectorAll('.library-row')];rows.forEach((el,i)=>{const v=spring(t-20.65-i*.25,{w:22,z:1});el.style.opacity=v;el.style.transform=`translateX(${(1-v)*24}px)`});
 let cx=0,cy=0,co=0;
 if(t>=3&&t<4.6){co=opacity(t,3,4.45);cx=1570;cy=683+25*(1-spring(t-3))}
 if(t>=10.45&&t<14.9){co=opacity(t,10.45,14.72);cx=100+40+220+20+155+drag*(portrait?130:280);cy=345+30+36+64+16+44}
 if(t>=16.25&&t<17.6){co=opacity(t,16.25,17.42);cx=1500;cy=725}
 if(t>=22.65&&t<23.15){co=opacity(t,22.65,23.0);cx=1640;cy=700}
 const aim=(selector)=>{const rect=$(selector).getBoundingClientRect(),stage=$('#stage').getBoundingClientRect(),z=stage.width/FW;cx=(rect.left-stage.left+rect.width*.5)/z;cy=(rect.top-stage.top+rect.height*.55)/z;};
 if(t>=3&&t<4.6)aim('#due-date');if(portrait&&t>=10.45&&t<14.9)aim('#turn-block');if(t>=16.25&&t<17.6)aim('#apply');if(t>=22.65&&t<23.15)aim('#use-route');
 const cursor=$('#cursor');cursor.style.left=cx+'px';cursor.style.top=cy+'px';cursor.style.opacity=co;cursor.style.transform=`scale(${1-clicks.reduce((v,c)=>v+.13*Math.exp(-Math.pow((t-c)/.06,2)),0)})`;
 const nearest=clicks.find(c=>t>=c&&t<c+.4),pulse=$('#press');if(nearest!==undefined){const age=(t-nearest)/.4,size=12+48*age;Object.assign(pulse.style,{left:cx-size/2+'px',top:cy-size/2+'px',width:size+'px',height:size+'px',opacity:1-age})}else Object.assign(pulse.style,{left:'0px',top:'0px',width:'0px',height:'0px',opacity:0});
 $('#grid').style.opacity=.28*(1-.6*spring(t-25.3));$('#progress-line').style.width=`${FW*t/D}px`;
 $('#scrub').value=t;
};
let playing=false,start=0;$('#play-preview').onclick=()=>{playing=!playing;if(playing){start=performance.now()-Number($('#scrub').value)*1000;$('#score').currentTime=Number($('#scrub').value);$('#score').play().catch(()=>{});requestAnimationFrame(tick)}else $('#score').pause()};function tick(now){if(!playing)return;const t=(now-start)/1000;seek(t);if(t<D)requestAnimationFrame(tick);else{playing=false;$('#score').pause()}}$('#scrub').oninput=e=>{playing=false;$('#score').pause();seek(Number(e.target.value))};
if(new URLSearchParams(location.search).has('render'))document.body.classList.add('render');
addEventListener('resize',layout);(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));layout();seek(Number(new URLSearchParams(location.search).get('t')||0));window.READY=true})()
