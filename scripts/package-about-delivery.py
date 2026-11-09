"""Package the About-page update for the existing password-protected PHP host."""
from pathlib import Path
import hashlib
import json
import shutil
import zipfile
import os

preview_password = os.environ.get('SOMA_PREVIEW_PASSWORD', '').encode('utf-8')
if not preview_password:
    raise SystemExit('Set SOMA_PREVIEW_PASSWORD before packaging the protected site.')


website = Path(__file__).resolve().parents[1]
delivery = website.parent / 'delivery'
template = delivery / 'SOMA-upload-login-fit'
target = delivery / 'SOMA-upload-about-company'
target.mkdir(exist_ok=True)

for relative in ['public_html/soma/.htaccess', 'soma-private/config.php',
                 'soma-private/.htaccess', 'soma-private/runtime/.gitkeep',
                 'READ-ME-FIRST.txt', 'ASSET-NOTICES.md']:
    destination = target / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(template / relative, destination)
for name in ['index.php', 'login.php']:
    destination = target / ('public_html/soma' if name == 'index.php' else 'soma-private') / name
    shutil.copyfile(website / 'hosting/php' / name, destination)

for source in sorted((website / 'dist').rglob('*')):
    if not source.is_file():
        continue
    relative = source.relative_to(website / 'dist')
    if relative.parts[0] in ['film', 'font-options'] or relative.name == 'font-samples.html':
        continue
    destination = target / 'soma-private/site' / relative
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, destination)

readme = (target / 'READ-ME-FIRST.txt').read_text(encoding='utf-8')
readme = readme.replace('PHP 8.1+, Apache/.htaccess and HTTPS are required.',
    'A supported, security-patched PHP version, Apache/.htaccess and HTTPS are required.\n'
    'For the 8.4 branch use PHP 8.4.27 or newer; for 8.5 use 8.5.12 or newer.\n'
    'Ask the host to confirm fixes for CVE-2026-109618 and CVE-2026-109619\n'
    'and that PHP workers were restarted. A website ZIP cannot patch server PHP.')
(target / 'READ-ME-FIRST.txt').write_text(readme, encoding='utf-8')
(target / 'UPDATE-NOTES.txt').write_text('''SOMA - Separate About page

Upload both the public_html/soma files and the complete soma-private folder.
Keep soma-private NEXT TO public_html, not inside it. Follow READ-ME-FIRST.txt.

- New company page: /soma/about.html, linked as About / 会社紹介 in the header.
- SOMA is described as a fully AI-agentic company in English and Japanese.
- Founders: Steven Lim, CEO; Federico Martinolich, CPO; Luis Paolino, CTO.
- The customer name is Nippo K.K. in both languages.
- Em dashes are removed from first-party website copy, page titles, captions,
  reference pages and demo-request email subjects.
- Story, proposed mission and vision, company details and a separate company
  FAQ, including an explanation of SOMA's AI-agentic operating model.
- English/Japanese, saved light/dark theme, original animated header/footer
  logos, rings-only favicon, scroll reveals and animated FAQ disclosures.
- The four existing product navigation links keep their original order.
- Homepage product claims are preserved; punctuation is updated as requested.
- Launch videos, 3D geometry and rotation, contact address and configured
  password are unchanged.
- Opening About directly without a session shows the same login screen.
  Successful login returns the visitor to About. Private assets remain gated.

Content still awaiting the owner's details:
- Establishment date (the empty date row is hidden).
- City/prefecture and office address (the location FAQ currently links to contact).
- Nippo K.K. logo and website. Only the supplied text name is displayed;
  no customer logo, quote or result has been invented.

The mission and vision are drafts based on SOMA's existing product direction.
No remote hosting was changed. Confirm patched PHP with the new host before
publishing this package. This package contains no PHP runtime update.
''', encoding='utf-8')

proof = {'page': 'about.html', 'homepage_product_copy_preserved_except_punctuation': True,
         'existing_navigation_order': ['film', 'scheduler', 'approach', 'details'],
         'company_profile': json.loads((website / 'design-assets/company-profile.json').read_text(encoding='utf-8')),
         'remote_deployment': False}
for name in ['layout-results', 'interaction-results', 'host-results', 'accessibility-results']:
    report = website / 'artifacts/about-company-update' / (name + '.json')
    if report.exists():
        proof[name] = json.loads(report.read_text(encoding='utf-8'))
(target / 'VERIFICATION.json').write_text(json.dumps(proof, indent=2, ensure_ascii=False), encoding='utf-8')
included = lambda p: p.is_file() and not (p.parent.name == 'runtime' and p.name != '.gitkeep')
files = sorted(p for p in target.rglob('*') if included(p) and p.name != 'CHECKSUMS.sha256')
(target / 'CHECKSUMS.sha256').write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest() + '  ' + p.relative_to(target).as_posix() + '\n' for p in files), encoding='utf-8')
archive = target.with_suffix('.zip')
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for file in sorted(p for p in target.rglob('*') if included(p)):
        data = file.read_bytes()
        assert preview_password not in data, 'Plaintext password must not be packaged'
        z.writestr(file.relative_to(target).as_posix(), data)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    for file in files:
        assert z.read(file.relative_to(target).as_posix()) == file.read_bytes()
print(json.dumps({'archive': str(archive), 'bytes': archive.stat().st_size, 'files': len(files) + 1}))
