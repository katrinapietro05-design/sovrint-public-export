#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="06_FORENSICS/AUDIT_CAPSULES/audit_$STAMP"
mkdir -p "$OUT"

{
  echo "SOVRINT™ FORENSIC AUDIT"
  echo "Timestamp: $STAMP"
  echo "PWD: $(pwd)"
  echo "User: $(whoami)"
  echo "Device: $(getprop ro.product.model 2>/dev/null || true)"
  echo "Android: $(getprop ro.build.version.release 2>/dev/null || true)"
  echo
  echo "=== TREE ==="
  tree -L 4 . 2>/dev/null || find . -maxdepth 4 -print
  echo
  echo "=== GIT ==="
  git status 2>/dev/null || true
  git remote -v 2>/dev/null || true
} > "$OUT/audit_report.txt"

find . -type f \
  ! -path "./06_FORENSICS/AUDIT_CAPSULES/*" \
  ! -path "./.git/*" \
  -print0 | xargs -0 sha256sum > "$OUT/file_hashes.sha256"

tar -czf "06_FORENSICS/AUDIT_CAPSULES/audit_$STAMP.tar.gz" -C "$OUT" .
sha256sum "06_FORENSICS/AUDIT_CAPSULES/audit_$STAMP.tar.gz" > "06_FORENSICS/AUDIT_CAPSULES/audit_$STAMP.tar.gz.sha256"

echo "Audit capsule created:"
echo "06_FORENSICS/AUDIT_CAPSULES/audit_$STAMP.tar.gz"
