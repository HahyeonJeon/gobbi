---
name: eval-review-scope-to-merge-base
description: A change-set eval scoped to develop..HEAD (not merge-base..HEAD) after the base advanced makes the evaluator over-escalate base-drift as defects.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-07
session: 5a0709c2-4f59-448c-8aab-88619c33fb90
tags: [verification, evaluation, process]
keywords: [merge-base, develop-head, base-drift, evaluation-scope, false-fail, dual-system]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
---

# Scope a change-set evaluation to merge-base..HEAD, not develop..HEAD

## What happened
The Execution evaluation was delegated with the review target framed as `develop..HEAD`. Mid-session `develop` advanced (to `f5f315cb`), so `develop..HEAD` no longer isolated the branch's authored commits — it also surfaced the base-drift files `develop` had moved past (overlapping `evaluation.md` / `production.md`). The Codex evaluator, pointed at `develop..HEAD`, read that divergence as part of the change-set and escalated it to a Critical FAIL (F-001). The Claude evaluator, scoping to the authored commits, correctly returned REVISE. Manager ground-truth: `merge-base(develop, HEAD)..HEAD` was clean of that drift — F-001 was a MERGE action (rebase + resolve conflicts), not a change-set defect.

## Why it happens
`develop..HEAD` (a `<moving-branch>..HEAD` range) is a moving target: it means "everything on HEAD not on develop's CURRENT tip," so when develop advances the range starts including the base's own drift. An evaluator handed that range cannot tell an authored change from a base-advance artifact, so it attributes unrelated drift to the change-set and over-escalates. The mistaken assumption: "`develop..HEAD` is a stable description of what this branch authored." It is stable only while the base does not move.

## Correct approach
When delegating an evaluation of a change-set on a branch whose base may have advanced, scope the evaluator's review target to `merge-base(<base>, HEAD)..HEAD` — the branch's own authored commits — not `<base>..HEAD`. Pin the merge-base commit in the brief so the review target is a fixed range. If the base genuinely moved, record the divergence as a separate MERGE / rebase action for git finalization, and do NOT let the evaluator treat it as a change-set defect. A cross-system verdict split (one system FAIL, the other REVISE) is the signal to re-check the scope before honoring the harsher verdict.

## How to detect
An evaluation (or any review) brief that frames the review target as `<base-branch>..HEAD` while the base can advance during the session. Red flags: a Critical/FAIL finding whose subject is files that overlap the base's recent commits rather than the branch's authored diff; a cross-system verdict split (Codex FAIL vs Claude REVISE) where the harsher system cites base-divergence; a finding that resolves to "rebase / merge the base" rather than "fix the change."

## Related
- [[verify-zero-new-against-prefeature-base]] — sibling: a regression baseline must be the merge-base (pre-feature) commit, not a mid-feature or moving reference
- [[moving-base-invalidates-diff-stat-gate]] — the moving-base trap on a numeric diff-stat gate; same root (`<moving-branch>..HEAD` is not stable) on a different surface
- [[clean-verdict-unreliable-without-edge-case-stress]] — cross-system divergence is the signal that surfaced this scoping error
