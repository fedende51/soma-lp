'use strict';
(() => {
 const root=document.documentElement,revealFallback=()=>root.classList.remove('motion-intro');
 if(!window.gsap||!window.ScrollTrigger){revealFallback();return;}
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  const logo=(brand,trigger)=>{
   const outer=brand.querySelector('.ring-outer'),inner=brand.querySelector('.ring-inner'),name=brand.querySelector('.brand-name');
   if(!outer||!inner||!name)return;
   const tl=gsap.timeline({defaults:{ease:'power3.out'},...(trigger?{scrollTrigger:{trigger,start:'top 94%',once:true}}:{})});
   tl.fromTo(outer,{scale:0,rotation:-210,autoAlpha:0,svgOrigin:'700 593'},{scale:1,rotation:0,autoAlpha:1,duration:.88},0)
    .fromTo(inner,{scale:0,rotation:230,autoAlpha:0,svgOrigin:'700 593'},{scale:1,rotation:0,autoAlpha:1,duration:.9},.05)
    .fromTo(name,{autoAlpha:0,y:-6},{autoAlpha:1,y:0,duration:.32,clearProps:'opacity,visibility,transform'},.96);
   // Keep the original entrance, then continue the login's two slow rotations.
   // Create the loops inside matchMedia so reduced-motion changes revert them.
   let revealed=false;
   const spins=[
    gsap.to(outer,{rotation:'+=360',svgOrigin:'700 593',duration:24,ease:'none',repeat:-1,paused:true}),
    gsap.to(inner,{rotation:'-=360',svgOrigin:'700 593',duration:30,ease:'none',repeat:-1,paused:true})
   ];
   const visibility=ScrollTrigger.create({trigger:brand,start:'top bottom',end:'bottom top',
    onToggle:self=>spins.forEach(spin=>spin.paused(!revealed||!self.isActive))});
   tl.eventCallback('onComplete',()=>{revealed=true;spins.forEach(spin=>spin.paused(!visibility.isActive));});
   return tl;
  };
  logo(document.querySelector('.site-header .brand'));
  const entrance={y:-16,autoAlpha:0},settled={y:0,autoAlpha:1,duration:.62,ease:'power3.out',clearProps:'opacity,visibility,transform'};
  if(document.querySelector('.hero')){
  const intro=gsap.timeline();
  intro.fromTo('.hero .eyebrow',entrance,settled,.12)
   .fromTo('.hero h1',entrance,settled,.2)
   .fromTo('.hero-description',entrance,settled,.3)
   .fromTo('.hero-ctas,.hero-proof',entrance,{...settled,stagger:.08},.4)
   .fromTo('.hero-visual',entrance,{...settled,duration:.8},.18);
  }
  revealFallback();clearTimeout(window.somaIntroFallback);
  const section=(trigger,targets)=>{
   const elements=[...document.querySelectorAll(targets)];if(!document.querySelector(trigger)||!elements.length)return;
   gsap.fromTo(elements,entrance,{...settled,stagger:.09,scrollTrigger:{trigger,start:'top 91%',once:true}});
  };
  section('.film-heading','.film-section .section-label,.film-heading h2,.film-heading p');
  section('#film-player','#film-player');
  section('.stage-top','.stage-top .mono,.stage-top h2,.stage-note');
  section('.product-capabilities','.product-summary,.capability-list li');
  section('.approach-grid','.approach-grid h2,.approach-grid>div>p,.principle');
  section('.knowledge','.knowledge-visual,.knowledge-copy>.mono,.knowledge-copy h2,.knowledge-copy p,.knowledge-copy>.text-link');
  section('.details-grid','.details-grid h2,.details-list details');
  section('.cta-grid','.cta-grid h2,.cta-grid p,.cta-grid .button,.cta-grid .contact-email');
  logo(document.querySelector('footer .brand'),'footer .brand');
 });
 mm.add('(prefers-reduced-motion: reduce)',revealFallback);
})();
