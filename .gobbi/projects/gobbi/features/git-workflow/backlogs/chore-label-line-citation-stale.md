---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
scope: feature
feature: git-workflow
finding-id: COD-CONS-ITER3-002
type: general
domain: docs-sync
disposition: open
confidence: 100
severity: Low
supersedes: null
superseded_by: null
---

# `chore` label line citation in `git/conventions.md` is off by 2 lines

## Context

`draft-iter3.md` lines 310 and 524 cite "`chore | #e4e669` at line 261" in `git/conventions.md`. Codex evaluator ran `grep -n` and found `fix` at line 261; `chore` is at line 263.

The branch name `chore/session-{date}-{ssid-short}` is correctly registry-compliant — the label exists at line 263 and the type regex at line 22 includes `chore`. This is a citation-accuracy issue only.

## Decision

Accept as a Low docs-sync finding. Correct the citation from line 261 to line 263 when updating the draft (e.g., during Preparation or Execution docs sweep).

## Rationale

The branch convention compliance is verified independently (regex at line 22 PASS, slug length at line 64 PASS, label at line 263 confirmed). The off-by-2 citation does not affect any runtime behavior or design decision.

## Alternatives considered

Fix immediately: acceptable but not worth blocking current workflow step.

## Consequences

Planning or Execution docs sweep: update `draft-iter3.md:310` and `:524` to reference `git/conventions.md:263` for the `chore` label-color row.

## Related

- `evaluation/iter3/codex/consistency.md` COD-CONS-ITER3-002
- `evaluation/iter3/codex/aesthetics.md` COD-AESTH-ITER3-001
- `evaluation/iter3/codex/overall.md` COD-OVERALL-ITER3-002
