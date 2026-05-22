---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
loop: planning
status: accepted
feature: repo-reset
finding-id: F-CX-PLAN-O2-01
finding-type: design_flaw
domain: process
severity: High
confidence: 90
disposition: addressed
supersedes: null
superseded_by: null
mistake-candidate: true
---

# Tag Form Locked to Lightweight: `git tag <name> <sha>`, NO `-a`, NO `-m`

## Context

iter2's Fix-1 rewrite of Task 01's Special-discipline cell introduced `git tag -a pre-reset-2026-05-21 487fc35` (annotated form). The annotated form without `-m` opens `$EDITOR` — which hangs a headless sonnet executor indefinitely. The Scope Contract Q-F lock and `implementation-checklist.md:19` both require the lightweight form. Cross-system convergence: Claude found the drift across 4 perspectives (Project, Aesthetics, Consistency, Risk); Codex surfaced it as a single High/85 finding.

## Decision

Tag form locked to lightweight everywhere: `git tag pre-reset-2026-05-21 487fc35` — no `-a`, no `-m`. Corrected at all 5+ call sites in draft-iter3.md and staging/plans/main.md.

## Rationale

The lightweight form is the canonical form per Q-F lock, per implementation-checklist.md line 19, per line 154 of the rawdata draft. The iter2 Fix-1 rewrite was a regression. Any annotated form (with or without `-m`) will BLOCK execution when run headlessly.

## Alternatives considered

Annotated form with explicit `-m "<message>"` (would not hang). Rejected: changes the tag semantics and was not authorized by Q-F. Lightweight is the canonical form.

## Consequences

Executor delegation prompt for Task 01 must include "NO `-a`, NO `-m`" in the Special Discipline cell. Self-review grep `rg -n "annotated|tag -a"` proves zero residuals.

## Related

- `planning/rawdata/draft-iter4.md` § D-PLAN-08
- `ideation/artifacts/implementation-checklist.md` line 19
- `ideation/artifacts/scope-contract.md` § Q-F
