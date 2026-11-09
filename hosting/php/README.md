# Password screen source

Copy index.php to public_html/soma/index.php and login.php to soma-private/login.php
when assembling the complete host package. Keep the existing config.php and
private/site asset tree; they contain the configured password hash and website.

The login embeds logo_soma_dark.png once and crops its rings and original wordmark.
The ring SVGs rotate in opposite directions with CSS; reduced motion disables them.
These PHP files are delivery sources, outside the static Sites dist directory.
