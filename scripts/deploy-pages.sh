#!/usr/bin/env bash
# Builds the site for GitHub Pages (served from /for-ade/) and publishes
# it to the `gh-pages` branch. Run with: yarn deploy
set -euo pipefail

REPO_URL="$(git remote get-url origin)"
OUT_DIR="$(mktemp -d)"
trap 'rm -rf "$OUT_DIR"' EXIT

yarn build:pages

# .nojekyll: serve files as-is. 404.html: open the site on unknown paths.
touch dist/.nojekyll
cp dist/index.html dist/404.html

cp -R dist/. "$OUT_DIR"
cd "$OUT_DIR"
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy site to GitHub Pages"
git push -q -f "$REPO_URL" gh-pages

echo "Deployed. Live in about a minute at https://balentino202.github.io/for-ade/"
