#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
OUT="06_FORENSICS/SNAPSHOTS/SOVRINT_snapshot_$STAMP.tar.gz"
mkdir -p 06_FORENSICS/SNAPSHOTS

tar --exclude='./06_FORENSICS/SNAPSHOTS' --exclude='./.git' -czf "$OUT" .
sha256sum "$OUT" > "$OUT.sha256"

echo "Snapshot created:"
echo "$OUT"
echo "$OUT.sha256"
