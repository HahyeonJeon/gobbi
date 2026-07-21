---
name: harness-todo-and-gen-d4-003-shipped
description: Shipped the harness todo-list doc (Unit A) + the GEN-D4-003 producer-mislabel delegation fix (Unit B); dual-eval REVISE→PASS.
type: notes
scope: project
feature: null
status: active
created: 2026-07-06
session: fe6cbcd3-5e63-46fb-a62e-93308b687d1f
tags: [process, docs-sync, verification]
keywords: [gen-d4-003, harness-todo, dual-system, producer-mislabel, workflow-doc]
author: claude
features_touched: [workflow]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [harness-todo-workflow-mirror, read-model-projection, single-source-of-truth-ui, mirror-topology-needs-inode-not-md5, finding-location-understates-blast-radius, gobbi-worktree-git-pathspec-omits-memory-tree-prefix]
---

# Harness todo-list doc + GEN-D4-003 producer-mislabel fix

## What happened
A two-unit workflow-feature session. **Unit A** documented a manager-owned harness todo
list that mirrors the 6 workflow steps as an always-on progress view — a read-only
projection of `state.json` beside the existing Workflow Status Display (the user asked why
no harness todo list was shown and wanted it in addition to, not instead of, the existing
surfaces). **Unit B** fixed review finding GEN-D4-003: the dual-system-production
instruction block was mislabeled "You are the Claude producer" on surfaces that also serve
the native-Codex role contract, so the fix scoped that block to the Claude producer across
7 files.

Dual-system ran right-sized across the session: **dual-production at Ideation**, **single
at Preparation and Planning**, **dual-eval (mandatory) at Execution**. At Ideation the
Codex proposer corrected a real error — I had concluded the `.agents/` and `plugins/gobbi/`
mirrors were "physical copies" from md5-identity, and inode + edit-propagation evidence
showed they are directory symlinks to canonical (one edit propagates). Codex also surfaced
the Redux/React single-source-of-truth prior art that corroborated the CQRS read-model
insight. Execution dual-eval split Codex REVISE (P1/C1, Med/100) vs Claude PASS (AE-1 Low,
plus CO-2 / RI-1 deferred); reconciled to REVISE, addressed in iter2 (commit e37704eb),
re-evaluated to PASS. Anti-groupthink worked both ways: Codex caught P1+C1, Claude caught
AE-1.

## What shipped
Three commits on branch `claude-2026-07-06-fe6cbcd3-…` off develop `bb5fac20`:
- `34270d86` — fix(delegation): scope the dual-system-production block to the Claude
  producer (GEN-D4-003), 7 files.
- `2e6e63fc` — docs(orchestration): manager-owned harness todo list (Unit A), 3 files
  (`orchestration/SKILL.md` + `agents/manager.md` + mirror).
- `e37704eb` — fix(docs): dual-eval REVISE findings P1/C1/AE-1, 2 files.

PR: **pending — manager-opened to develop** (git finalization is the manager's stage 5).

## What shipped to memory (this Wrap-up promotion)
- `features/workflow/backlogs/process/harness-todo-workflow-mirror.md` — the Unit A
  follow-on backlog (doc shipped; open for design follow-on).
- `references/workflow/read-model-projection.md` + `references/workflow/single-source-of-truth-ui.md`
  — the CQRS read-model + Redux/React prior art behind the state.json-authoritative
  projection design.
- `mistakes/verification/mirror-topology-needs-inode-not-md5.md` — inode, not md5, decides co-touch.
- `mistakes/verification/finding-location-understates-blast-radius.md` — grep the exact
  phrase across all surfaces before scoping a finding's fix.
- `mistakes/verification/gobbi-worktree-git-pathspec-omits-memory-tree-prefix.md` — NEW
  trap: a worktree-root-relative git pathspec that omits `.gobbi/projects/gobbi/`
  false-passes a diff-gate.
- `backlogs/codex/native-codex-proposer-symmetry.md` — appended the RI-1 render-time-gate
  follow-up note.

## What got stuck
Nothing blocked in-scope work. The broader review-FIX campaign still carries **two
un-reconciled corpora** (the Claude / Codex adversarial-review finding sets), left for the
campaign's own reconciliation pass — out of scope this session.

## What shifted
The mid-Ideation correction: "md5-identical mirrors are physical copies" was wrong; the
mirrors are directory symlinks (inode + propagation proved it), so the fix co-touch shrank
to the genuinely distinct physical copies. Eval right-sizing held as designed
(dual-production@Ideation, single Prep/Planning, dual-eval@Execution) and cost nothing in
coverage.

## Decisions to respect
- The GEN-D4-003 fix is **instruction-based prose only** — there is no mechanical
  render-time check that a producer prompt rendered for the correct system. The mechanical
  gate is deferred to the native-Codex path (RI-1 → the backlog note above); do not treat
  the prose fix as if it enforces the label at render time.
- The harness todo list is a **read-only one-way projection of `state.json`** — it never
  writes back, and it is rebuilt from `state.json` on resume.
- Dual-system **right-sizing** (dual-production@Ideation, single Prep/Planning,
  dual-eval@Execution) is the working pattern; keep it.

## Next session
Land the pending PR to develop, then continue the review-FIX campaign. GEN-D4-003 was the
last remaining **High**; what remains is ~25 **Med** (D7-004 blocks D1-003), the
**GEN-D5-012** twin (`features/workflow/backlogs/process/d5-012-ideation-skill-md-stale-routing-copy.md`),
**G2 / G3**, and the two un-reconciled corpora. Low findings deferred: CO-2 (the
"Claude Code bridge" sense — evaluator judged it defensible) and RI-1 (now the backlog
render-gate note).

## Gotchas learned
- **Worktree git-pathspec prefix** — in a gobbi worktree a git `status`/`diff` pathspec
  must carry the `.gobbi/projects/gobbi/` memory-tree prefix; a worktree-root-relative
  pathspec matches nothing and silently false-passes. Bit both the Task-02 executor gate 5
  and the manager eval-fix re-verify this session (now recorded as a mistake).
- **Dual-production earned its keep** — the Codex proposer caught a real mirror-topology
  error and verified prior art at Ideation, not just at review.
- **Eval right-sizing held** — dual only where it pays (Ideation production + Execution
  review); single at Prep/Planning cost no coverage.

## Related

- [[harness-todo-workflow-mirror]] — the Unit A follow-on backlog
- [[gobbi-worktree-git-pathspec-omits-memory-tree-prefix]] — the new verification trap this session
- [[2026-07-05-workflow-doc-routing-3fix-shipped]] — the prior review-FIX session in this campaign
