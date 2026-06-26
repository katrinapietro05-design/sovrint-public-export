# SOVRINT™ Karmic Bills

**Author:** Katrina Pietroniro™  
**Product family:** SOVRINT™ Sovereign Systems  
**Module status:** Functional Hub-integrated public implementation  
**Primary route:** `/karmic-bills`  
**Hub entry:** `hub.html`  
**Standalone ledger:** `index.html`

Karmic Bills is a governed, local-first ledger for unresolved actions, obligations, exchanges, harms, debts, promises, responsibilities, repair, accountability, evidence, lineage, and closure.

It is not a punishment score, social-credit mechanism, or automatic moral judgment engine. It is an explicit record architecture that separates observation, evidence, acknowledgement, repair, fulfilment, and closure.

## Hub-integrated release

Version 1.1 mounts the complete Karmic Bills ledger inside a SOVRINT Sovereign Systems Hub shell while preserving the original standalone module.

The integrated entry adds:

- the canonical SOVRINT pathway navigation: Anchor, Observe, Integrate, Architect, Elevate, Steward, Evolve, and Engage;
- a five-dimensional Integrity Engine across Truth, Agency, Continuity, Relation, and Sovereignty;
- aggregate coherence and evidence/repair coverage;
- contradiction detection for structurally inconsistent records;
- prioritized correction pathways for unresolved records;
- a portable integrity snapshot export;
- a browser bridge exposed through `window.SOVRINTHubModules`;
- module-ready and integrity-snapshot events for future Hub orchestration;
- responsive desktop and mobile layouts using the established navy, observability cyan, restrained gold, and white SOVRINT visual language.

The Integrity Engine is an observability layer. It does not determine moral worth or automate punitive decisions.

## Core ledger capabilities

- Executive dashboard with active exposure, overdue records, repair progress, evidence volume, priority signals, status distribution, and recent changes
- Complete ledger with search, filters, sorting, archived views, and reusable saved views
- Create, inspect, edit, archive, restore, and evidence-gated closure workflows
- People and entity aggregation
- Evidence register
- Repair plans and milestone tracking
- Immutable-in-practice audit timeline for all user-facing record changes
- Ledger analytics
- JSON import and export
- CSV export of the current ledger view
- Printable dashboard and individual record summaries
- Browser persistence through versioned local storage
- Realistic demonstration records that can be replaced safely

## Record lifecycle

```text
Draft
  ↓
Open
  ↓
Acknowledged
  ↓
In Repair
  ↓
Fulfilled
  ↓
Closed
```

`Disputed` is a governed alternate state for unresolved contention. `Archived` preserves a record outside active operational views without deleting its lineage.

A record cannot be saved as `Closed` unless it contains closure criteria, a closure statement, and a closure date. Evidence should also be attached before formal closure.

## Data custody

The public implementation uses browser local storage under:

```text
sovrint.karmic-bills.v1
```

Saved views use:

```text
sovrint.karmic-bills.saved-views.v1
```

This makes the package immediately usable without a backend. Export the JSON ledger regularly. When server-backed custody is introduced, the Hub can replace the storage adapter while retaining the record schema, history, evidence, lineage, and closure gates.

## Run locally

Serve this directory through any static web server and open `hub.html` for the integrated experience or `index.html` for the standalone ledger. No build step, dependency installation, or external CDN is required.

## Sovereign Systems Hub integration contract

1. Mount the module at `/karmic-bills` using `hub.html`.
2. Preserve the Hub routes `/`, `/pathways`, `/integrity`, `/governance`, and `/engage`.
3. Retain `index.html` as the portable standalone fallback.
4. Preserve `id`, `createdAt`, `updatedAt`, `history`, evidence, lineage, and closure fields during persistence migration.
5. Do not convert archive into deletion.
6. Do not permit direct status mutation to `Closed` without the closure gate.
7. Treat Integrity Engine output as observability and decision support, never an automatic moral or punitive judgment.

See `integration-manifest.json` and `schema.json` in this directory.

## Public-boundary note

This package contains only publication-safe application logic and demonstration records. Private master-lattice materials, unpublished records, credentials, and sensitive evidence do not belong in this repository.

© 2026 Katrina Pietroniro™. SOVRINT™. All Rights Reserved.
