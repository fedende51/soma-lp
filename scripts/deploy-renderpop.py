"""Deploy a verified SOMA delivery over FTPS using the existing FileZilla entry.

No credentials are accepted on the command line or written to deployment reports.
The host's password configuration, runtime state and Apache rules are preserved.
"""
from pathlib import Path, PurePosixPath
import argparse
import base64
from datetime import datetime, timezone
import ftplib
import hashlib
import io
import json
import re
import socket
import ssl
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[2]
PACKAGE = ROOT / 'delivery/SOMA-upload-about-company'
ARCHIVE = PACKAGE.with_suffix('.zip')
SERVER_IP = '198.187.31.215'
TLS_HOST = 'premium98-3.web-hosting.com'
SITE = '/soma-private/site'
PUBLIC_INDEX = '/public_html/soma/index.php'
LOGIN = '/soma-private/login.php'
KNOWN_DIRS = set()


def digest(data):
    return hashlib.sha256(data).hexdigest()


def read_remote(ftp, path):
    data = io.BytesIO()
    ftp.retrbinary('RETR ' + path, data.write, blocksize=262144)
    return data.getvalue()


def write_remote(ftp, path, data):
    ftp.storbinary('STOR ' + path, io.BytesIO(data), blocksize=262144)
    actual = read_remote(ftp, path)
    if digest(actual) != digest(data):
        raise RuntimeError('Uploaded file checksum differs: ' + path)


def mkdirs(ftp, path):
    current = ''
    for part in PurePosixPath(path).parts:
        if part == '/':
            continue
        current += '/' + part
        if current in KNOWN_DIRS:
            continue
        try:
            ftp.mkd(current)
        except ftplib.error_perm:
            # Prove that the existing entry is a directory, not an ignored error.
            ftp.cwd(current)
        KNOWN_DIRS.add(current)


