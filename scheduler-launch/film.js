(async()=>{
'use strict';
const timing=await fetch('timing.json').then(r=>r.json());
const portrait=new URLSearchParams(location.search).has('portrait');
const render=new URLSearchParams(location.search).has('render');
document.body.classList.toggle('render',render);
const W=portrait?1080:1920,H=portrait?1920:1080;
const C={ink:'#003c5b',blue:'#0b79a9',cyan:'#00b9c1',mint:'#61dedb',paper:'#fbfcfc',slate:'#526b79'};
const $=s=>document.getElementById(s),svg=$('film');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
const assets=await Promise.all(['logo_soma_light.png','logo_soma_dark.png'].map(async name=>{
 const blob=await fetch('assets/'+name).then(r=>r.blob());
 return new Promise(resolve=>{const f=new FileReader();f.onload=()=>resolve(f.result);f.readAsDataURL(blob)});
}));
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,p)=>a+(b-a)*p;
const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
const spring=(dt,w=19)=>dt<=0?0:1-Math.exp(-w*dt)*(1+w*dt);
const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
function heroFill(t){let v=rgb(C.blue);const changes=[[15,C.paper],[17.65,C.blue],[27,C.ink]];let previous=rgb(C.blue);for(const[time,color]of changes){const next=rgb(color),p=spring(t-time,16);v=v.map((n,i)=>n+(next[i]-previous[i])*p);previous=next}return `rgb(${v.map(n=>Math.round(clamp(n,0,255))).join(',')})`}
const event=name=>timing.actions.find(a=>a.name===name).seconds;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const fmt=n=>Number(n).toFixed(3);
function rect(x,y,w,h,fill=C.paper,r=16,stroke='none',sw=1,extra=''){return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(Math.max(0,w))}" height="${fmt(Math.max(0,h))}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra}/>`}
function text(s,x,y,size=28,color=C.ink,cls='',extra=''){return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" class="${cls}" style="fill:${color}" ${extra}>${esc(s)}</text>`}
function line(x,y,x2,y2,color=C.ink,w=2,extra=''){return `<path d="M${fmt(x)},${fmt(y)}L${fmt(x2)},${fmt(y2)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`}
function group(s,o=1,x=0,y=0,scale=1,extra=''){return `<g opacity="${clamp(o)}" transform="translate(${fmt(x)} ${fmt(y)}) scale(${fmt(scale)})" ${extra}>${s}</g>`}
function check(x,y,size=20,color=C.ink){return `<path d="M${x-size*.4} ${y}l${size*.27} ${size*.3} ${size*.56} ${-size*.65}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`}
function pin(x,y,size=22,color=C.slate){return `<g transform="translate(${x} ${y}) scale(${size/24})"><path d="M8 3h8l-1 7 3 3v2h-5v6l-1 2-1-2v-6H6v-2l3-3-1-7Z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/></g>`}
function arrow(x,y,color=C.ink){return `<path d="M${x} ${y}h27m-8-8 8 8-8 8" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`}
function badge(label,x,y,w=180,inverse=false){return rect(x,y,w,38,inverse?C.blue:'#e9f2f5',19)+text(label,x+18,y+26,18,inverse?C.paper:C.ink)}
function logo(x,y,width=235,dark=false,ring=true){
 const art=assets[dark?1:0];const nameW=ring?width*.70:width;
 let s=`<svg x="${x+(ring?width*.26:0)}" y="${y+(ring?width*.055:0)}" width="${nameW}" height="${nameW*147/1193}" viewBox="104 1022 1193 147"><image href="${art}" width="1400" height="1400"/></svg>`;
 if(ring)s=`<svg x="${x}" y="${y-width*.065}" width="${width*.21}" height="${width*.21}" viewBox="330 228 742 730"><image href="${art}" width="1400" height="1400"/></svg>`+s;
 return s;
}
function phase(t,start,end,enter=.45,exit=.22){return smooth((t-start)/enter)*(1-smooth((t-(end-exit))/exit))}
function screenTitle(t,index,lines,x,y,size,align='start',color=C.ink){
 const scene=timing.scenes[index],p=index===0?1:spring(t-scene.start-.10,15),out=1-smooth((t-(scene.end-.28))/.25);
 const blur=(1-p*out)>0.55?8:(1-p*out)>0.2?4:0;
 return group(lines.map((s,i)=>text(s,x,y+i*size*1.03,size,color,'display',`text-anchor="${align}"`)).join(''),p*out,0,(1-p)*24,1,blur?`filter="url(#blur${blur})"`:'');
}
const B=()=>portrait?{x:72,y:742,w:936,h:680,l:172,rh:148,head:108}:{x:96,y:396,w:1728,h:540,l:230,rh:124,head:108};
const zoomB=()=>portrait?{x:72,y:780,w:936,h:650,l:172,rh:140,head:108}:{x:668,y:254,w:1156,h:690,l:170,rh:172,head:108};
function heroIn(b,after=false){const area=b.w-b.l-50;return {x:b.x+b.l+24+area*(after?.17:.025),y:b.y+b.head+22,w:area*.255,h:portrait?96:84,r:13}}
const intro=portrait?{x:106,y:970,w:868,h:285,r:24}:{x:1060,y:365,w:716,h:290,r:24};
const wide=heroIn(B()),close=heroIn(zoomB()),shift=heroIn(B(),true);
const review=portrait?{x:72,y:750,w:936,h:650,r:26}:{x:1010,y:286,w:814,h:620,r:26};
const route=portrait?{x:72,y:775,w:936,h:170,r:22}:{x:96,y:490,w:516,h:280,r:22};
const newRoute=portrait?{x:72,y:1026,w:936,h:130,r:18}:{x:1080,y:350,w:744,h:136,r:18};
const end={x:-8,y:-8,w:W+16,h:H+16,r:0};
const shapeKeys=[{t:0,...intro},{t:event('unfold'),...wide},{t:timing.scenes[3].start,...close},{t:event('proposal'),...shift},{t:event('review'),...review},{t:event('settle')-.35,...shift},{t:event('library'),...route},{t:event('new_order'),...newRoute},{t:event('brand'),...end}];
function track(prop,t){let v=shapeKeys[0][prop];for(let i=1;i<shapeKeys.length;i++)v+=(shapeKeys[i][prop]-shapeKeys[i-1][prop])*spring(t-shapeKeys[i].t,16);return v}
function getShape(t){const g={};for(const p of ['x','y','w','h','r'])g[p]=track(p,t);const d=smooth((t-9.5)/1.5)*(1-spring(t-12,16));g.x+=d*(portrait?118:130);return g}
function panelChrome(b,t){
 let s=rect(b.x,b.y,b.w,b.h,C.paper,22,'#b7cbd5',1.3);
 s+=text('SCHEDULER',b.x+28,b.y+43,19,C.slate,'meta')+text('TUE 20 OCT',b.x+(portrait?240:300),b.y+43,18,C.slate,'meta');
 s+=badge('Draft',b.x+b.w-(portrait?130:150),b.y+18,105);
 s+=text('OR-025 · Diffuser ring · 24 pcs',b.x+28,b.y+78,portrait?21:24,C.ink);
 const days=portrait?['08:00','12:00','16:00']:['08:00','10:00','12:00','14:00','16:00'];const gridX=b.x+b.l,area=b.w-b.l-50;
 days.forEach((d,i)=>{const xx=gridX+i*area/(days.length-1);s+=text(d,xx+(i===days.length-1?-5:14),b.y+b.head-7,17,C.slate,'meta',i===days.length-1?'text-anchor="end"':'');s+=line(xx,b.y+b.head+10,xx,b.y+b.h-24,'#d7e3e9',1)});
 const labels=[['NC-01','Turning'],['MC-01','Milling'],['CMM-01','Inspection']];
 labels.forEach((v,i)=>{const yy=b.y+b.head+10+i*b.rh;s+=line(b.x+24,yy,b.x+b.w-24,yy,'#d7e3e9',1);s+=text(v[0],b.x+28,yy+47,portrait?24:26);s+=text(v[1],b.x+28,yy+79,portrait?19:21,C.slate)});
 return s;
}
function operation(label,id,g,{ghost=false,pinned=false,secondary=false}={}){
 const fill=pinned?'#eaf0f3':secondary?'#dcecf4':'#e2f4f4';
 let s=rect(g.x,g.y,g.w,g.h,fill,13,ghost?C.blue:pinned?'#a6bbc7':'#84b3ca',ghost?2:1.2,ghost?'stroke-dasharray="8 6"':'');
 s+=rect(g.x+1,g.y+1,g.w-2,5,pinned?C.slate:C.cyan,2);
 s+=text(id,g.x+18,g.y+29,portrait?24:16,C.slate,'meta');
 s+=text(label,g.x+18,g.y+(portrait?75:62),portrait?38:28,C.ink);
 if(pinned)s+=pin(g.x+g.w-38,g.y+20,23);
 return s;
}
function routePath(a,b,t,delay=0){
 const x1=a.x+a.w,y1=a.y+a.h*.5,x2=b.x,y2=b.y+b.h*.5,mid=lerp(x1,x2,.5);
 const d=`M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`;
 return `<path d="${d}" fill="none" stroke="${C.blue}" stroke-width="2.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${1-spring(t-6-delay,8)}" marker-end="url(#arrow)"/>`;
}
function board(t,b,opacity=1,reviewBehind=false){
 const area=b.w-b.l-50,g1=heroIn(b),delayMove=spring(t-12,12),isAfter=t>=12;
 const g2={x:b.x+b.l+area*(.32+.15*delayMove),y:b.y+b.head+22+b.rh,w:area*(portrait?.23:.20),h:portrait?96:84};
 const g3={x:b.x+b.l+area*((portrait?.57:.54)+.25*delayMove),y:b.y+b.head+22+b.rh*2,w:area*(portrait?.18:.21),h:portrait?96:84};
 const fixed={x:b.x+b.l+area*.66,y:g1.y,w:area*.27,h:g1.h};
 let s=panelChrome(b,t);
 if(t>=6){const p=spring(t-6,12);let a=heroIn(b,isAfter);if(t>=9&&t<12)a={...g1,x:g1.x+smooth((t-9.5)/1.5)*(portrait?118:130)};s+=group(routePath(a,g2,t)+routePath(g2,g3,t,.12),p)}
 // The ghost origin makes proposed changes legible before confirmation.
 if(t>=12&&t<17.3){const op=phase(t,12,17.3);for(const g of [{...g2,x:b.x+b.l+area*.32},{...g3,x:b.x+b.l+area*(portrait?.57:.54)}])s+=group(rect(g.x,g.y,g.w,g.h,'none',13,'#9bb3bf',1.5,'stroke-dasharray="5 5"'),op*.7)}
 s+=group(operation('Milling','OR-025',g2,{ghost:t>=12&&t<17,secondary:true}),spring(t-4,.9*16));
 s+=group(operation('CMM','OR-025',g3,{ghost:t>=12&&t<17}),spring(t-4.15,16));
 if(t>=11&&t<17)s+=group(rect(g1.x,g1.y,g1.w,g1.h,'none',13,'#9bb3bf',1.5,'stroke-dasharray="5 5"'),phase(t,11,17));
 s+=group(operation(portrait?'Pinned':'Fixed commitment','OR-018',fixed,{pinned:true}),spring(t-3.8,16));
 if(t>=12&&t<15)s+=group(badge('Proposed moves',b.x+b.w-(portrait?286:320),b.y+b.h-58,258),spring(t-12.25,15));
 if(t>=11&&t<12)s+=group(badge('Proposed move',b.x+b.w-(portrait?286:320),b.y+b.h-58,258),spring(t-11,15));
 if(t>=18&&t<21)s+=group(check(b.x+b.w-276,b.y+b.h-40,18)+text('Changes applied',b.x+b.w-252,b.y+b.h-32,20,C.ink),spring(t-18.2,16));
 if(t>=12&&t<21&&!portrait)s+=group(text('Pinned work stays put.',b.x+b.w-316,b.y+b.head-37,18,C.slate),spring(t-12.5,13));
 if(reviewBehind)s=group(s,.13)+(portrait?'':rect(0,250,930,680,C.paper,0));
 return group(s,opacity);
}
function heroLabel(t,g){
 let s='';
 if(t<3.24){let o=1-smooth((t-2.85)/.25);s+=group(text('OR-025',g.x+38,g.y+63,26,C.paper,'meta')+text('Diffuser ring',g.x+38,g.y+128,portrait?54:60,C.paper,'display')+text('24 pieces  /  Turning',g.x+38,g.y+183,29,C.paper)+line(g.x+38,g.y+218,g.x+g.w-38,g.y+218,'#5fa9c8',1.5)+text('Turning needs a later slot.',g.x+38,g.y+255,portrait?28:22,C.paper),o)}
 if(t>=3.22&&t<15){let o=spring(t-3.25,18)*(1-smooth((t-14.7)/.2));s+=group(text('OR-025',g.x+18,g.y+28,portrait?24:16,C.paper,'meta')+text('Turning',g.x+18,g.y+(portrait?75:62),portrait?38:28,C.paper),o)}
 if(t>=15.24&&t<18){
 const o=spring(t-15.3,16)*(1-smooth((t-17.45)/.18));const x=g.x+40,y=g.y+62,w=g.w-80;
 s+=group(text('REVIEW CHANGES',x,y,20,C.slate,'meta')+text('OR-025',x,y+85,portrait?58:60,C.ink,'display')+text('Projected completion',x,y+145,26,C.slate)+line(x,y+178,x+w,y+178,'#cfdee5',1)+text('Before',x,y+250,20,C.slate)+text('After',x+w*.57,y+250,20,C.slate)+text('Tue 14:00',x,y+315,portrait?37:40,C.slate)+arrow(x+w*.43,y+304)+text('Tue 16:00',x+w*.57,y+315,portrait?37:40,C.ink)+pin(x,y+350,22)+text('Pinned work unchanged',x+36,y+370,22,C.ink)+rect(x,y+407,w,72,C.ink,14)+text(t>=17?'Changes applied':'Apply changes',x+w/2,y+453,26,C.paper,'',`text-anchor="middle"`)+(t>=17?check(x+w-42,y+440,24,C.paper):arrow(x+w-63,y+442,C.paper)),o);
 }
 if(t>=18.05&&t<21){s+=group(text('OR-025',g.x+18,g.y+28,portrait?24:16,C.paper,'meta')+text('Turning',g.x+18,g.y+(portrait?75:62),portrait?38:28,C.paper),spring(t-18.05,18)*(1-smooth((t-20.7)/.22)))}
 if(t>=21.25&&t<24){const o=spring(t-21.3,17)*(1-smooth((t-23.7)/.22));s+=group(text('01',g.x+32,g.y+(portrait?40:52),23,C.paper,'meta')+text('Turning',g.x+32,g.y+(portrait?91:141),portrait?41:55,C.paper,'display')+text('Compatible machines',g.x+32,g.y+(portrait?131:207),21,C.paper)+(portrait?'':text('NC-01',g.x+32,g.y+247,24,C.paper)),o)}
 if(t>=24.25&&t<27){const o=spring(t-24.3,17)*(1-smooth((t-26.7)/.22));s+=group(text('01',g.x+25,g.y+37,20,C.paper,'meta')+text('Turning',g.x+25,g.y+83,34,C.paper,'display')+check(g.x+g.w-44,g.y+65,22,C.paper),o)}
 return s;
}
function routing(t){
 const o=phase(t,21.2,24,.5,.25),g=route;
 let s='';const cards=portrait?[[72,991,936,170],[72,1207,936,170]]:[[702,490,516,280],[1308,490,516,280]];
 cards.forEach((a,i)=>{const[x,y,w,h]=a;let z=rect(x,y,w,h,i?'#e1f3f2':'#e2eff6',22,'#afcbd7',1.3)+text('0'+(i+2),x+32,y+(portrait?40:52),23,C.slate,'meta')+text(i?'CMM inspection':'Milling',x+32,y+(portrait?91:141),portrait?41:55,C.ink,'display')+text('Compatible machines',x+32,y+(portrait?131:207),21,C.slate);if(!portrait)z+=text(i?'CMM-01':'MC-01',x+32,y+247,24,C.ink);s+=group(z,spring(t-21.42-i*.1,17));
 if(portrait)s+=line(x+w/2,y-38,x+w/2,y-12,C.blue,2.5);else s+=arrow(x-62,y+140,C.blue);
 });
 const infoY=portrait?1470:862;
 s+=text('Part library · Diffuser ring',portrait?72:96,portrait?706:425,portrait?29:32,C.slate)+text('Reusable part template',portrait?72:96,infoY,25,C.ink)+check(portrait?414:438,infoY-10,20,C.ink);
 return group(s,o);
}
function newOrder(t){
 const o=phase(t,24.15,27,.45,.25);const x=portrait?72:96,y=portrait?730:340,w=portrait?936:820,h=portrait?240:540;
 let s=rect(x,y,w,h,C.paper,23,'#b7cbd5',1.3)+text('NEW ORDER',x+36,y+48,20,C.slate,'meta')+text('Diffuser ring',x+36,y+109,portrait?43:55,C.ink,'display');
 if(portrait){s+=text('24 pieces',x+36,y+159,25,C.slate)+rect(x+w-295,y+176,258,58,C.ink,12)+text(t>=25.5?'Order created':'Create order',x+w-166,y+214,22,C.paper,'','text-anchor="middle"')}
 else{s+=text('Part',x+36,y+168,21,C.slate)+rect(x+36,y+187,w-72,65,'#f0f5f7',10)+text('Diffuser ring',x+57,y+229,27,C.ink)+text('Quantity',x+36,y+298,21,C.slate)+rect(x+36,y+316,216,66,'#f0f5f7',10)+text('24',x+57,y+359,30,C.ink)+text('Deadline',x+295,y+298,21,C.slate)+rect(x+295,y+316,w-331,66,'#f0f5f7',10)+text('Fri 16:00',x+316,y+359,28,C.ink)+rect(x+36,y+423,w-72,74,C.ink,14)+text(t>=25.5?'Order created':'Create order',x+w/2,y+471,27,C.paper,'','text-anchor="middle"')}
 const ry=newRoute.y,rx=newRoute.x,rw=newRoute.w;
 s+=text('Own routing copy',rx,ry-32,portrait?26:25,C.ink);
 [1,2].forEach(i=>{const yy=ry+i*(portrait?172:182);s+=rect(rx,yy,rw,portrait?130:136,i===1?'#e2eff6':'#e1f3f2',18,'#afcbd7',1.2)+text('0'+(i+1),rx+25,yy+37,20,C.slate,'meta')+text(i===1?'Milling':'CMM inspection',rx+25,yy+83,34,C.ink,'display')+check(rx+rw-44,yy+65,22,C.ink);s+=line(rx+rw/2,yy-28,rx+rw/2,yy-9,C.blue,2)});
 if(t>=25.5)s+=group(badge('OR-026 · Unscheduled',portrait?72:96,portrait?1525:947,342),spring(t-25.5,17));
 return group(s,o);
}
function cursor(t){
 let x=0,y=0,o=0,press=0;const z=zoomB(),start=heroIn(z),drag=smooth((t-9.5)/1.5);
 if(t>=8.75&&t<12){const enter=spring(t-8.75,10);x=start.x+start.w*.54+drag*(portrait?118:130);y=start.y+51+(1-enter)*160-Math.sin(drag*Math.PI)*15;o=enter*(1-smooth((t-11.7)/.25));press=(t>=9.5&&t<=11)?1:0}
 if(t>=16&&t<18){const e=spring(t-16,9);x=review.x+review.w*.75;y=review.y+510+(1-e)*110;o=e*(1-smooth((t-17.6)/.25));press=Math.exp(-(((t-17)/.06)**2))}
 if(t>=24.75&&t<26.3){const e=spring(t-24.75,10);x=portrait?805:746;y=portrait?944:809;o=e*(1-smooth((t-26)/.2));press=Math.exp(-(((t-25.5)/.06)**2))}
 if(!o)return '';
 const a=1-press*.13;
 let s=`<path d="M0 0 4 39 14 28 22 46 30 42 22 24 38 22Z" fill="${C.ink}" stroke="${C.paper}" stroke-width="3" stroke-linejoin="round"/>`;
 s+=rect(35,41,93,35,C.ink,17)+text('Planner',50,65,17,C.paper);
 for(const hit of[9.5,17,25.5]){const p=(t-hit)/.45;if(p>=0&&p<1)s+=`<circle cx="1" cy="1" r="${8+p*43}" fill="none" stroke="${C.blue}" stroke-width="2" opacity="${(1-p)*.6}"/>`}
 return group(s,o,x,y,a);
}
const titles=[['Plans','change.'],['Make room.'],['See the','whole route.'],['Move','one step.'],['See what','follows.'],['Review.','Then commit.'],['Your plan.','Your call.'],['Keep the','know-how.'],['Start from','what you know.']];
function titlesAt(t){let s='';for(let i=0;i<9;i++){
 if(portrait){s+=screenTitle(t,i,titles[i],72,490,100)}
 else if(i===0){s+=screenTitle(t,i,titles[i],96,408,168)}
 else if(i===3){s+=screenTitle(t,i,titles[i],96,449,118)}
 else if(i===5){s+=screenTitle(t,i,titles[i],96,425,119)}
 else if(i===7){s+=screenTitle(t,i,['Keep the know-how.'],96,282,113)}
 else if(i===8){s+=screenTitle(t,i,['Start from what you know.'],96,267,100)}
 else {s+=screenTitle(t,i,[timing.scenes[i].title],96,267,i===2?110:116)}
 }return s;}
