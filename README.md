# UWWIDC Google Apps Script Projects

This repository stores and version-controls Google Apps Script projects managed via [`clasp`](https://github.com/google/clasp).

## Projects

| Folder | Apps Script Project | Script ID |
| :--- | :--- | :--- |
| `apps-script/pre-student-teaching` | Pre-Student Teaching | `1TwuzIyTmPGHUsLbJcz8W_lMwnEAsylIjCntxDYnpWC-_7ZnJVimSz-DM` |
| `apps-script/peprof-410-seminar-2` | PEPROF 410 Seminar (2) | `1ceTrr0svlmoqPjsv4PMrVV1fXRC4Zj3Fziw-XGh467nLB9ad1JgaSbSu` |
| `apps-script/spot-the-safety-pro` | Spot the Safety Pro | `1FQ5-ndXlrUZ3K3vQZOjs9KTq-t6_EdASGg1Lk3QUtoBDV8eAcxPMuZ1Z` |
| `apps-script/roseman-gym-space` | Roseman Gym Space | `1rz6lLa2vN-yu9UD3QzUmhIfh6fMX8J_KvktT-DxyLX1TyolPV8MHkda5` |
| `apps-script/peprof-410-seminar-1` | PEPROF 410 Seminar 1 | `1ra5xEyX8O8yEG2CwDauShTH4iux4UDEfhEVKZGtwdt6fGMRlmEJ4MSqb` |
| `apps-script/peprof-222` | PEPROF 222 | `1Nk3ycO772trSNEmVSP7bREHS_z-mv93cJvfBpbE3guq-UbNkd2C1RBrk` |

---

## One-Command Backup (Google Apps Script → GitHub)

After editing any project in the online Apps Script editor, run this from the root of this repository to pull the latest code from all 6 projects and back them up to GitHub:

```bash
./sync.sh
cd apps-script/PROJECT_FOLDER
clasp pull
cd ../..
git add .
git commit -m "Update PROJECT_FOLDER from Apps Script"
git push
cd apps-script/PROJECT_FOLDER
clasp push
cd ../..
git add .
git commit -m "Update PROJECT_FOLDER"
git push
* **Verification:** Run `ls -la README.md`—it should show the newly created `README.md` file without errors.

### 2. Create the automatic `./sync.sh` script
Paste this block to create a script that loops through every folder in `apps-script/`, runs `clasp pull` on each one, and automatically commits and pushes any changes to GitHub:

```bash
cat << 'EOF' > sync.sh
#!/bin/bash
set -e

echo "Pulling latest code from Google Apps Script..."
for dir in apps-script/*/; do
  if [ -f "${dir}.clasp.json" ]; then
    echo "-> Syncing $dir"
    (cd "$dir" && clasp pull)
  fi
done

echo "Checking for changes to back up to GitHub..."
git add apps-script/
if git diff --cached --quiet; then
  echo "Everything is already up to date. Nothing to commit."
else
  git commit -m "Sync Apps Script projects ($(date '+%Y-%m-%d %H:%M'))"
  git push
  echo "Backup pushed to GitHub!"
fi
