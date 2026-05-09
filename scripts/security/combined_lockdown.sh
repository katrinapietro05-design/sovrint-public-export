#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

echo "=== SOVRINT™ LOCAL LOCKDOWN ==="

chmod 700 .
chmod -R go-rwx 00_GENESIS 01_CANON 06_FORENSICS 99_REGISTRY 2>/dev/null || true

mkdir -p 10_INFRA/SECRETS_QUARANTINE
chmod 700 10_INFRA/SECRETS_QUARANTINE

find . -type f \( -name "*.key" -o -name "*.pem" -o -name "*.env" -o -name "*token*" -o -name "*secret*" \) \
  ! -path "./10_INFRA/SECRETS_QUARANTINE/*" \
  -print > 06_FORENSICS/HASH_LOGS/possible_secrets_paths.txt

echo "Possible secret paths logged:"
echo "06_FORENSICS/HASH_LOGS/possible_secrets_paths.txt"
echo "Review before moving anything."
