---
name: underscore-staging-keys-false-clean
description: "Design flaw: hyphen-only leak gate falsely certifies underscore-spelled staging keys as clean; key-set S must include both hyphen and underscore spellings."
tags: [leak-gate, staging-keys, underscore, conformance]
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: design_flaw
domain: docs-sync
addressed-in-iter: 2
addressed-how: "FIX-1 key-set S extended to include underscore spellings of every staging-routing key (`promoted_from`, `promoted_at`, `staged_from`, `staged_at`, etc.) IN ADDITION to hyphen forms. T0 encodes both spellings. T6/T7 verifies explicitly name the 5 underscore-key install-runtime docs. T11 cumulative gate detects both spellings. SC2 leak target = union of 63 hyphen-form + 5 underscore-form → 0."
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Hyphen-only leak-gate key-set falsely certifies underscore-key staging docs as clean

## Context

The iter1 plan's FIX-1 predicate (D6) and the grep-gate used a key-set containing only hyphen-form staging-routing keys (e.g., `promoted-from`, `staged-from`). However, 5 live `features/install-runtime/` docs carry underscore-spelled staging keys (`promoted_from`, `promoted_at`) and NO hyphen key. The iter1 gate would have reported "0 leaks" (Success Criterion 2 met) while those 5 docs still contained illegitimate staging-routing keys — a direct Goodhart/Iron-Law-11 risk.

## Decision

Confirmed as a design flaw that touches SC2 validity. The key-set S must include BOTH hyphen AND underscore spellings of every staging-routing key.

## Rationale

Re-ran `grep -rlE '^(promoted_from|promoted_at):' .gobbi/projects/gobbi/features/install-runtime --include='*.md' | grep -v '/archive/' | wc -l` = 5. All 5 carry NO hyphen key. Without the underscore extension, the iter1 gate would falsely certify them (the metric passes without the condition being met — Iron Law 11).

## Alternatives considered

Post-hoc fix only in T11 (not in T0/T6/T7) — rejected: the gap in T6's verifier would mean the underscore leaks could survive T6 and be caught only at T11. The fix must be in T0 (key-set definition), T6/T7 (the tasks that handle the 5 underscore-key files), and T11 (cumulative gate).

## Consequences

SC2 "0 leaks" target = union of 63 hyphen-form files ∪ 5 underscore-form files → 0 outside `archive/`. T0 updated to encode both spellings in key-set S. T6 verifies names all 5 underscore-key docs explicitly. T11 gate catches both spellings. The +5 underscore files are NOT a population recount — the 222/204 totals are untouched.

## Related

- `planning/evaluation/iter1/claude/consistency.md` (DOC-CONS-2)
- `planning/evaluation/iter1/claude/overall.md` (cross-cutting finding)
- `planning/rawdata/draft-iter2.md` §DL-J
- `ideation/artifacts/design-options.md` D6/FIX-1
