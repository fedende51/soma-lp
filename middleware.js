// Password gate for the whole site (Vercel Routing Middleware, runs before static files).
//
// Visitors without a valid cookie get the "Coming soon" page with a password field on
// every URL. The correct password sets an HttpOnly cookie and lets them through to the
// site in dist/. The password lives only in the SITE_PASSWORD environment variable on
// Vercel; if it is not set, nobody can get in (the gate fails closed).

const COOKIE = 'soma_gate';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Files the gate page itself needs before the visitor is signed in.
const PUBLIC_PATHS = new Set([
  '/assets/logo_soma_light.png',
  '/assets/favicon.png',
  '/assets/apple-touch-icon.png',
  '/assets/manrope.woff2',
]);

export const config = { matcher: '/:path*' };

export default async function middleware(request) {
  const url = new URL(request.url);
  if (PUBLIC_PATHS.has(url.pathname)) return pass();

  const password = process.env.SITE_PASSWORD || '';
  if (!password) console.error('SITE_PASSWORD is not set; the site is locked for everyone.');
  const token = password ? await tokenFor(password) : '';

  if (token && safeEqual(readCookie(request, COOKIE), token)) return pass();

  if (request.method === 'POST') {
    let attempt = '';
    try {
      const form = await request.formData();
      attempt = String(form.get('password') ?? '').slice(0, 128);
    } catch {
      /* not a form post: treat as a wrong password */
    }
    if (token && attempt && safeEqual(await tokenFor(attempt), token)) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: url.pathname + url.search,
          'Set-Cookie': `${COOKIE}=${token}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`,
          'Cache-Control': 'no-store',
        },
      });
    }
    return gate(url, true);
  }

  return gate(url, false);
}

/** Let the request continue to the static site. */
function pass() {
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

async function tokenFor(secret) {
  const data = new TextEncoder().encode(`soma-gate:v1:${secret}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length || !a) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function readCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return '';
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function gate(url, failed) {
  return new Response(gatePage(escapeHtml(url.pathname + url.search), failed), {
    status: 401,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}

function gatePage(action, failed) {
  const error = failed
    ? '<p class="error" id="error" role="alert">That password is incorrect. Please try again.</p>'
    : '';
  const invalid = failed ? ' aria-invalid="true" aria-describedby="error"' : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#ffffff">
<meta name="robots" content="noindex,nofollow">
<title>SOMA · Coming soon</title>
<link rel="icon" type="image/png" sizes="64x64" href="/assets/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png">
<style>
@font-face{font-family:Manrope;src:url('/assets/manrope.woff2') format('woff2');font-weight:200 800;font-display:swap}
*{box-sizing:border-box}
html,body{margin:0;background:#fff}
body{color:#07344d;font:16px/1.65 Manrope,Arial,sans-serif;-webkit-font-smoothing:antialiased}
body:before{content:"";position:fixed;inset:0;z-index:-1;pointer-events:none;background-image:radial-gradient(ellipse at 0 50%,#1ba5df30 0%,#0e618b0d 40%,transparent 72%),radial-gradient(ellipse at 100% 50%,#03c2b02b 0%,#77e4d90a 40%,transparent 72%);background-size:42% 100%;background-position:left center,right center;background-repeat:no-repeat}
main{min-height:100svh;min-height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(24px,4.5svh,48px);padding:32px 16px;text-align:center;isolation:isolate}
.brand{--w:clamp(160px,min(28svh,56vw),300px);display:flex;flex-direction:column;align-items:center;width:var(--w);gap:calc(var(--w)*64/1193);line-height:1}
.rings{display:block;width:calc(var(--w)*742/1193);height:calc(var(--w)*730/1193);overflow:visible}
.name{display:block;width:100%;height:calc(var(--w)*147/1193);overflow:hidden}
.ring{transform-origin:700px 593px}.outer{animation:orbit 24s linear infinite}.inner{animation:orbit 30s linear infinite reverse}
@keyframes orbit{to{transform:rotate(360deg)}}
h1{margin:0;font-size:clamp(44px,10vw,120px);line-height:1;font-weight:500;letter-spacing:-.05em}
h1 span{background:linear-gradient(90deg,#0a3d57 0%,#0e618b 23.6%,#0b7ea9 50.2%,#007f75 84.2%,#19877c 100%);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.06em}
form{width:100%;max-width:360px}
label{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
input{display:block;width:100%;height:52px;border:1px solid #7693a3;background:#fff;color:#07344d;border-radius:6px;font:16px/1.4 Manrope,Arial,sans-serif;padding:10px 14px;text-align:center;box-shadow:0 4px 24px #0a3d5705}
input::placeholder{color:#7693a3}
input[aria-invalid=true]{border-color:#a32c24}
button{position:relative;display:block;width:100%;min-height:52px;margin-top:12px;border:0;border-radius:6px;padding:14px 48px;background:linear-gradient(90deg,#86b5ce 0%,#6eb9dd 23.6%,#55c3ec 50.2%,#48d2c0 84.2%,#77e4d9 100%);color:#0a3d57;font:600 14px/1.5 Manrope,Arial,sans-serif;cursor:pointer;transition:filter .15s,transform .15s}
button:hover{filter:brightness(1.04);transform:translateY(-1px)}button:active{transform:translateY(1px)}
button svg{position:absolute;right:20px;top:50%;transform:translateY(-50%);width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.75;stroke-linecap:round;stroke-linejoin:round}
:focus-visible{outline:3px solid #086b9c;outline-offset:4px}
.error{color:#a32c24;font-size:13px;line-height:1.4;margin:10px 0 0}
@media(max-width:640px){body:before{background-size:32% 100%}}
@media(max-height:600px){.brand{--w:120px}h1{font-size:40px}main{gap:18px}}
@media(prefers-reduced-motion:reduce){.ring{animation:none}button{transition:none}}
</style>
</head>
<body>
<main>
  <div class="brand" role="img" aria-label="SOMA">
    <svg class="rings" viewBox="330 228 742 730" aria-hidden="true" focusable="false">
      <defs>
        <image id="art" href="/assets/logo_soma_light.png" width="1400" height="1400"/>
        <clipPath id="clip-inner"><circle cx="700" cy="593" r="320"/></clipPath>
        <clipPath id="clip-outer"><path clip-rule="evenodd" d="M320 220H1080V966H320Z M1020 593a320 320 0 1 0-640 0a320 320 0 1 0 640 0Z"/></clipPath>
      </defs>
      <g class="ring outer" clip-path="url(#clip-outer)"><use href="#art"/></g>
      <g class="ring inner" clip-path="url(#clip-inner)"><use href="#art"/></g>
    </svg>
    <svg class="name" viewBox="104 1022 1193 147" aria-hidden="true" focusable="false"><use href="#art"/></svg>
  </div>
  <h1>Coming <span>soon</span></h1>
  <form method="post" action="${action}">
    <label for="password">Password</label>
    <input id="password" name="password" type="password" placeholder="Password" autocomplete="current-password" required maxlength="128" autofocus${invalid}>
    <button type="submit">Enter<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg></button>
    ${error}
  </form>
</main>
</body>
</html>`;
}