function renderFrame(time){
 const t=clamp(time,0,29.999999);const g=getShape(t),closing=spring(t-27,12),dark=closing>.6;
 let back='',front='',over='';
 // Subtle camera movement is calculated directly from film time, never a running simulation.
 const drift=Math.sin(t*.7)*2.5;
 $('world').setAttribute('transform',`translate(0 ${fmt(drift)})`);
 if(t>=3&&t<21){let b=t>=9&&t<12?zoomB():B();let o=spring(t-3.13,16)*(1-smooth((t-20.65)/.3));
 // Board re-framing shares the block coordinates at its handoff.
 if(t>=9&&t<9.7){const p=spring(t-9,16),a=B(),z=zoomB();b={};for(const k of Object.keys(a))b[k]=lerp(a[k],z[k],p)}
 if(t>=12&&t<12.7){const p=spring(t-12,16),a=zoomB(),z=B();b={};for(const k of Object.keys(a))b[k]=lerp(a[k],z[k],p)}
 back+=board(t,b,o,t>=15&&t<18);
 }
 if(t>=21&&t<24)back+=routing(t);
 if(t>=24&&t<27)back+=newOrder(t);
 front+=heroLabel(t,g);
 const fill=heroFill(t);
 for(const [k,v] of Object.entries(g))$('hero').setAttribute(({r:'rx',w:'width',h:'height'})[k]||k,fmt(v));
 $('hero').setAttribute('fill',fill);$('hero').setAttribute('stroke',t>=15&&t<18?'#b7cbd5':t>=11&&t<15?C.paper:'none');$('hero').setAttribute('stroke-width',t>=11&&t<15?'2':'1.5');$('hero').setAttribute('stroke-dasharray',t>=11&&t<15?'8 6':'none');
 $('hero').setAttribute('filter',t>=15&&t<18?'url(#shadow)':'none');
 // Headline movement masks the previous thought before the next one arrives.
 over+=titlesAt(t);
 const top=portrait?286:88;
 over+=group(logo(portrait?72:96,top,portrait?295:254,dark),1-closing);
 if(!portrait)over+=group(text('PRECISION IN THE PLAN.',1824,91,18,C.slate,'meta','text-anchor="end"'),1-closing);
 const footerY=portrait?1594:1006;
 over+=group(text('ILLUSTRATIVE WORKFLOW · EXAMPLE DATA',portrait?72:96,footerY,portrait?19:16,C.slate,'meta'),1-closing);
 if(!portrait)over+=group(text('SOMA / SCHEDULER',1824,footerY,16,C.slate,'meta','text-anchor="end"'),1-closing);
 if(t<3){const o=1-smooth((t-2.7)/.25);over+=group(badge('PLANS MEET REAL LIFE',portrait?72:96,portrait?739:704,333),o)}
 if(t>=18&&t<21){over+=group(text('Pinned work stays put.',portrait?72:96,portrait?1515:329,portrait?40:27,C.slate),phase(t,18.2,21))}
 if(portrait){
 if(t>=6&&t<9)over+=group(text('Pinned work stays put.',72,1515,40,C.ink),phase(t,6.1,9));
 if(t>=9&&t<12)over+=group(text('Turning → later',72,1515,42,C.ink),phase(t,9.2,12));
 if(t>=12&&t<15)over+=group(text('14:00 → 16:00 · proposed',72,1490,40,C.ink)+text('Pinned work stays put.',72,1550,38,C.slate),phase(t,12.2,15));
 }
 over+=cursor(t);
 if(t>=27){const e=spring(t-27.4,13),cx=W/2,ringSize=portrait?238:202,ringY=portrait?590:266;
 const art=assets[1];over+=group(`<svg x="${cx-ringSize/2}" y="${ringY}" width="${ringSize}" height="${ringSize}" viewBox="330 228 742 730"><image href="${art}" width="1400" height="1400"/></svg>`,e,0,(1-e)*26);
 const nameW=portrait?390:390,ny=ringY+ringSize+50;
 over+=group(logo(cx-nameW/2,ny,nameW,true,false),spring(t-27.55,13));
 over+=group(text('Scheduler',cx,ny+(portrait?142:124),portrait?62:60,C.paper,'display','text-anchor="middle"'),spring(t-27.7,13));
 const titleY=portrait?1235:761;
 over+=group(text('Make room for change.',cx,titleY,portrait?61:76,C.paper,'display','text-anchor="middle"'),spring(t-27.9,12));
 over+=group(text('Plan your next move.',cx,titleY+(portrait?91:82),portrait?30:29,C.mint,'','text-anchor="middle"'),spring(t-28.1,12));
 // A measured, shallow expansion keeps the resolved end card alive.
 over+=group(line(cx-(portrait?170:220),titleY+128,cx-(portrait?170:220)+(portrait?340:440)*spring(t-28,2),titleY+128,C.cyan,3),closing);
 }
 $('back').innerHTML=back;$('front').innerHTML=front;$('overlay').innerHTML=over;
 window.FRAME_DATA={t,portrait,hero:g,scene:Math.floor(t/3),example:true};
 if(!render){$('time').textContent=t.toFixed(2);$('scrub').value=t}
}
$('defs').innerHTML=`<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1l7 4-7 4" fill="none" stroke="${C.blue}" stroke-width="1.5" stroke-linecap="round"/></marker><filter id="shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="26" flood-color="${C.ink}" flood-opacity=".09"/></filter>`;
$('defs').innerHTML+='<filter id="blur4"><feGaussianBlur stdDeviation="4"/></filter><filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>';
await document.fonts.ready;const warm=new Image();warm.src=assets[0];await warm.decode();const warm2=new Image();warm2.src=assets[1];await warm2.decode();
window.seek=renderFrame;window.M={...timing,width:W,height:H,portrait};window.READY=true;renderFrame(0);
let playing=false,start=0,position=0;
function tick(ms){if(!playing)return;position=(ms-start)/1000;if(position>=30){playing=false;$('play').textContent='Play';renderFrame(29.999);return}renderFrame(position);requestAnimationFrame(tick)}
$('play').onclick=()=>{playing=!playing;$('play').textContent=playing?'Pause':'Play';if(playing){if(position>=29.99)position=0;start=performance.now()-position*1000;requestAnimationFrame(tick)}};
$('scrub').oninput=e=>{position=+e.target.value;playing=false;$('play').textContent='Play';renderFrame(position)};
})();
