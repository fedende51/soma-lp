<?php
declare(strict_types=1);

$private = dirname(__DIR__, 2) . '/soma-private';
$config = require $private . '/config.php';
$base = rtrim($config['base_path'], '/');
$home = $base . '/';
$local = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true);
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || ($config['trust_proxy_https'] && ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
header('Cache-Control: private, no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('Referrer-Policy: same-origin');
header('X-Robots-Tag: noindex, nofollow, noarchive');
if ($config['require_https'] && !$https && !$local) {
    http_response_code(403);
    exit('Please open this website using HTTPS.');
}
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.use_trans_sid', '0');
session_name('SOMA_ACCESS');
session_set_cookie_params(['lifetime' => 0, 'path' => $home, 'secure' => $https,
    'httponly' => true, 'samesite' => 'Lax']);
session_start();
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
if (isset($_SESSION['expires']) && $_SESSION['expires'] <= time()) {
    unset($_SESSION['expires']);
}
$request = $_SERVER['REQUEST_URI'] ?? $home;
$path = rawurldecode(parse_url($request, PHP_URL_PATH) ?: '/');
if ($base !== '' && $path === $base && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = parse_url($request, PHP_URL_QUERY);
    header('Location: ' . $home . ($query ? '?' . $query : ''), true, 308); exit;
}
if ($base !== '' && !str_starts_with($path, $home) && $path !== $base) {
    http_response_code(404); exit('Not found.');
}
$relative = ltrim(substr($path, strlen($base)), '/');
$isPage = $relative === '' || $relative === 'index.php' || $relative === 'index.html';
$isPageRequest = $isPage || $relative === 'about.html';
// These two brand-only images must also work in browser icon fetchers that
// do not share page credentials. No other private asset is made public.
$publicIcons = ['assets/favicon.png' => 'favicon.png', 'assets/apple-touch-icon.png' => 'apple-touch-icon.png'];
if (isset($publicIcons[$relative]) && in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) {
    $iconFile = $private . '/site/assets/' . $publicIcons[$relative];
    header('Content-Type: image/png');
    header('Content-Length: ' . filesize($iconFile));
    if ($_SERVER['REQUEST_METHOD'] !== 'HEAD') readfile($iconFile);
    exit;
}
$action = $_GET['soma_action'] ?? '';
$error = '';
function esc(string $text): string { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
function csrfValid(): bool {
    return isset($_POST['csrf']) && is_string($_POST['csrf']) && hash_equals($_SESSION['csrf'], $_POST['csrf']);
}
function rateFile(string $private, array $config) {
    $dir = $private . '/runtime';
    if (!is_dir($dir)) @mkdir($dir, 0700, true);
    $key = hash_hmac('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown', $config['rate_key']);
    $handle = @fopen($dir . '/' . $key . '.json', 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) {
        http_response_code(503); exit('Access is temporarily unavailable. Please contact SOMA.');
    }
    return $handle;
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrfValid()) {
        http_response_code(403); $error = 'Your session changed. Please try again.';
    } elseif ($action === 'logout') {
        $_SESSION = [];
        session_regenerate_id(true);
        header('Location: ' . $home, true, 303); exit;
    } elseif ($action === 'login') {
        $handle = rateFile($private, $config);
        $rate = json_decode(stream_get_contents($handle) ?: '{}', true) ?: [];
        if (($rate['until'] ?? 0) <= time()) $rate = ['failures' => 0, 'until' => time() + 900];
        if (($rate['failures'] ?? 0) >= 5) {
            http_response_code(429); header('Retry-After: ' . max(1, $rate['until'] - time()));
            $error = 'Too many attempts. Please try again in 15 minutes.';
        } elseif (is_string($_POST['password'] ?? null) && strlen($_POST['password']) <= 128
            && password_verify($_POST['password'], $config['password_hash'])) {
            ftruncate($handle, 0); fflush($handle); flock($handle, LOCK_UN); fclose($handle);
            session_regenerate_id(true);
            $_SESSION['expires'] = time() + $config['session_seconds'];
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
            $next = $_POST['next'] ?? $home;
            if (!is_string($next) || !str_starts_with($next, $home) || str_starts_with($next, '//')
                || preg_match('/[\x00-\x20\\\\]/', $next) || str_contains($next, 'soma_action=')) $next = $home;
            header('Location: ' . $next, true, 303); exit;
        } else {
            $rate['failures'] = ($rate['failures'] ?? 0) + 1;
            rewind($handle); ftruncate($handle, 0); fwrite($handle, json_encode($rate)); fflush($handle);
            http_response_code(401); $error = 'That password is incorrect. Please try again.';
        }
        flock($handle, LOCK_UN); fclose($handle);
    } else { http_response_code(400); exit('Unknown request.'); }
}
if (!isset($_SESSION['expires']) || $error !== '') {
    if (!$isPageRequest && $error === '') { http_response_code(401); exit('Password required.'); }
    header('Content-Type: text/html; charset=utf-8');
    $csrf = esc($_SESSION['csrf']);
    $next = esc($request);
    $brandLight = base64_encode(file_get_contents($private . '/site/assets/logo_soma_light.png'));
    $brandDark = base64_encode(file_get_contents($private . '/site/assets/logo_soma_dark.png'));
    $mainFont = base64_encode(file_get_contents($private . '/site/assets/manrope.woff2'));
    $footerFont = base64_encode(file_get_contents($private . '/site/assets/ibm-plex-sans-medium.woff2'));
    $themeScript = file_get_contents($private . '/site/theme.js');
    $themeStyles = file_get_contents($private . '/site/theme.css');
    $faviconScript = file_get_contents($private . '/site/favicon.js');
    require $private . '/login.php'; exit;
}
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'HEAD'], true)) {
    http_response_code(405); header('Allow: GET, HEAD'); exit;
}
session_write_close(); // Do not lock the session while streaming the film.
$root = realpath($private . '/site');
if (str_contains($relative, "\0") || str_contains($relative, '\\')) { http_response_code(404); exit; }
$file = realpath($root . '/' . ($isPage ? 'index.html' : $relative));
if (!$file || !str_starts_with($file, $root . DIRECTORY_SEPARATOR) || !is_file($file)) {
    http_response_code(404); exit('Not found.');
}
$types = ['html'=>'text/html; charset=utf-8','css'=>'text/css; charset=utf-8',
    'js'=>'text/javascript; charset=utf-8','svg'=>'image/svg+xml','webp'=>'image/webp',
    'png'=>'image/png','jpg'=>'image/jpeg','woff2'=>'font/woff2','mp4'=>'video/mp4',
    'vtt'=>'text/vtt; charset=utf-8','txt'=>'text/plain; charset=utf-8','hdr'=>'application/octet-stream'];
$ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
if (!isset($types[$ext]) && basename($file) !== 'LICENSE') { http_response_code(404); exit; }
header('Content-Type: ' . ($types[$ext] ?? 'text/plain; charset=utf-8'));
if ($ext === 'html') {
    $html = file_get_contents($file);
    $previewNote = '<div class="private-preview-note">Private preview / <span lang="ja">限定公開</span></div>';
    $html = str_replace('</body>', $previewNote . '</body>', $html);
    header('Content-Length: ' . strlen($html));
    if ($_SERVER['REQUEST_METHOD'] !== 'HEAD') echo $html;
    exit;
}
$size = filesize($file); $start = 0; $end = $size - 1;
header('Accept-Ranges: bytes');
if (isset($_SERVER['HTTP_RANGE'])) {
    if (!preg_match('/^bytes=(\d*)-(\d*)$/D', trim($_SERVER['HTTP_RANGE']), $m) || ($m[1] === '' && $m[2] === '')) {
        http_response_code(416); header('Content-Range: bytes */' . $size); exit;
    }
    if ($m[1] === '') { $start = max(0, $size - (int)$m[2]); }
    else { $start = (int)$m[1]; if ($m[2] !== '') $end = min($end, (int)$m[2]); }
    if ($start > $end || $start >= $size) { http_response_code(416); header('Content-Range: bytes */' . $size); exit; }
    http_response_code(206); header("Content-Range: bytes $start-$end/$size");
}
header('Content-Length: ' . ($end - $start + 1));
if ($_SERVER['REQUEST_METHOD'] === 'HEAD') exit;
$stream = fopen($file, 'rb'); fseek($stream, $start); $remaining = $end - $start + 1;
while ($remaining > 0 && !feof($stream)) {
    $chunk = fread($stream, min(65536, $remaining));
    if ($chunk === false || $chunk === '') break;
    echo $chunk; $remaining -= strlen($chunk);
}
fclose($stream);
