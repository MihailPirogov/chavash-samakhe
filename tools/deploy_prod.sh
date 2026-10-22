#!/bin/bash
# Deploy the PRODUCTION web version of Чӑваш сӑмахӗ to https://pirogovlab.ru/chavash-samakhe/ (same as «Сүз дөньясы» production:
# source files as-is, NO noindex, NO test badge, index,follow on privacy, cache-busting ?v=<build>, signed APK next to the game).
# Touches ONLY the chavash-samakhe/ folder on the server (+ a backup of it in /root/backups/); no nginx changes. Web version: no ads.
set -euo pipefail
cd /workspace/chuvash-wow
HOST=root@95.142.37.63
KEY=~/.ssh/id_ed25519_pirogovlab
DEST=/var/www/www-root/data/www/pirogovlab.ru/chavash-samakhe/
DIST=/workspace/chuvash-wow-prod
V=$(date +%Y%m%d%H%M)
APK=release/chavash-samakhe.apk
[ -f "$APK" ] || { echo "no $APK: run tools/build_android.sh first"; exit 1; }
echo "$(date '+%F %T %Z') deploy_prod: building dist v=$V"
rm -rf "$DIST"; mkdir -p "$DIST"
cp -r css js data img privacy "$DIST"/
cp "$APK" "$DIST/chavash-samakhe.apk"
python3 - "$DIST" "$V" <<'PY'
import sys, re, os
dist, v = sys.argv[1], sys.argv[2]
s = open('index.html', encoding='utf-8').read()
s = re.sub(r'\?v=\d+[a-z]?', '?v=' + v, s)
s = re.sub(r"window\.BUILD_V='[^']*'", f"window.BUILD_V='{v}'", s)
# game page stays noindex (meta + nginx X-Robots-Tag, requested 2026-10-21); web РСЯ ads not live yet (empty IDs) -> strip the block
s = re.sub(r'<!--webads-->.*?<!--/webads-->\n?', '', s, flags=re.S)
if 'name="robots"' not in s: s = re.sub(r'(<meta charset[^>]*>\n?)', r'\1<meta name="robots" content="noindex, follow">\n', s, count=1)
assert 'noindex' in s
open(os.path.join(dist, 'index.html'), 'w', encoding='utf-8').write(s)
for root, _, fs in os.walk(dist):
    for f in fs:
        if f.endswith('.html'):
            t = open(os.path.join(root, f), encoding='utf-8').read()
            assert 'testBadge' not in t and (f == 'index.html' and root == dist or 'noindex' not in t), f
PY
du -sh "$DIST"
if grep -rliE "marlamuter|марламутер" "$DIST" --include='*.html' --include='*.js' --include='*.css'; then echo "deploy_prod: ABORT, forbidden mention in dist"; exit 1; fi
TS=$(date +%Y%m%d-%H%M%S)
ssh -i $KEY -o BatchMode=yes -o ConnectTimeout=20 $HOST "mkdir -p /root/backups && if [ -d $DEST ]; then cp -a $DEST /root/backups/chavash-samakhe-$TS; fi; mkdir -p $DEST && chown www-root:www-root $DEST && chmod 755 $DEST"
echo "server backup: /root/backups/chavash-samakhe-$TS/"
rsync -rlt --delete --chown=www-root:www-root --chmod=D755,F644 -e "ssh -i $KEY -o BatchMode=yes" "$DIST"/ "$HOST:$DEST"
U=https://pirogovlab.ru/chavash-samakhe
code=$(curl -s -o /dev/null -w '%{http_code}' "$U/?v=$V"); pcode=$(curl -s -o /dev/null -w '%{http_code}' "$U/privacy/")
acode=$(curl -s -o /dev/null -w '%{http_code} %{content_type} %{size_download}' "$U/chavash-samakhe.apk")
echo "$(date '+%F %T %Z') deploy_prod: $U/ HTTP $code, privacy HTTP $pcode, apk $acode"
[ "$code" = 200 ] && [ "$pcode" = 200 ] && [ "${acode%% *}" = 200 ]