def inventory(ftp, path):
    files = {}
    for name, facts in ftp.mlsd(path):
        if name in ['.', '..']:
            continue
        if '/' in name or '\\' in name:
            raise RuntimeError('Unexpected remote path entry')
        full = path + '/' + name
        if facts.get('type') == 'dir':
            files.update(inventory(ftp, full))
        elif facts.get('type') == 'file':
            files[full] = int(facts.get('size', 0))
        elif facts.get('type') not in ['cdir', 'pdir']:
            raise RuntimeError('Unsupported remote entry type: ' + full)
    return files


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--deploy', action='store_true')
    parser.add_argument('--resume', help='Resume an existing, unpublished staged release')
    args = parser.parse_args()
    with zipfile.ZipFile(ARCHIVE) as archive:
        assert archive.testzip() is None, 'Invalid delivery archive'
        for file in PACKAGE.rglob('*'):
            if file.is_file():
                assert archive.read(file.relative_to(PACKAGE).as_posix()) == file.read_bytes()

    assert SERVER_IP in socket.gethostbyname_ex('renderpopstudio.com')[2]
    assert SERVER_IP in socket.gethostbyname_ex(TLS_HOST)[2]
    settings = ET.parse(Path.home() / 'AppData/Roaming/FileZilla/sitemanager.xml')
    entry = next(s for s in settings.getroot().iter('Server')
                 if s.findtext('Name') == 'RenderPop Studio' and s.findtext('Host') == SERVER_IP)
    password = entry.find('Pass')
    assert password is not None and password.attrib.get('encoding') == 'base64'
    def connect():
        connection = ftplib.FTP_TLS(context=ssl.create_default_context(), timeout=45)
        connection.connect(TLS_HOST, 21)
        connection.login(entry.findtext('User'), base64.b64decode(password.text).decode('utf-8'))
        connection.prot_p()
        return connection
    ftp = connect()
    config = read_remote(ftp, '/soma-private/config.php')
    keys = set(re.findall(rb"['\"]([a-z_]+)['\"]\s*=>", config))
    required = {b'base_path', b'trust_proxy_https', b'require_https', b'rate_key',
                b'password_hash', b'session_seconds'}
    assert required <= keys, 'Remote password configuration needs review'
    assert re.search(rb"['\"]base_path['\"]\s*=>\s*['\"]/soma/?['\"]", config)
    old_index = read_remote(ftp, PUBLIC_INDEX)
    old_login = read_remote(ftp, LOGIN)
    old_public_rules = read_remote(ftp, '/public_html/soma/.htaccess')
    old_private_rules = read_remote(ftp, '/soma-private/.htaccess')
    current_files = inventory(ftp, SITE)
    local_files = {p.relative_to(PACKAGE / 'soma-private/site').as_posix(): p.read_bytes()
                   for p in (PACKAGE / 'soma-private/site').rglob('*') if p.is_file()}
    extras = {p: size for p, size in current_files.items()
              if p[len(SITE) + 1:] not in local_files}
    report = {'host': 'renderpopstudio.com', 'tls_host': TLS_HOST,
              'tls': ftp.sock.version(), 'package': str(ARCHIVE),
              'package_sha256': digest(ARCHIVE.read_bytes()),
              'local_site_files': len(local_files), 'remote_site_files': len(current_files),
              'new_site_files': sorted(p for p in local_files if SITE + '/' + p not in current_files),
              'extra_remote_files_preserved': list(extras),
              'password_config_preserved': True, 'runtime_preserved': True,
              'apache_rules_preserved': True, 'deployed': False}
    if not args.deploy:
        ftp.quit()
        print(json.dumps(report), flush=True)
        return

    if args.resume and not re.fullmatch(r'\d{8}T\d{6}Z', args.resume):
        raise RuntimeError('Invalid release timestamp')
    stamp = args.resume or datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    release = ROOT / 'delivery/deployments' / stamp
    release.mkdir(parents=True, exist_ok=bool(args.resume))
    for name, data in [('index.php', old_index), ('login.php', old_login),
                       ('public.htaccess', old_public_rules), ('private.htaccess', old_private_rules)]:
        destination = release / name
        if destination.exists():
            assert destination.read_bytes() == data, 'Live site changed since staging began'
        else:
            destination.write_bytes(data)
    staging = '/soma-private/site-upload-' + stamp
    backup = '/soma-private/releases/before-' + stamp
    mkdirs(ftp, staging)
    mkdirs(ftp, backup)
    # Retain complete rollback data outside the public document root.
    write_remote(ftp, backup + '/index.php', old_index)
    write_remote(ftp, backup + '/login.php', old_login)
    write_remote(ftp, backup + '/public.htaccess', old_public_rules)
    write_remote(ftp, backup + '/private.htaccess', old_private_rules)
    print(json.dumps({'stage': 'uploading', 'files': len(local_files), 'backup': backup}), flush=True)
    staged_files = inventory(ftp, staging) if args.resume else {}
    journal = {}
    for i, (relative, data) in enumerate(sorted(local_files.items()), 1):
        destination = staging + '/' + relative
        for attempt in range(3):
            try:
                matches = (staged_files.get(destination) == len(data)
                           and digest(read_remote(ftp, destination)) == digest(data))
                if not matches:
                    mkdirs(ftp, str(PurePosixPath(destination).parent))
                    write_remote(ftp, destination, data)
                break
            except (OSError, EOFError, ftplib.error_temp):
                ftp.close()
                if attempt == 2:
                    raise
                ftp = connect()
        journal[relative] = digest(data)
        (release / 'verified-staging.json').write_text(json.dumps(journal), encoding='utf-8')
        if i % 15 == 0 or i == len(local_files):
            print(json.dumps({'verified_uploads': i, 'total': len(local_files)}), flush=True)
        if i % 20 == 0:
            ftp.close()
            ftp = connect()
    for path in extras:
        destination = staging + '/' + path[len(SITE) + 1:]
        mkdirs(ftp, str(PurePosixPath(destination).parent))
        write_remote(ftp, destination, read_remote(ftp, path))
    new_index = (PACKAGE / 'public_html/soma/index.php').read_bytes()
    new_login = (PACKAGE / 'soma-private/login.php').read_bytes()
    staged_index = '/soma-private/index-upload-' + stamp + '.php'
    staged_login = '/soma-private/login-upload-' + stamp + '.php'
    write_remote(ftp, staged_index, new_index)
    write_remote(ftp, staged_login, new_login)
    assert digest(read_remote(ftp, '/soma-private/config.php')) == digest(config)
    assert read_remote(ftp, PUBLIC_INDEX) == old_index
    assert read_remote(ftp, LOGIN) == old_login
    moved_site = promoted_site = promoted_login = promoted_index = False
    try:
        ftp.rename(SITE, backup + '/site')
        moved_site = True
        ftp.rename(staging, SITE)
        promoted_site = True
        ftp.rename(staged_login, LOGIN)
        promoted_login = True
        ftp.rename(staged_index, PUBLIC_INDEX)
        promoted_index = True
        assert read_remote(ftp, PUBLIC_INDEX) == new_index
        assert read_remote(ftp, LOGIN) == new_login
        assert digest(read_remote(ftp, '/soma-private/config.php')) == digest(config)
        assert read_remote(ftp, '/public_html/soma/.htaccess') == old_public_rules
        assert read_remote(ftp, '/soma-private/.htaccess') == old_private_rules
    except Exception:
        if promoted_index:
            write_remote(ftp, staged_index, old_index)
            ftp.rename(staged_index, PUBLIC_INDEX)
        if promoted_login:
            write_remote(ftp, staged_login, old_login)
            ftp.rename(staged_login, LOGIN)
        if promoted_site:
            ftp.rename(SITE, staging)
        if moved_site:
            ftp.rename(backup + '/site', SITE)
        raise
    report.update({'deployed': True, 'release_id': stamp,
                   'published_utc': datetime.now(timezone.utc).isoformat(), 'remote_backup': backup,
                   'local_rollback_files': str(release), 'site_checksums_verified': len(local_files),
                   'url': 'https://renderpopstudio.com/soma/'})
    (release / 'deployment.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
    try:
        ftp.quit()
    except (OSError, EOFError, ftplib.Error):
        ftp.close()
    print(json.dumps(report), flush=True)


if __name__ == '__main__':
    main()
