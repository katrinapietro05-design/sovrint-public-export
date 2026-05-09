# SOVRINT™ GitHub-Safe Export Manifest v1.0

## Export Rule

Only publish:
- README.md
- canonical registry files
- script templates
- documentation
- diagrams without private data
- simulation scaffolds
- glossary/canon files

Do NOT publish:
- private keys
- tokens
- credentials
- forensic bundles
- raw audit capsules
- device identifiers
- personal records
- legal evidence packages
- private screenshots
- unpublished identity/security material

## Current Public Candidates

- README.md
- 99_REGISTRY/MASTER_INDEX/SOVRINT_CANONICAL_INDEX_v1.md
- 99_REGISTRY/MASTER_INDEX/PHASE1_STATUS.md
- 99_REGISTRY/SCRIPT_REGISTRY/SCRIPT_REGISTRY_v1.md
- 99_REGISTRY/NODE_REGISTRY/MASTER_NODE_REGISTRY_v1.md
- scripts/status/proof_of_life.sh
- scripts/registry/verify_root.sh
- scripts/forensics/sovrint_forensic_audit.sh
- scripts/forensics/sovrint_export_signed_snapshot.sh
- scripts/security/combined_lockdown.sh

## Rule

GitHub export must be additive, reviewed, and stripped of secrets before push.
