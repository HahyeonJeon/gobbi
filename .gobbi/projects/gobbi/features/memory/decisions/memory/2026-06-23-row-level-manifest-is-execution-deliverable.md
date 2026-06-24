---
name: row-level-manifest-is-execution-deliverable
description: Codex COD2-OVERALL-1 (Critical): row-level 114-file manifest is a WS-B B-1 Execution deliverable, not an Ideation artifact. Accepted.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, ideation]
keywords: [manifest, execution-criteria, codex-finding, altitude, COD2-OVERALL-1]
author: claude
supersedes: null
superseded_by: null
---

# Row-level manifest is an Execution deliverable (COD2-OVERALL-1)

## Context

Codex iter2 evaluation (COD2-OVERALL-1, Critical, Confidence 100) found that the Ideation draft promises a "complete migration manifest" but no row-level (source flat path → destination) manifest file exists under `1-ideation/`. Codex concluded FAIL on this basis.

The user reviewed the cross-system divergence (Claude=PASS / Codex=FAIL) and honored PASS, reclassifying this as an altitude finding: the row-level manifest is the WS-B B-1 WORK product, produced during Planning/Execution by reading the locked Ideation design. An Ideation artifact defines the manifest SPEC (counts, scope, per-type breakdowns, ref-class enumeration, guard strategy, pass criterion), not the manifest TABLE itself.

## Decision

COD2-OVERALL-1 is an accepted/deferred Execution acceptance criterion, not an Ideation defect.

**Execution acceptance criteria (WS-B B-1):**
- Produce a row-level manifest file: every flat by-area file in both tiers (114 rows = 34 project + 80 feature, verified), each row: source flat path → resolved `{type}/{area}/{slug}` under gobbi's locked final areas (Q5).
- The manifest must classify each expected-RED as EXPECTED vs REGRESSION (B-4, baseline 685/133).
- At execution time, re-run `find` as the authority (the counts in the draft are the verification baseline, not the spec).

## Rationale

Ideation's job is to define the problem, design decisions, and spec for what Execution must produce. A row-level file manifest is an Execution artifact (requires running `find` on the actual repo at execution time). Producing it at Ideation would be premature — gobbi's final areas are only just now locked in this session.

## Alternatives considered

- Produce the manifest now in Ideation: prematurely locks an Execution detail before Planning verifies feasibility; the spec-first / manifest-later ordering is correct.
- Accept Codex FAIL: would require another iteration without adding substance (the design is sound).

## Consequences

Execution must produce the 114-row manifest as a first task of WS-B. The Preparation/Planning loops must include this as an explicit deliverable. The deferred backlog `execute-area-tag-migration-114-files` already carries this requirement.

## Related

- [[project-defined-vocab-config-as-data]] — the config design the manifest depends on
