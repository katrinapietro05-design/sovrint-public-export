# SOVRINT™ Karmic Bills

**Author:** Katrina Pietroniro™  
**Product family:** SOVRINT™ Sovereign Systems  
**Module status:** Functional public implementation package  
**Primary route:** `/karmic-bills`

Karmic Bills is a governed, local-first ledger for unresolved actions, obligations, exchanges, harms, debts, promises, responsibilities, repair, accountability, evidence, lineage, and closure.

It is not a punishment score, social-credit mechanism, or automatic moral judgment engine. It is an explicit record architecture that separates observation, evidence, acknowledgement, repair, fulfilment, and closure.

## Included capabilities

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
- Printable dashboard and printable individual record summaries
- Responsive desktop and mobile layouts
- Browser persistence through versioned local storage
- Realistic sample records that can be replaced safely

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

A record cannot be saved as `Closed` unless it contains:

1. closure criteria;
2. a closure statement; and
3. a closure date.

Evidence should also be attached before formal closure. The user interface directs the operator back into the governed edit workflow instead of silently closing an incomplete record.

## Data custody

The public implementation uses the browser's local storage under:

```text
sovrint.karmic-bills.v1
```

Saved views use:

```text
sovrint.karmic-bills.saved-views.v1
```

This makes the package immediately usable without a backend. Export the JSON ledger regularly. When integrated into Sovereign Systems Hub, replace the storage adapter with the Hub's authenticated persistence layer while retaining the same record schema and audit events.

## Run locally

Serve this directory through any static web server and open `index.html`. No build step, dependency installation, or external CDN is required.

## Sovereign Systems Hub integration

The Replit application was not available through the connected GitHub repositories when this module was created. For that reason, this branch does not pretend to modify unavailable Hub source code. Instead, it provides a complete, portable module and a formal integration manifest.

To integrate it into the Hub:

1. Mount this module at `/karmic-bills`.
2. Add `Karmic Bills` to the primary navigation.
3. Preserve the Hub's existing `/`, `/pathways`, `/integrity`, and `/governance` routes.
4. Replace local storage with the Hub persistence adapter when server-backed custody is required.
5. Preserve `id`, `createdAt`, `updatedAt`, `history`, evidence, lineage, and closure fields during migration.
6. Do not convert archive into deletion.
7. Do not permit direct status mutation to `Closed` without the closure gate.

See `integration-manifest.json` and `schema.json` in this directory.

## Public-boundary note

This package contains only publication-safe application logic and sample records. Private master-lattice materials, unpublished records, credentials, and sensitive evidence do not belong in this repository.

© 2026 Katrina Pietroniro™. SOVRINT™. All Rights Reserved.
