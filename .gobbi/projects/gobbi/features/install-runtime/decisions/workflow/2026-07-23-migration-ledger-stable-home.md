---
name: migration-ledger-stable-home
description: The MIG-1/MIG-8 migration ledger and verification dossiers had no fixed home at iter1, leaving T1/T9 commit boundaries indeterminate; now a stable, defined-persistence session working note
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, process]
keywords: [cod-plan-usage-001, migration-ledger-home, evidence-note, session-audit, gitignore]
author: claude
supersedes: null
superseded_by: null
related: []
---

# The migration ledger has a stable, defined-persistence home

## Context

At iter1, the migration ledger and verification dossiers (MIG-1/MIG-8) had no fixed path — the home was left to
Execution, which gave the load-bearing ledger no discoverable location and made T1/T9's commit boundaries
indeterminate (`COD-PLAN-USAGE-001`, High/100).

## Decision

Fixed the home at `4-execution/working/startup-migration-evidence.md` — a Record-owned, cross-task, gitignored
session working note (never a seventh `skills/startup/*.md` file, never baked into the durable skill files) —
with defined append-only, snapshot+sha256, digest-trailer, and lifetime semantics.

## Rationale

`record-map.md` defines `working/` as the loop-level scratch surface, already existing on disk; `git
check-ignore -v` confirmed the whole `sessions/` tree is gitignored (`.gitignore:21`), so the note can never
pollute the six-file product diff. Codex proposed distributing the ledger by owner INTO the three bundle files
instead — declined (kept-own): baking migration provenance into shipped SOP-conformant skill files leaves
cruft, while a session-persistent artifact satisfies MIG-8's reverse sweep without polluting durable files.

## Alternatives considered

- **Distribute the ledger by owner into `scenario.md`/`checklist.md`/`evaluation.md`** (Codex's proposal) —
  declined: durable SOP-conformant skill files should not carry migration-provenance cruft.
- **Use `git hash-object -w` for persistence** instead of a file snapshot + sha256 — declined: an unreferenced
  loose blob can be garbage-collected, and a verification gate should not mutate the object database.

## Consequences

Every task that writes to the evidence note must declare it in its own `files:` (see
[[evidence-note-write-declaration]] for the residual fix that made this declaration mandatory at iter2).

## Related

- [[evidence-note-write-declaration]] — the residual declaration-completeness fix this finding's residual became
