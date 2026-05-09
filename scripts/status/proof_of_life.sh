#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

ROOT="${SOVRINT_ROOT:-$PWD}"

echo "=== SOVRINT™ PROOF OF LIFE ==="
echo "Timestamp: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Root: $ROOT"
echo "User: $(whoami)"
echo "PWD: $(pwd)"
echo
echo "--- Core files ---"
ls -la README.md 99_REGISTRY/MASTER_INDEX/SOVRINT_CANONICAL_INDEX_v1.md 2>/dev/null || true
echo
echo "--- Hash checkpoint ---"
cat 06_FORENSICS/HASH_LOGS/phase1_genesis_hashes.sha256 2>/dev/null || echo "No hash checkpoint found."
echo
echo "--- Tree ---"
tree -L 2 . 2>/dev/null || find . -maxdepth 2 -type d | sort
