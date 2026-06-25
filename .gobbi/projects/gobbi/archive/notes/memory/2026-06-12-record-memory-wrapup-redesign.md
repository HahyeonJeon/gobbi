---
name: record-memory-wrapup-redesign
description: Vocabulary rename (RECORD/memory/memorization) + 2-skill split + 5-stage Wrap-up pipeline redesign shipped across all loops with dual-system PASS
type: notes
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [memory]
keywords: [workflow, vocabulary-rename, wrap-up-pipeline, skill-split, record, memorization]
author: claude
features_touched: [workflow]
loops_completed: [ideation, planning, execution, wrap-up]
shipped: [vocabulary-rename-record-memory-split, wrap-up-5-stage-pipeline, two-skill-restructure-memory-record, sweep-manifest-command-derived, handoff-artifact-spec, claude-md-agents-md-6step-reconcile, 2026-06-13-vocabulary-d5-d6-d7-lock, 2026-06-13-two-skill-hybrid-d10, 2026-06-13-stage3-nonskippable-d11-d13, 2026-06-13-pipeline-order-d8-git-last, 2026-06-13-scope-lock-d12-workflow-feature, 2026-06-13-planning-iter1-fail-disposition, 2026-06-13-planning-iter2-revise-quick-patch-close, 2026-06-13-vocabulary-rename-blast-radius, 2026-06-13-memory-map-split-seam-decision, 2026-06-13-stage3-memory-validation-nonskippable, 2026-06-13-three-surface-loader-fixup, 2026-06-13-workflow-memorization-doc-filename-rename, 2026-06-13-manifest-command-grep-dialect-bug, 2026-06-13-memorization-spread-count-corrected, 2026-06-13-int3-case-sensitivity-note, 2026-06-13-exclude-filter-over-excludes-layer2, 2026-06-13-load-broken-window-task01-to-04, 2026-06-13-task-09-surfaces-verify-false-pass, 2026-06-13-record-memory-wrapup-redesign, workflow-memorization-doc-rename-scope, codex-wrapper-file-persistence-failure, planning-asserted-skill-without-verifying, file-move-needs-link-resolution-check, plan-rename-must-enumerate-all-ref-classes, task-record-template-and-dangling-ref, insight-headlines-factual-not-self-graded, manifest-verbatim-rerun-reproducibility, post-split-gate-both-required, sweep-executor-verification-steps, task-09-evaluation-md-verify]
---

# Record / memory / Wrap-up pipeline redesign

## What happened

The session addressed a long-standing vocabulary collision in the gobbi workflow: the word "memorization" was doing double duty — it named both the per-loop capture sub-phase (an ephemeral worktree-local job) and the durable promotion job that runs at Wrap-up. This ambiguity caused confusion in agent briefings, evaluator findings, and doc cross-references.

**Ideation** ran two iterations. The PI agent pair (innovative + best stances) grounded the design in prior art: WAL vs checkpoint lifecycle (ephemeral log, durable snapshot), audit log vs audit trail naming, agent memory consolidation as a named end-of-session stage, and release pipeline gate ordering. The design converged on three decisions: rename the per-loop sub-phase to RECORD (D5), keep the durable store named memory (D6), and reserve memorization for the Wrap-up promotion stage (D7). The two skills split: `skills/record/` for the per-loop procedure, `skills/memory/` for the durable-tier CRUD standard (D-b, D10). The Wrap-up pipeline was locked to 5 stages with git finalization as stage 5 LAST (D-c, D8) and the memory-validation stage declared NON-SKIPPABLE (D13). Iter1 PASS; iter2 also PASS.

**Planning** failed iter1 on both systems (gate-path defects, unsatisfiable task-02 verify, non-rigorous task-11 gates, missing required-skill on a task). The planning leader performed a REVISE fixing all four clusters. Iter2 PASS both systems. The final plan had 11 tasks: scaffold → split bodies → cross-ref repoint → .claude mirror → .agents mirror → plugin manifests → prose sweep → loop-skill RECORD sections → Wrap-up pipeline → CLAUDE.md/AGENTS.md reconcile → post-split gates.

**Execution** ran all 11 tasks. The main challenge was the file-MOVE scope: task-03 ran a token-residual grep that returned green, but Batch-1 evaluation caught 36 broken cross-tier links that the grep had missed (the links did not contain the renamed token). A remediation commit fixed the broken links and added `check-markdown-links.sh`. Batch-2 evaluation surfaced 5 stale references the original sweep scope had never enumerated (skill-name refs in YAML arrays, wrapper descriptions, plugin inventory rows, pipeline label strings) — a task-07b remediation sweep + `check-residual-vocab.sh` guard closed those. By the end of task 11, all four post-split gates passed: no broken symlinks, all presence checks green, vocabulary residual grep clean, 21-EXCLUDE diff confirmed no out-of-scope changes.

