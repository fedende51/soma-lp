'use strict';
(() => {
 const directions={editorial:{name:'Editorial',description:'Oversized type, an asymmetric crop, and a softer glass note.'},spotlight:{name:'Spotlight',description:'The component leads. A fine brand orbit and compact copy keep it calm.'},flow:{name:'Flow',description:'From a part to its process. A static route makes the product idea tangible.'}};
 const devices={phone:{name:'Phone',width:390,height:844},tablet:{name:'Tablet',width:768,height:1024},desktop:{name:'Desktop',width:1440,height:1000}};
 const query=new URLSearchParams(location.search);let direction=directions[query.get('design')]?query.get('design'):'editorial',device=devices[query.get('device')]?query.get('device'):'phone';
 const frame=document.querySelector('#direction-preview'),holder=document.querySelector('.preview-holder'),stage=document.querySelector('.review-stage');
 let lastSize='';
 function resize(){
  const size=devices[device],style=getComputedStyle(stage),available=stage.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),scale=Math.min(1,available/size.width);
  const key=`${device}/${available}`;if(key===lastSize)return;lastSize=key;
  holder.style.width=`${size.width*scale}px`;holder.style.height=`${size.height*scale}px`;frame.style.width=`${size.width}px`;frame.style.height=`${size.height}px`;frame.style.transform=`scale(${scale})`;
 }
 function update(reload){
  document.querySelectorAll('[data-direction]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.direction===direction)));
  document.querySelectorAll('[data-device]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.device===device)));
  document.querySelector('#direction-description').textContent=directions[direction].description;
  document.querySelector('#open-direction').href=`hero-${direction}.html`;
  frame.title=`${directions[direction].name} hero - ${devices[device].name.toLowerCase()} preview`;
  if(reload)frame.src=`hero-${direction}.html`;
  document.querySelector('#preview-status').textContent=`${directions[direction].name} / ${devices[device].name}`;
  const next=new URL(location.href);next.searchParams.set('design',direction);next.searchParams.set('device',device);history.replaceState(null,'',next);resize();
 }
 document.querySelectorAll('[data-direction]').forEach(b=>b.addEventListener('click',()=>{direction=b.dataset.direction;update(true);}));
 document.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',()=>{device=b.dataset.device;update(false);}));
 new ResizeObserver(resize).observe(stage);update(true);
})();
