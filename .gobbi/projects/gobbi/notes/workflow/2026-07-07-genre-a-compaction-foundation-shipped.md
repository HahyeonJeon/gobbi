---
name: genre-a-compaction-foundation-shipped
description: Session shipped the Genre-A foundation of the workflow-doc compaction (6 commits) + first rules/ entry + drift guard; Genre-B and the develop rebase deferred.
type: notes
scope: project
feature: null
status: active
created: 2026-07-07
session: 5a0709c2-4f59-448c-8aab-88619c33fb90
tags: [docs-sync, refactor]
keywords: [genre-a, workflow-doc-compaction, hoist-then-point, pointer-drift-guard, handoff]
author: claude
features_touched: [workflow]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [point-dont-restate-workflow-docs, genre-a-compaction-foundation, eval-review-scope-to-merge-base]
---

# Genre-A workflow-doc compaction — foundation shipped

## What happened
This session shipped Option A (the Genre-A foundation) of the two-doc-kind workflow-doc compaction locked in #339's design. Ideation ran single-mode against a user-locked scope contract; Planning decomposed it into 5 tasks; Execution implemented them in 6 commits under mandatory dual-system evaluation. The iter1 evaluation diverged (Codex FAIL ↔ Claude REVISE) — reconciled to REVISE — and iter2 remediation reached PASS. The order was fix-first: latent B-fixes and doc-kind markers before any deletion, then hoist-then-point, then the `ideation.md` rewrite, then the drift guard.

## What shipped
- `rules/docs/point-dont-restate-workflow-docs.md` — the project's FIRST `rules/` entry (point-don't-restate; guard = `check-workflow-pointer-drift.sh`).
- `mistakes/verification/eval-review-scope-to-merge-base.md` — scope a change-set evaluation to `merge-base..HEAD`, not `develop..HEAD`.
- `features/workflow/changelogs/workflow/2026-07-07-genre-a-compaction-foundation.md` — the shipped-work changelog (6 commits; 58% / 59% ideation.md reduction; guard + manifest).
- Code (branch `claude-2026-07-07-5a0709c2`, base `7deea77c`): 6 commits cc2bff25..7250ef4b + `check-workflow-pointer-drift.sh` + `pointer-drift-manifest.txt` + `.claude` mirror.

## What got stuck
`develop` advanced to `f5f315cb` mid-session, overlapping `evaluation.md` + `production.md`. The branch's authored commits (`merge-base..HEAD`) stayed clean, but the divergence is an open MERGE action, not a change-set defect. It is deferred to the manager's git finalization (rebase + resolve conflicts + re-run guards before PR).

## What shifted
Scope was narrowed at Ideation from the design handoff's "first increment incl. ≥1 gate doc" to Option A (Genre-A foundation only) — a Principle-5 user decision that quarantines the UNPROVEN Genre-B generalization to a dedicated follow-up. The corpus baseline was re-pinned to 1,545 lines (not the design's 1,539) after #340/#341 landed.

## Decisions to respect
- Scope = Option A (Genre-A foundation); Genre-B gate-doc rewrite + gate-ID machinery + the other 4 loop-doc rewrites stay deferred. See [[two-doc-kind-compaction-model]].
- Build the drift guard in-PR (a dedup without a guard regrows).
- `**Doc kind:**` marker on all 8 docs now; only `ideation.md` is fully Genre-A compacted this pass.
- Generalization of the Genre-A model beyond `ideation.md` is UNPROVEN — the Planning gate for each further doc still applies. See [[workflow-doc-generalization-unproven]].

## Next session
Manager finalizes git first (rebase onto develop `f5f315cb`, resolve `evaluation.md` / `production.md` conflicts, re-run guards, open/merge PR). Then the deferred waves: Genre-B gate-doc rewrite + gate-ID machinery, the other-4 loop-doc Genre-A rewrites, and the broader P2/P3 campaign items (P1 Task 1.2 length cut, P3 A/B/D/E, combined dead-xref cleanup).

## Related
- [[workflow-compaction-two-doc-kind]] — the locked design implemented this session
- [[two-doc-kind-compaction-model]] — the loop-orchestration / gate-orchestration decision respected
- [[point-dont-restate-workflow-docs]] — the first rules/ entry shipped
- [[eval-review-scope-to-merge-base]] — the mistake promoted this session