Execution shipped 13 commits. All evaluation iterations — Ideation (iter1 + iter2), Planning (iter1 FAIL, iter2 PASS), Execution Batch-1 + Batch-2 — reached dual-system PASS.

## What shipped

**Features/workflow design:**
- `features/workflow/design/vocabulary-rename-record-memory-split.md` — D-a + D-e vocabulary rename design
- `features/workflow/design/two-skill-restructure-memory-record.md` — D-b + D10 two-skill split design
- `features/workflow/design/wrap-up-5-stage-pipeline.md` — D-c + D8 + D13 five-stage pipeline design
- `features/workflow/design/sweep-manifest-command-derived.md` — D-e manifest with command-derived counts
- `features/workflow/design/handoff-artifact-spec.md` — D-d handoff artifact location and mechanic
- `features/workflow/design/claude-md-agents-md-6step-reconcile.md` — D-f CLAUDE.md/AGENTS.md reconcile

**19 decisions** promoted to `features/workflow/decisions/` covering D5–D16 and the key task-level findings.

**7 discussions** promoted to `features/workflow/discussions/` covering D5–D8 and D10–D16 decision arcs.

**5 references** promoted to `features/workflow/references/` (WAL/checkpoint, audit log/trail, agent memory consolidation, release pipeline gates, pre/post gate artifacts).

**5 checklists** and **1 scenario** and **1 backlog** and **2 plans** promoted to their respective subdirs.

**4 mistakes** promoted to `mistakes/` — 2 with Layer-2 copies in `skills/mistake/`:
- `mistakes/file-move-needs-link-resolution-check.md` + `skills/mistake/layer2-file-move-needs-link-resolution-check.md`
- `mistakes/planning-asserted-skill-without-verifying.md` + `skills/mistake/layer2-planning-asserted-skill-without-verifying.md`
- `mistakes/codex-wrapper-file-persistence-failure.md`
- `mistakes/plan-rename-must-enumerate-all-ref-classes.md`

## What got stuck

- Task-record template: the per-loop RECORD sub-phase now has a named role but no documented template for what a task record should contain. `features/workflow/backlogs/task-record-template-and-dangling-ref.md` tracks this.
- 17 dangling path references in `chat-mode.md` that pointed at `workflow/memorization` pre-rename — confirmed as pre-existing, not introduced by this session. Carried in the same backlog entry.
- ~12 pre-existing broken markdown links in the project tree (not introduced by this session) — tracked in `backlogs/preexisting-broken-markdown-links.md`.

## What shifted

The original planning iter1 assumed that a token-residual grep over the renamed path (`memorization/`) was sufficient to verify the cross-ref sweep. Batch-1 evaluation proved this wrong: 36 links broke without containing the renamed token. This shifted the verify discipline for file-MOVE tasks: link-resolution checks are now required alongside token greps (locked as a mistake + Layer-2 candidate).

The original sweep scope (task 07) did not enumerate skill-name refs, wrapper descriptions, inventory rows, or pipeline labels as reference classes. Batch-2 surfaced 5 that the scope missed. This shifted the planning standard for rename tasks: all six reference classes must be enumerated before writing the task scope (locked as a mistake).

## Decisions to respect

- **D5/D6/D7** (vocabulary lock): the per-loop sub-phase is RECORD; the durable store is memory; the Wrap-up promotion stage is memorization. These three words are not interchangeable.
- **D-b/D10** (2-skill split): `skills/record/` owns per-loop procedure; `skills/memory/` owns durable CRUD standard. The old `skills/memorization/` directory is gone — do not recreate it.
- **D-c/D8** (5-stage pipeline + git last): the Wrap-up pipeline has exactly five stages; git finalization is stage 5 LAST; it runs only after stage 3 PASS. Do not reorder.
- **D13** (stage-3 non-skippable): the memory-validation stage (stage 3) cannot be skipped or bypassed. No `evaluate.mode: skip` can suppress it.
- **D12** (scope lock): the session's scope was the workflow feature only. The 21-EXCLUDE list was verified at task 11. Do not silently expand scope.

## Next session

Three backlog items are open from this session:
1. `backlogs/task-record-template-and-dangling-ref.md` — author the task-record template + fix 17 dangling refs in chat-mode.md.
2. `backlogs/preexisting-broken-markdown-links.md` — fix ~12 pre-existing broken links (domain: docs-sync).
3. `backlogs/wrap-up-orchestration-doc-5stage-parity.md` — optional: align orchestration/workflow/wrap-up.md to 5-stage vocabulary.

The PR for this session's 13 commits is not yet opened (git finalization is manager-owned stage 5).
