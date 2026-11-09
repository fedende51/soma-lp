'use strict';
(() => {
 const image=document.querySelector('.hero.selected-hero img.hero-part');if(!image)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const artwork=image.closest('picture')||image;
 const stage=document.createElement('div');stage.className='hero-part hero-ring-stage';
 artwork.replaceWith(stage);stage.append(artwork);image.className='hero-ring-fallback';
 const canvas=document.createElement('div');canvas.className='hero-ring-canvas';canvas.setAttribute('aria-hidden','true');stage.append(canvas);
 const frameLimit=60,frameInterval=1000/frameLimit;
 let ring=null,frame=0,last=null,nextDraw=null,seconds=0,renderedFrames=0,visible=false,loading=false,failed=false,readyAt=null,failureReason=null;
 const stop=()=>{cancelAnimationFrame(frame);frame=0;last=nextDraw=null;};
 const tick=now=>{
  if(last!==null)seconds+=Math.min((now-last)/1000,.1);last=now;
  if(nextDraw===null)nextDraw=now;
  if(now+.5>=nextDraw){
   ring.seek(seconds);renderedFrames++;
   // Retain fractional frame time so browser timestamp rounding cannot turn
   // a 60 Hz refresh into 30 FPS. Skip missed draws instead of queuing them.
   nextDraw+=Math.max(1,Math.floor((now-nextDraw+.5)/frameInterval)+1)*frameInterval;
  }
  frame=requestAnimationFrame(tick);
 };
 const sync=()=>{
  stop();if(ring&&visible&&!document.hidden&&!reduce.matches)frame=requestAnimationFrame(tick);
 };
 const fallback=()=>{failed=true;stop();stage.classList.remove('is-ready');ring?.dispose();ring=null;};
 const start=async()=>{
  if(loading||failed||ring)return;loading=true;
  try{
   const engine=window.SomaPrecisionRing?Promise.resolve():new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='assets/precision-ring-3d.js?v=fast-start';script.onload=resolve;script.onerror=reject;document.head.append(script);});
   const [,environmentBlob]=await Promise.all([engine,fetch('assets/precision-ring-lighting.webp').then(response=>{if(!response.ok)throw new Error('Lighting unavailable');return response.blob();})]);
   ring=await SomaPrecisionRing.create(canvas,'satin',{environmentBlob,responsiveFraming:true});
   if(failed){ring.dispose();ring=null;return;}
   // The poster was rendered with this exact framing and initial phase. Replace it
   // atomically at phase zero, then begin rotating on the following animation frame.
   ring.seek(0);readyAt=performance.now();stage.classList.add('is-ready');sync();
   canvas.querySelector('canvas').addEventListener('webglcontextlost',event=>{event.preventDefault();fallback();},{once:true});
  }catch(error){failureReason=error.message;fallback();}finally{loading=false;}
 };
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();sync();},{rootMargin:'0px'});observer.observe(stage);
 document.addEventListener('visibilitychange',sync);
 reduce.addEventListener('change',sync);
 window.addEventListener('pagehide',stop);
 window.addEventListener('pageshow',sync);
 // Read-only state lets local QA verify the actual model, axis, camera, and lifecycle.
 window.somaRingState=()=>({ready:!!ring,failed,failureReason,visible,reduced:reduce.matches,running:!!frame,frameLimit,renderedFrames,readyAt,...ring?.state()});
})();
