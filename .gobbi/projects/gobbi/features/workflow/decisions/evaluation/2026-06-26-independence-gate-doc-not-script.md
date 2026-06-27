---
name: independence-gate-doc-not-script
description: The proposer-evaluator independence gate (C5/D6.2) is doc/process work — a manual classification checklist wired into the eval-spawn step — not a runnable pass/fail script
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [evaluation, codex, verification]
keywords: [C5, independence-gate, D6.2, manual-classification, eval-spawn, doc-home]
author: claude
---

# The independence gate is doc/process work, and its home is evaluation.md (C5)

## Context

The user locked Phase B = implement ALL of C1–C6. C1–C4 and C6 are scripts / schema changes. C5 is
different: per D6.2 (hardened across iter1/iter2), the proposer↔evaluator independence gate is a
manual/semantic classification — a literal path-grep is explicitly NOT the gate (it false-fails a
legitimate off-limits warning AND misses embedded content). So C5 cannot be "a script that
passes/fails"; it is a checklist the manager applies before each Codex eval spawn, plus a non-gating
advisory grep.

## Decision

Scope C5 as **documentation + process wiring**, not a runnable guard:

1. Author the 5-question classification checklist (from the backlog) as a doc.
2. Wire it into the manager's pre-Codex-eval-spawn procedure.
3. Add the non-gating advisory `grep -rn 'proposals/codex' <eval-prompt>` as a surfacing aid.

**Home:** a sub-section of `orchestration/workflow/evaluation.md` (the manager's eval-spawn
orchestration) — so it loads on the path the manager already reads. Gobbi has no `docs/` convention, so
the backlog's suggested `docs/independence-gate-checklist.md` home was rejected.

## Rationale

D6.2's whole lesson is that meaning, not a string, is the property — so the gate must be a human
classification. Putting the checklist where the manager already loads it (evaluation orchestration)
makes it a real step rather than an orphaned `docs/` file no one opens (the `verify-dont-assert`
anti-pattern: a check no one runs).

## Alternatives considered

- **A pure grep gate** — rejected by D6.2 (the COD-RISK-1 + COD-RISK-2 findings): wrong on both sides.
- **`docs/` home** — discouraged: no existing `docs/` convention in gobbi; an orphaned doc is a check
  no one runs.

## Consequences

Execution added the manual independence-classification gate before the Codex eval spawn in
`evaluation.md`; there is no exit-0 gate to run, so the "verification" is that the manager's eval-spawn
procedure now references the checklist. Shipped as commit `36b37f4f` (C5).

## Related

- [[dual-system-verification-frame]] — the frame whose D6.2 dimension this gate implements
- [[2026-06-26-verification-frame-phase-b-shipped]] — the changelog recording C5's ship
