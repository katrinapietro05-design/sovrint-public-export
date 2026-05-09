#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "=== VERIFY SOVRINT™ ROOT ==="

required=(
  "README.md"
  "99_REGISTRY/MASTER_INDEX/SOVRINT_CANONICAL_INDEX_v1.md"
  "06_FORENSICS/HASH_LOGS/phase1_genesis_hashes.sha256"
)

for f in "${required[@]}"; do
  if [ -f "$f" ]; then
    echo "OK: $f"
  else
    echo "MISSING: $f"
    exit 1
  fi
done

echo
echo "Checking hashes:"
sha256sum -c 06_FORENSICS/HASH_LOGS/phase1_genesis_hashes.sha256
