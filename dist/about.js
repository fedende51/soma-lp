'use strict';
window.somaPageJapanese = {
 aboutKicker:'SOMA / 会社紹介',
 aboutTitle:'小さなチーム。<br><span class="about-accent">ひとつの想い。</span>',
 aboutLead:"SOMAは、AIエージェントを中心に事業を運営する会社です。3人の創業者が経営・プロダクト・技術の視点を持ち寄り、複雑な仕事を支える実用的なソフトウェアをつくっています。",
 aboutExplore:'私たちのストーリー ↓',
 aboutPerspectives:'3つの視点。ひとつの会社。',
 aboutIndexStory:'ストーリー', aboutIndexPurpose:'ミッションとビジョン',aboutIndexCustomers:'お客様',aboutIndexCompany:'会社概要',aboutIndexFaq:'よくある質問',
 aboutStoryLabel:'私たちのストーリー',aboutStoryTitle:'仕事を理解することから、<br>ソフトウェアづくりは始まる。',
 aboutStoryOne:"3人の創業者が立ち上げた、AIエージェントを中心に動く会社。それがSOMAです。人が方向性を定め、AIエージェントとともに、実際の仕事に寄り添うソフトウェアをつくります。",
 aboutStoryTwo:"SOMAでは、AIエージェントが会社の運営やソフトウェア開発に関わっています。創業者は経営・プロダクト・技術の方向性を担い、複雑な仕事をわかりやすくすることに取り組んでいます。",
 aboutStoryThree:'SOMA Schedulerでは、まず精密加工の生産計画に取り組んでいます。工程・設備・稼働時間を見渡し、変化に応じて計画を調整できるように。',
 aboutBusiness:'経営',aboutBusinessCopy:'会社の方向性と、お客様との関係を育てる。',aboutTechnology:'技術',aboutTechnologyCopy:'信頼できる基盤をつくり、使いやすさを支える。',aboutProduct:'プロダクト',aboutProductCopy:'お客様の課題を捉え、取り組むべきことを明確にする。',
 aboutPurposeLabel:'ミッションとビジョン',aboutMissionLabel:'ミッション',aboutMission:"AIエージェントとともに実用的なソフトウェアをつくり、複雑な仕事をわかりやすくする。人が主導権を持ち、納得して判断できるように。",aboutVisionLabel:'ビジョン',aboutVision:"人とAIエージェントがともに働き、現場の知識を受け継ぎながら、一人ひとりが確かな判断をできる未来へ。",
 aboutCustomersLabel:'信頼を寄せてくださるお客様',aboutCustomerName:"Nippo K.K.",aboutCustomerTag:'お客様',
 aboutCompanyLabel:'会社概要',aboutNameLabel:'会社名',aboutLegalName:'株式会社SOMA',aboutEnglishName:'SOMA Co., Ltd.',aboutTypeLabel:'会社形態',aboutType:'株式会社',aboutFoundersLabel:'創業者',aboutFounders:'3名の共同創業者',aboutFoundersNote:"Luis P · CTO<br>Steven L · CEO<br>Federico M · CPO",aboutEstablishedLabel:'設立',aboutOfferingLabel:'主な事業',aboutOffering:"AIエージェントを活用したソフトウェア開発",aboutOfferingNote:'精密加工の生産計画ツール SOMA Scheduler',aboutContactLabel:'お問い合わせ',
 aboutFaqLabel:'会社についてのご質問',aboutFaqTitle:'SOMAを、<br><span>もう少し詳しく。</span>',
 aboutFaqWhat:'SOMAとは、どのような会社ですか？',aboutFaqWhatCopy:"SOMAは、Luis P（CTO）、Steven L（CEO）、Federico M（CPO）が創業した、AIエージェントを中心に事業を運営する会社です。人が仕事を見渡し、納得して判断するための実用的なソフトウェアをつくっています。",
 aboutFaqWhere:'SOMAの所在地を教えてください。',aboutFaqWhereCopy:'会社の所在地やお打ち合わせについては、<a href="mailto:hello@somakk.com">hello@somakk.com</a> までお問い合わせください。',
 aboutFaqProduct:'どのような製品をつくっていますか？',aboutFaqProductCopy:'SOMA Schedulerは、精密加工のための生産計画ツールです。部品の工程を蓄積し、設備と稼働時間に合わせて仕事を配置。変更時も、計画担当者が確認しながら調整できます。',
 aboutFaqPeople:'どのような方に向けた製品ですか？',aboutFaqPeopleCopy:'Schedulerは、生産計画を担当する方や、加工の工程・設備・所要時間を決める技術者の方に向けてつくっています。',
 aboutFaqContact:'相談やデモを申し込むには？',aboutFaqContactCopy:'<a href="mailto:hello@somakk.com">hello@somakk.com</a> へご連絡いただくか、下の「デモを予約」からご希望の日時をお知らせください。空き状況を確認し、メールでご連絡します。',
 aboutCEO:'最高経営責任者',aboutCPO:'最高プロダクト責任者',aboutCTO:'最高技術責任者',
 aboutFaqAgentic:'SOMAにおける「AIエージェント主体」とは？',aboutFaqAgenticCopy:'SOMAの会社運営やソフトウェア開発の進め方を表しています。AIエージェントが業務に関わり、3人の創業者が経営・プロダクト・技術の方向性を担います。',
 aboutCloseTitle:'あなたの仕事について、<br><span>聞かせてください。</span>'
};

const updateAboutSemantics=()=>{
 const japanese=document.documentElement.lang==='ja';
 document.querySelector('#founders').setAttribute('aria-label',japanese?'SOMAの共同創業者':'SOMA co-founders');
 document.querySelector('.about-index').setAttribute('aria-label',japanese?'このページの内容':'On this page');
 document.querySelector('.skip-link').textContent=japanese?'本文へスキップ':'Skip to content';
 document.querySelector('[data-i18n="aboutEnglishName"]').lang=japanese?'en':'ja';
};
window.addEventListener('soma:language',updateAboutSemantics);
document.addEventListener('DOMContentLoaded', () => {
 updateAboutSemantics();
 if(!window.gsap || !window.ScrollTrigger)return;
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  const reveal={y:-14,autoAlpha:0};
  const settle={y:0,autoAlpha:1,duration:.62,ease:'power3.out',clearProps:'opacity,visibility,transform'};
  gsap.fromTo('.about-hero-copy>*',reveal,{...settle,stagger:.08});
  gsap.fromTo('.about-emblem',reveal,{...settle,delay:.12,duration:.8});
  document.querySelectorAll('.about-section,.about-close').forEach(section=>{
   gsap.fromTo([...section.children],reveal,{...settle,stagger:.09,scrollTrigger:{trigger:section,start:'top 91%',once:true}});
  });
 });
});
