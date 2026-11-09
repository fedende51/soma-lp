<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#ffffff"><meta name="robots" content="noindex,nofollow"><title>SOMA - Private preview</title>
<script><?= $themeScript ?></script>
<link rel="icon" data-soma-favicon type="image/png" sizes="64x64" href="<?= esc($home) ?>assets/favicon.png?v=rings-only">
<link rel="apple-touch-icon" sizes="180x180" href="<?= esc($home) ?>assets/apple-touch-icon.png?v=rings-only">
<style>
@font-face{font-family:Manrope;src:url('data:font/woff2;base64,<?= $mainFont ?>') format('woff2');font-weight:200 800;font-display:swap}
@font-face{font-family:'IBM Plex Sans';src:url('data:font/woff2;base64,<?= $footerFont ?>') format('woff2');font-weight:500;font-display:swap}
:root{--color-surface:#fff;--color-raised:#fff;--color-text:#07344d;--color-muted:#536976;--color-border:#d5e4ed;--input-border:#7693a3;--color-teal-text:#086b9c;--brand-light-text-spectrum:linear-gradient(90deg,#b8d5e4 0%,#92d2ee 23.6%,#74d4f8 50.2%,#5ee2cf 84.2%,#b6f0e7 100%)}
<?= $themeStyles ?>
*{box-sizing:border-box}body{margin:0;background:var(--color-surface);color:var(--color-text);font:16px/1.65 Manrope,Arial,sans-serif;-webkit-font-smoothing:antialiased}
body:before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background-image:radial-gradient(ellipse at 0 50%,#1ba5df30 0%,#0e618b0d 40%,transparent 72%),radial-gradient(ellipse at 100% 50%,#03c2b02b 0%,#77e4d90a 40%,transparent 72%);background-size:42% 100%;background-position:left center,right center;background-repeat:no-repeat}
html[data-theme=dark] body:before{background-image:radial-gradient(ellipse at 0 50%,#1ba5df42 0%,#0e618b14 40%,transparent 72%),radial-gradient(ellipse at 100% 50%,#03c2b038 0%,#77e4d90d 40%,transparent 72%)}
main{min-height:100svh;min-height:100dvh;display:flex;flex-direction:column;padding:clamp(52px,7svh,72px) 24px clamp(10px,2svh,20px);isolation:isolate}
.login-tools{position:absolute;top:clamp(12px,2.5svh,24px);right:clamp(16px,2.4vw,32px)}.theme-toggle{cursor:pointer}
.entry{width:100%;max-width:480px;margin:auto;text-align:center;padding:clamp(4px,1svh,12px) 0}
/* Preserve the original stacked artwork's proportions and 64px source gap. */
.login-brand{--login-logo-width:clamp(112px,19svh,180px);display:flex;flex-direction:column;align-items:center;justify-content:center;width:var(--login-logo-width);gap:calc(var(--login-logo-width) * 64 / 1193);line-height:1;margin:0 auto clamp(14px,2.8svh,28px)}
.brand-rings{display:block;width:calc(var(--login-logo-width) * 742 / 1193);height:calc(var(--login-logo-width) * 730 / 1193);flex:none;overflow:visible}.brand-name{display:block;width:100%;height:calc(var(--login-logo-width) * 147 / 1193);overflow:hidden;flex:none}
.logo-ring{transform-origin:700px 593px}.ring-outer{animation:login-orbit 24s linear infinite}.ring-inner{animation:login-orbit 30s linear infinite reverse}
@keyframes login-orbit{to{transform:rotate(360deg)}}
.theme-transition .login-brand use{transition:opacity .46s cubic-bezier(.4,0,.2,1)}
h1{font-size:clamp(32px,5.8svh,54px);line-height:1.08;font-weight:500;letter-spacing:-.045em;margin:0 0 clamp(14px,2.2svh,20px);text-wrap:balance}
h1 span{background:var(--brand-text-spectrum,linear-gradient(90deg,#0a3d57,#0e618b 23.6%,#0b7ea9 50.2%,#007f75 84.2%,#19877c));background-clip:text;-webkit-background-clip:text;color:transparent}
.copy{color:var(--color-muted);margin:0 0 clamp(16px,3svh,24px);font-size:14px;line-height:1.65}.copy span{display:block;font-size:12px;margin-top:6px;text-wrap:balance}
form{max-width:360px;margin-inline:auto}label{display:block;font-size:13px;font-weight:500;margin-bottom:8px}input{display:block;width:100%;height:52px;border:1px solid var(--input-border);background:var(--color-raised);color:var(--color-text);border-radius:6px;font:16px/1.4 Manrope,Arial,sans-serif;padding:10px 14px;text-align:center;box-shadow:0 4px 24px #0a3d5705}
.enter-button{position:relative;display:block;width:100%;min-height:52px;margin-top:12px;border:0;border-radius:6px;padding:14px 48px;background:linear-gradient(90deg,#86b5ce 0%,#6eb9dd 23.6%,#55c3ec 50.2%,#48d2c0 84.2%,#77e4d9 100%);color:#0a3d57;font:600 14px/1.5 Manrope,Arial,sans-serif;cursor:pointer;transition:filter .15s,transform .15s}
.enter-button:hover{filter:brightness(1.04);transform:translateY(-1px)}.enter-button:active{transform:translateY(1px)}.enter-button svg{position:absolute;right:20px;top:50%;transform:translateY(-50%);width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
:focus-visible{outline:3px solid var(--color-teal-text);outline-offset:4px}.note{font-size:12px;color:var(--color-muted);margin:14px 0 0}.error{color:#a32c24;font-size:12px;line-height:1.4;margin:8px 0 0}html[data-theme=dark] .error{color:#ffb4a7}
footer{text-align:center;color:var(--color-muted);font:500 12px/1.5 'IBM Plex Sans',Arial,sans-serif;padding:4px 0 0}
@media(max-width:640px){.login-brand{--login-logo-width:clamp(112px,18svh,164px)}h1{font-size:clamp(32px,5.8svh,44px)}body:before{background-size:32% 100%}}
/* Fit short browser windows by reducing space and type, rather than clipping. */
@media(max-height:720px){
 main{padding:52px 20px 10px}.login-tools{top:12px}.entry{padding:4px 0 8px}
 .login-brand{--login-logo-width:112px;margin-bottom:14px}h1{font-size:32px;margin-bottom:14px}
 .copy{font-size:13px;line-height:1.55;margin-bottom:16px}.copy span{margin-top:4px}
 label{font-size:12px;line-height:1.5;margin-bottom:6px}input{height:48px}
 .enter-button{min-height:48px;padding-block:12px;margin-top:10px}.note{margin-top:10px;line-height:1.5}
 footer{font-size:11px}
}
@media(max-height:520px){
 main{padding-bottom:8px}.entry{padding:0}.login-brand{--login-logo-width:88px;margin-bottom:10px}
 h1{font-size:28px;margin-bottom:10px}.copy{font-size:12px;line-height:1.5;margin-bottom:12px}
 input{height:44px;line-height:1.25}.enter-button{min-height:44px;padding-block:10px;margin-top:8px}.note{margin-top:8px}
 .entry:has(.error) .login-brand{--login-logo-width:72px;margin-bottom:8px}
 .entry:has(.error) h1{font-size:26px;margin-bottom:8px}
}
/* Landscape phones and short desktop panels place the form beside the intro. */
@media(max-height:540px) and (min-width:480px){
 .entry{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:32px;max-width:800px;padding:0}
 .login-brand{grid-column:1;grid-row:1;--login-logo-width:96px;margin-bottom:10px}
 h1{grid-column:1;grid-row:2;font-size:28px;margin-bottom:10px}
 .copy{grid-column:1;grid-row:3;font-size:12px;line-height:1.5;margin:0}
 form{grid-column:2;grid-row:1/4;width:100%;align-self:center}
}
@media(prefers-reduced-motion:reduce){.logo-ring{animation:none}.enter-button{transition:none}}
</style></head><body>
<main>
<div class="login-tools"><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Switch to dark mode" aria-pressed="false" hidden><svg class="theme-moon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.5 13.1A8.7 8.7 0 0 1 10.9 3.5a8.7 8.7 0 1 0 9.6 9.6Z"/></svg><svg class="theme-sun" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></button></div>
<section class="entry" aria-labelledby="title">
<div class="login-brand brand" role="img" aria-label="SOMA"><svg class="brand-rings" viewBox="330 228 742 730" width="52" height="52" aria-hidden="true" focusable="false"><defs><image id="login-art-light" href="data:image/png;base64,<?= $brandLight ?>" width="1400" height="1400"/><image id="login-art-dark" href="data:image/png;base64,<?= $brandDark ?>" width="1400" height="1400"/><clipPath id="login-inner"><circle cx="700" cy="593" r="320"/></clipPath><clipPath id="login-outer"><path clip-rule="evenodd" d="M320 220H1080V966H320Z M1020 593a320 320 0 1 0-640 0a320 320 0 1 0 640 0Z"/></clipPath></defs><g class="logo-ring ring-outer" clip-path="url(#login-outer)"><use class="logo-art-light" href="#login-art-light"/><use class="logo-art-dark" href="#login-art-dark"/></g><g class="logo-ring ring-inner" clip-path="url(#login-inner)"><use class="logo-art-light" href="#login-art-light"/><use class="logo-art-dark" href="#login-art-dark"/></g></svg><svg class="brand-name" viewBox="104 1022 1193 147" width="190" height="24" aria-hidden="true" focusable="false"><use class="logo-art-light" href="#login-art-light"/><use class="logo-art-dark" href="#login-art-dark"/></svg></div>
<h1 id="title">A closer look.<br><span>By invitation.</span></h1>
<p class="copy">Enter your password to explore SOMA.<span lang="ja">パスワードを入力して、SOMAをご覧ください。</span></p>
<form method="post" action="<?= esc($home) ?>?soma_action=login">
<input type="hidden" name="csrf" value="<?= $csrf ?>"><input type="hidden" name="next" value="<?= $next ?>">
<label for="password">Password / <span lang="ja">パスワード</span></label>
<input id="password" name="password" type="password" autocomplete="current-password" required maxlength="128" <?= $error !== '' ? 'aria-invalid="true" aria-describedby="error"' : '' ?>>
<?php if ($error !== ''): ?><p class="error" id="error" role="alert"><?= esc($error) ?></p><?php endif ?>
<button class="enter-button" type="submit">Enter SOMA<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 7h10v10M7 17 17 7"/></svg></button>
<p class="note">Private access · <span lang="ja">プライベートアクセス</span></p>
</form></section>
<footer>© <?= date('Y') ?> SOMA Co., Ltd.</footer>
</main><script><?= $faviconScript ?></script></body></html>
