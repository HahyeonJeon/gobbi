---
name: underscore-staging-keys-false-clean
description: "Design flaw: hyphen-only leak gate falsely certifies underscore-spelled staging keys as clean; key-set S must include both hyphen and underscore spellings."
tags: [leak-gate, staging-keys, underscore, conformance]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
type: decisions
domain: docs-sync
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
---

# Hyphen-only leak-gate key-set falsely certifies underscore-key staging docs as clean

## Context

An early version of the plan's FIX-1 predicate and the grep-gate used a key-set containing only hyphen-form staging-routing keys (e.g., `promoted-from`, `staged-from`). However, 5 live `features/install-runtime/` docs carry underscore-spelled staging keys (`promoted_from`, `promoted_at`) and NO hyphen key. That gate would have reported "0 leaks" (Success Criterion 2 met) while those 5 docs still contained illegitimate staging-routing keys — a direct Goodhart / Iron-Law-11 risk.

## Decision

Confirmed as a design flaw that touches SC2 validity. The key-set S must include BOTH hyphen AND underscore spellings of every staging-routing key.

## Rationale

Re-ran `grep -rlE '^(promoted_from|promoted_at):' .gobbi/projects/gobbi/features/install-runtime --include='*.md' | grep -v '/archive/' | wc -l` = 5. All 5 carry NO hyphen key. Without the underscore extension, a hyphen-only gate would falsely certify them (the metric passes without the condition being met — Iron Law 11).

## Alternatives considered

Post-hoc fix only in T11 (not in T0/T6/T7) — rejected: the gap in T6's verifier would mean the underscore leaks could survive T6 and be caught only at T11. The fix must be in T0 (key-set definition), T6/T7 (the tasks that handle the 5 underscore-key files), and T11 (cumulative gate).

## Consequences

SC2 "0 leaks" target = union of 63 hyphen-form files ∪ 5 underscore-form files → 0 outside `archive/`. T0 updated to encode both spellings in key-set S. T6 verifies names all 5 underscore-key docs explicitly. T11 gate catches both spellings. The +5 underscore files are NOT a population recount — the 222/204 totals are untouched.

## Related

- [type-aware-strip-disposition-not-blanket-leak](type-aware-strip-disposition-not-blanket-leak.md) — the companion decision defining the FIX-1 type-aware key-set S this finding extends
- [`underscore-aware-leak-gate`](../../../skills/memorization/rules.md) — §4.5 of the memory standard encodes the resulting hyphen-and-underscore-aware gate

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Planning review, Consistency perspective (DOC-CONS-2).
