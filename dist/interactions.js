'use strict';
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),items=[];
 for(const details of document.querySelectorAll('.details-list details')){
  const summary=details.querySelector('summary'),paragraph=details.querySelector('p');
  if(!summary||!paragraph||!window.gsap)continue;
  const answer=document.createElement('div');answer.className='faq-answer';paragraph.before(answer);answer.append(paragraph);
  details.classList.add('faq-enhanced');
  let expanded=details.open,timeline=null;
  const state=()=>{details.dataset.expanded=String(expanded);summary.setAttribute('aria-expanded',String(expanded));};
  const finish=()=>{
   timeline?.kill();timeline=null;details.open=expanded;answer.inert=!expanded;
   gsap.set(details,{clearProps:'height,overflow'});gsap.set(answer,{clearProps:'opacity,transform'});state();
   // Only animations after this disclosure changed position. A global refresh
   // temporarily scrolls the entire document to zero, which can strand mobile
   // browsers at the top. Unpinned instance refreshes do not reset the scroller.
   const scrollTrigger=window.ScrollTrigger;
   scrollTrigger?.getAll().forEach(trigger=>{
    if(trigger.trigger instanceof Node&&(details.compareDocumentPosition(trigger.trigger)&Node.DOCUMENT_POSITION_FOLLOWING))trigger.refresh();
   });
   scrollTrigger?.update();
  };
  const toggle=()=>{
   const from=details.getBoundingClientRect().height;
   timeline?.kill();expanded=!expanded;state();
   if(reduce.matches){finish();return;}
   // A single measured disclosure reflows its following rows while its text fades down.
   details.open=true;answer.inert=!expanded;
   const style=getComputedStyle(details),closed=summary.getBoundingClientRect().height+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom)+parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
   details.style.height='auto';const to=expanded?details.getBoundingClientRect().height:closed;
   gsap.set(details,{height:from,overflow:'hidden'});
   const wasHidden=getComputedStyle(answer).opacity==='0'||from<=closed+1;
   if(expanded&&wasHidden)gsap.set(answer,{opacity:0,y:-8});
   timeline=gsap.timeline({onComplete:finish});
   timeline.to(details,{height:to,duration:expanded?.34:.26,ease:expanded?'power3.out':'power2.inOut'},0)
    .to(answer,{opacity:expanded?1:0,y:expanded?0:-6,duration:expanded?.28:.18,ease:expanded?'power2.out':'power2.in'},expanded?.04:0);
  };
  summary.addEventListener('click',event=>{event.preventDefault();toggle();});
  // Preserve native keyboard activation, details semantics, and the no-JavaScript fallback.
  details.addEventListener('toggle',()=>{if(!timeline){expanded=details.open;state();answer.inert=!expanded;}});
  state();answer.inert=!expanded;items.push({finish,active:()=>!!timeline});
 }
 const settle=()=>items.filter(item=>item.active()).forEach(item=>item.finish());
 window.addEventListener('soma:language',settle);
 window.addEventListener('resize',settle,{passive:true});
 reduce.addEventListener('change',()=>{if(reduce.matches)settle();});
})();
