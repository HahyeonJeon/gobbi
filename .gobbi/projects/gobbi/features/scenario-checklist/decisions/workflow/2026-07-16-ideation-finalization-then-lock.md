---
name: ideation-finalization-then-lock
description: At the 5-iteration cap with 2 mechanical residuals, the user chose one finalization pass over a 6th dual-system iteration; both residuals closed, design LOCKED.
type: decisions
scope: feature
feature: scenario-checklist
status: accepted
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [ideation, verification]
keywords: [finalization, no-touch-gate, symlink-gate, lock]
author: claude
related: [no-touch-git-gate-has-many-fail-open-modes, four-ideation-forks]
---

# One finalization pass, not a 6th iteration, to close the last two residuals

## Context

Ideation iter5's Codex evaluation (`evaluation/iter5/codex/evaluation.md`) returned REVISE with two
residuals against `working/draft-iter5.md`: a new High (`COD5-RISK-001` — the no-touch gate's protected
pathspecs do not traverse a symlinked directory, so a symlinked parent directory bypasses every leg) and
a Medium (`§4.7`'s token definitions still re-encoded CR-4's per-mode scoping instead of pointing at it).
This was already the 5th Ideation iteration; a 6th full dual-system iteration (fresh Claude + Codex
producer/proposer round) was the default next step per the loop's normal REVISE handling.

## Decision

Instead of a 6th full dual-system iteration, the user chose one bounded **finalization pass**: fix
exactly the two residuals, tool-verify each fix directly, and lock the design without spawning a fresh
Claude/Codex production round. Both residuals closed in this pass:

1. **Symlink-aware gate (6th leg).** Added a leg that fails on ANY untracked symlink under the
   protected root (`.gobbi/projects/gobbi/skills/`), because git pathspecs do not traverse symlinks —
   the existing 5 legs could not see a protected pathname exposed through a symlinked parent directory.
   Tool-verified fail-closed for both a symlinked parent directory and a direct symlinked leaf file; the
   clean tree still passes and the real worktree has 0 symlinks under the root (no false-fail).
2. **§4.7 CR-4 de-dup.** Removed §4.7's duplicate per-mode token-scoping encoding; the per-mode grid now
   points at CR-4 instead of restating it, so CR-4 is the sole home of that invariant.

The resulting artifact (`working/draft-iter5-final.md`, promoted verbatim to `outputs/design.md`) is
LOCKED — zero open findings.

## Rationale

- Both residuals were mechanical (a missing gate leg; a placement duplication), not open design
  questions — a fresh dual-system iteration exists to surface NEW findings on a changed draft, not to
  re-verify a fix whose correctness a direct tool run can already prove.
- Tool-verifying the symlink fix directly (constructing both counterexamples — a symlinked parent
  directory and a symlinked leaf file — in a scratch repo and confirming the gate exits 1 for both, and
  PASS for a clean tree) gives stronger, more specific evidence than a general-purpose evaluator re-read
  would, at a fraction of the cost of a 6th iteration.
- At the 5-iteration point, running a 6th full iteration risked re-opening already-confirmed-closed
  findings (design draft §11's "Confirmed-closed model" list) to a fresh evaluator pass, rather than
  converging.

## Alternatives considered

- **A 6th full dual-system iteration** — rejected by the user: disproportionate to two mechanical
  residuals; risks re-litigating the 9 already-confirmed-closed findings listed in §11.
- **Ship with the 2 residuals as accepted risk** (decision-record them instead of fixing) — rejected:
  `COD5-RISK-001` is a real fail-open gap in the Success Criterion's own no-touch gate (see the related
  mistake), not a low-severity or genuinely-out-of-scope item; accepting it would ship a security-gate
  hole into the artifact the rest of the workflow depends on.
- **A partial re-evaluation** (Codex-only re-run without a fresh Claude producer draft) — rejected in
  favor of direct tool-verification: re-running an evaluator on a two-line mechanical fix adds cost
  without adding confidence beyond what a constructed counterexample already gives.

## Consequences

- `outputs/design.md` is stamped `status: final` (from the design draft's own `status: locked`) and
  carries the finalization's own Change Log (§10) documenting exactly what changed from `draft-iter5.md`
  and why.
- No `evaluation/iter6/` directory exists for this loop — the finalization pass is tool-verified, not
  agent-evaluated; a future reader auditing "were all 5+ iterations evaluated by both systems" should
  expect iter5 to be the last evaluated iteration, with the finalization proof living in the design
  draft's own §1 "Fail-closed proof" section, not in a 6th evaluation bundle.
- The corrected no-touch gate (6 legs) is the one Planning and Execution must use verbatim as the
  Success Criterion's self-failing check — the finalization pass is the reason it has 6 legs, not 5.

## Related

- [[no-touch-git-gate-has-many-fail-open-modes]] — the mistake describing why the no-touch gate needed
  six legs, including the symlink leg this finalization pass added
- [[four-ideation-forks]] — the Scope Contract this finalized design fulfils
