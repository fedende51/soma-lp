'use strict';
(() => {
 const icon=document.querySelector('link[data-soma-favicon]');if(!icon)return;
 const fallback=icon.href,reduce=matchMedia('(prefers-reduced-motion: reduce)');
 // These two small transparent layers come from the original logo crop.
 const layers=__SOMA_RING_LAYERS__;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
 const context=canvas.getContext('2d');if(!context)return;
 let images=null,timer=0,last=null,seconds=0,suspended=false;
 const stop=()=>{clearTimeout(timer);timer=0;last=null;};
 const draw=()=>{
  context.clearRect(0,0,64,64);
  for(const [name,duration,direction] of [['outer',24,1],['inner',30,-1]]){
   context.save();context.translate(32,32);context.rotate(direction*seconds*Math.PI*2/duration);
   context.drawImage(images[name],-32,-32,64,64);context.restore();
  }
  icon.href=canvas.toDataURL('image/png');
 };
 const tick=()=>{
  const now=performance.now();if(last!==null)seconds+=(now-last)/1000;last=now;
  try{draw();timer=setTimeout(tick,125);}catch{stop();icon.href=fallback;}
 };
 const sync=()=>{
  stop();
  if(reduce.matches){seconds=0;icon.href=fallback;return;}
  if(images&&!document.hidden&&!suspended)tick();
 };
 document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
 window.addEventListener('pagehide',()=>{suspended=true;stop();});
 window.addEventListener('pageshow',()=>{suspended=false;sync();});
 Promise.all(Object.entries(layers).map(([name,src])=>new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>resolve([name,image]);image.onerror=reject;image.src=src;
 }))).then(entries=>{images=Object.fromEntries(entries);sync();}).catch(()=>{icon.href=fallback;});
})();
