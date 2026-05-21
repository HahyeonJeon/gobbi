---
date: 2026-05-21
session: 2026-05-21-6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: repo-reset
finding-id: F-CX-OV-01
Type: design_flaw
Domain: process
Disposition: addressed
Confidence: 100
Severity: High
supersedes: null
superseded_by: null
---

# E.2 SHA Gate Is Impossible (Self-Referential Commit SHA in `session.json`)

## Context

iter2 Codex evaluator (Overall perspective) found that the Stage D/E.2 gate required writing the sweep commit's SHA into `session.json` — which was then staged as part of that same commit. A commit cannot include its own final SHA in a file within its own tree because the SHA is derived from the tree's content (Merkle property). This made the gate logically impossible to satisfy as written. Stage D committed gitignore edits and captured a SHA; Stage E.2 required that same commit to have written its SHA into `session.json`; but the file's SHA changes when the content changes — self-referential loop.

## Decision

iter3 Q-Gate-Redesign removes the SHA-in-session.json pattern entirely. The Out-of-Scope addition explicitly prohibits "writing the sweep SHA into any tracked file." Stage E.2 is replaced with two non-circular `git` pre-conditions:
1. `git log --format=%H -1 <sweep-branch>` returns a non-empty SHA (verifies the sweep branch has at least one commit)
2. `git ls-tree <sweep-branch> <kept-session-dir>/` lists at least one entry (verifies the kept session dir is staged in the branch tip)

Both conditions succeed in the normal flow and fail only on genuine process errors. Neither requires any SHA to be written into any tracked file.

## Rationale

The Codex evaluator caught this during iter2 that the Claude evaluator missed. The finding is the sole driver of the iter2 REVISE verdict. The fix removes a class of impossible gates from the design. The non-circular pre-conditions are independently verifiable and match the `executor-rationalized-failing-verification-gate.md` discipline: they are binary pass/fail with no ambiguity that would invite rationalization.

## Consequences

Stage E.2's gate is now non-circular. The Out-of-Scope list explicitly prohibits writing sweep SHAs to tracked files. Planning inherits this constraint. The F-S-01 and F-U-01 findings (Stage D↔E ambiguity) are both superseded by this finding and its iter3 fix.

## Related

- `ideation/artifacts/implementation-checklist.md` § Stage E.2 gate
- `ideation/artifacts/scope-contract.md` § Out-of-Scope (SHA-in-tracked-file prohibition)
- `ideation/staging/decisions/stage-d-e-commit-boundary-ambiguity.md` (F-S-01, superseded by this)
- `ideation/staging/decisions/stage-e-last-bullet-ambiguous.md` (F-U-01, superseded by this)
- iter2 `evaluation/iter2/codex/overall.md` § F-CX-OV-01
