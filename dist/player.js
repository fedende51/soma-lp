'use strict';
(() => {
 const video=document.querySelector('#launch-video');
 const player=document.querySelector('#film-player');
 if(!video||!player)return;
 if(matchMedia('(max-width:640px)').matches)video.poster='assets/film-poster-portrait.jpg?v=original-wordmark-gradient';
 const $=s=>player.querySelector(s),icons=window.SomaIcons;
 const toggle=$('#film-toggle'),mute=$('#film-mute'),captions=$('#film-captions'),fullscreen=$('#film-fullscreen'),progress=$('#film-progress'),start=$('#open-film');
 let captioned=false,started=false,hideTimer,lastPointerType='mouse';
 const ja=()=>document.documentElement.lang==='ja';
 const text=(en,jp)=>ja()?jp:en;
 const format=n=>`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`;
 function update(){
  const playing=!video.paused&&!video.ended;
  if(playing)started=true;
  player.classList.toggle('has-started',started);
  player.classList.toggle('finished',video.ended);
  player.classList.toggle('playing',playing);
  toggle.innerHTML=icons[playing?'pause':'play'];
  toggle.setAttribute('aria-label',text(playing?'Pause film':'Play film',playing?'動画を一時停止':'動画を再生'));
  start.setAttribute('aria-label',text(video.ended?'Replay SOMA launch film':'Play SOMA launch film',video.ended?'紹介動画をもう一度再生':'紹介動画を再生'));
  start.querySelector('[data-i18n=playFilm]').textContent=text(video.ended?'Replay the launch film':'Play the launch film',video.ended?'紹介動画をもう一度再生':'紹介動画を再生');
  $('.film-controls').setAttribute('aria-label',text('Film playback controls','動画の再生コントロール'));
  mute.innerHTML=icons[video.muted?'volume-x':'volume-2'];
  mute.setAttribute('aria-label',text(video.muted?'Unmute film':'Mute film',video.muted?'音声をオン':'音声をミュート'));
  captions.setAttribute('aria-label',text(captioned?'Hide captions':'Show captions',captioned?'字幕を非表示':'字幕を表示'));
  captions.setAttribute('aria-pressed',String(captioned));
  fullscreen.setAttribute('aria-label',text(document.fullscreenElement?'Exit fullscreen':'Enter fullscreen',document.fullscreenElement?'全画面を終了':'全画面で表示'));
  fullscreen.innerHTML=icons[document.fullscreenElement?'minimize':'maximize'];
  progress.setAttribute('aria-label',text('Video progress','動画の再生位置'));
  if(Number.isFinite(video.duration))progress.max=String(video.duration);
  progress.value=String(video.currentTime||0);
  progress.style.setProperty('--progress',`${100*(video.currentTime||0)/(video.duration||32)}%`);
  progress.setAttribute('aria-valuetext',text(`${format(video.currentTime||0)} of ${format(video.duration||32)}`,`${format(video.duration||32)}中 ${format(video.currentTime||0)}`));
  $('#film-elapsed').textContent=format(video.currentTime||0);
 }
 function updateTracks(){for(const track of video.querySelectorAll('track'))track.track.mode=captioned&&track.srclang===(ja()?'ja':'en')?'showing':'disabled';}
 async function play(){
  if(video.ended)video.currentTime=0;
  $('#film-message').hidden=true;
  try{await video.play();}catch{
   $('#film-message').textContent=text('Playback could not start. Please try Play again.','再生できませんでした。もう一度再生をお試しください。');
   $('#film-message').hidden=false;
  }
 }
 function togglePlay(){if(video.paused||video.ended)play();else video.pause();}
 function revealControls(){
  clearTimeout(hideTimer);player.classList.add('controls-active');
  if(!video.paused&&!video.ended)hideTimer=setTimeout(()=>player.classList.remove('controls-active'),2200);
 }
 start.addEventListener('click',event=>{play();if(event.detail===0)video.focus({preventScroll:true});else start.blur();});
 toggle.addEventListener('click',togglePlay);
 player.addEventListener('pointerdown',event=>{lastPointerType=event.pointerType;});
 player.addEventListener('pointermove',event=>{if(event.pointerType!=='touch')revealControls();});
 player.addEventListener('pointerleave',()=>{if(!video.paused)player.classList.remove('controls-active');});
 player.addEventListener('focusin',revealControls);
 video.addEventListener('click',()=>{if(lastPointerType==='touch'&&!video.paused)revealControls();else togglePlay();});
 video.addEventListener('keydown',event=>{
  if(event.key===' '||event.key==='Enter'){event.preventDefault();togglePlay();revealControls();}
  else if((event.key==='ArrowLeft'||event.key==='ArrowRight')&&video.readyState>0){event.preventDefault();video.currentTime=Math.max(0,Math.min(video.duration||32,video.currentTime+(event.key==='ArrowRight'?5:-5)));revealControls();}
 });
 progress.addEventListener('input',()=>{if(video.readyState>0){video.currentTime=Number(progress.value);update();}});
 mute.addEventListener('click',()=>{video.muted=!video.muted;update();});
 captions.addEventListener('click',()=>{captioned=!captioned;updateTracks();update();});
 fullscreen.addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else if(player.requestFullscreen)await player.requestFullscreen();else if(video.webkitEnterFullscreen)video.webkitEnterFullscreen();}catch{}
 });
 if(!player.requestFullscreen&&!video.webkitEnterFullscreen)fullscreen.hidden=true;
 for(const event of ['play','pause','ended','timeupdate','loadedmetadata','volumechange'])video.addEventListener(event,update);
 video.addEventListener('play',revealControls);
 video.addEventListener('pause',()=>{clearTimeout(hideTimer);});
 video.addEventListener('loadedmetadata',updateTracks);document.addEventListener('fullscreenchange',update);
 window.addEventListener('soma:language',()=>{updateTracks();update();});
 // Without JavaScript, the video retains its native controls.
 video.controls=false;$('.film-controls').hidden=false;player.classList.add('enhanced');update();updateTracks();
})();
