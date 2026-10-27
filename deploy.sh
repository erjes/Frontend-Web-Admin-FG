#!/usr/bin/env bash
# deploy.sh — dorong demo ke GitHub sebagai branch `demo` lalu aktifkan GitHub Pages.
# Prasyarat: gh sudah login dengan token yang punya izin TULIS (classic PAT, scope `repo`).
set -euo pipefail

REMOTE_REPO="${REMOTE_REPO:-erjes/Frontend-Web-Admin-FG}"
BRANCH="${BRANCH:-demo}"

echo "1/4 memeriksa izin tulis token…"
if ! gh api "repos/$REMOTE_REPO" --jq .permissions.push | grep -q true; then
  echo "  ✗ token tidak punya akses tulis ke $REMOTE_REPO."
  echo "    Perbaiki dengan: gh auth login  (paste classic PAT dengan scope repo)"
  exit 1
fi
echo "  ✓ izin tulis tersedia"

echo "2/4 mendorong branch $BRANCH…"
git push --force-with-lease origin "main:$BRANCH"

echo "3/4 mengaktifkan GitHub Pages (source: $BRANCH /)…"
if gh api "repos/$REMOTE_REPO/pages" >/dev/null 2>&1; then
  gh api -X PUT "repos/$REMOTE_REPO/pages" \
    -f "source[branch]=$BRANCH" -f "source[path]=/" >/dev/null
else
  gh api -X POST "repos/$REMOTE_REPO/pages" \
    -f "source[branch]=$BRANCH" -f "source[path]=/" >/dev/null
fi
echo "  ✓ Pages dikonfigurasi"

echo "4/4 menunggu build Pages…"
URL="https://$(echo "$REMOTE_REPO" | cut -d/ -f1 | tr 'A-Z' 'a-z').github.io/$(echo "$REMOTE_REPO" | cut -d/ -f2)/"
for i in $(seq 1 30); do
  sleep 6
  code=$(curl -s -o /dev/null -w '%{http_code}' "$URL" || echo 000)
  echo "  [$i] $URL → $code"
  [ "$code" = "200" ] && { echo "✓ demo live: $URL"; exit 0; }
done
echo "! belum 200 setelah ~3 menit; cek https://github.com/$REMOTE_REPO/actions"
