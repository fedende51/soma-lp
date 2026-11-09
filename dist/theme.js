'use strict';
(() => {
 const key='soma-theme',root=document.documentElement;
 let theme='light';
 try{theme=localStorage.getItem(key)==='dark'?'dark':'light';}catch{}
 const updateButton=()=>{
  const button=document.querySelector('#theme-toggle');if(!button)return;
  const dark=theme==='dark',ja=root.lang==='ja';
  const label=ja?(dark?'ライトモードに切り替え':'ダークモードに切り替え'):(dark?'Switch to light mode':'Switch to dark mode');
  button.setAttribute('aria-label',label);button.setAttribute('title',label);
  button.setAttribute('aria-pressed',String(dark));
 };
 const apply=(value,persist=false)=>{
  theme=value==='dark'?'dark':'light';root.dataset.theme=theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#101719':'#ffffff');
  if(persist){try{localStorage.setItem(key,theme);}catch{}}
  updateButton();window.dispatchEvent(new CustomEvent('soma:theme',{detail:theme}));
 };
 // Run in the head, before styles paint, to restore a saved theme without a flash.
 apply(theme);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 if(window.CSS&&typeof CSS.registerProperty==='function')root.classList.add('theme-properties');
 let fallbackTimer=0;
 const switchTheme=(value,persist=false)=>{
  clearTimeout(fallbackTimer);
  if(reduce.matches){root.classList.remove('theme-transition');apply(value,persist);return;}
  // Blend palette tokens and the two original logo crops without snapshotting
  // the moving ring. The live WebGL render and both logo rotations keep their phase.
  root.classList.add('theme-transition');void root.offsetWidth;apply(value,persist);
  fallbackTimer=setTimeout(()=>root.classList.remove('theme-transition'),560);
 };
 const ready=()=>{
  const button=document.querySelector('#theme-toggle');if(!button)return;
  button.hidden=false;button.addEventListener('click',()=>switchTheme(theme==='dark'?'light':'dark',true));updateButton();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
 window.addEventListener('soma:language',updateButton);
 window.addEventListener('storage',event=>{if(event.key===key||event.key===null)switchTheme(event.newValue);});
 reduce.addEventListener('change',()=>{if(reduce.matches){clearTimeout(fallbackTimer);root.classList.remove('theme-transition');}});
})();
