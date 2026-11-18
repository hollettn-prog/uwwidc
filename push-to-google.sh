#!/bin/bash
set -e

TARGET_PROJECT="$1"

if [ -n "$TARGET_PROJECT" ]; then
  # Push only the specified project folder (e.g., ./push-to-google.sh peprof-222)
  DIR="apps-script/$TARGET_PROJECT"
  if [ ! -f "$DIR/.clasp.json" ]; then
    echo "Error: '$DIR' is not a valid Apps Script project folder."
    exit 1
  fi
  echo "Pushing $DIR to Google Apps Script..."
  (cd "$DIR" && clasp push)
else
  # Auto-detect any project folders with modified or untracked files
  CHANGED=0
  for dir in apps-script/*/; do
    if [ -f "${dir}.clasp.json" ]; then
      if [ -n "$(git status --porcelain "$dir")" ]; then
        echo "Detected local edits in $dir -> pushing to Google Apps Script..."
        (cd "$dir" && clasp push)
        CHANGED=1
      fi
    fi
  done

  if [ "$CHANGED" -eq 0 ]; then
    echo "No local edits detected inside apps-script/."
  fi
fi

echo "Checking for changes to commit to GitHub..."
git add -A
if git diff --cached --quiet; then
  echo "GitHub is already up to date. Nothing to commit."
else
  MSG="${2:-Update Apps Script projects ($(date '+%Y-%m-%d %H:%M'))}"
  git commit -m "$MSG"
  git push
  echo "Successfully pushed to Google Apps Script and GitHub!"
fi
