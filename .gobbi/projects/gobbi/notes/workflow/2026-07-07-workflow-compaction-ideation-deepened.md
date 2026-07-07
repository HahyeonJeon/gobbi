---
name: workflow-compaction-ideation-deepened
description: Chat-mode Ideation-only session that deepened Point 2's uniform 8-point compaction skeleton into a validated two-doc-kind (loop-orchestration/gate-orchestration) design, hardened by two dual-system evaluation rounds; no implementation.
type: notes
scope: project
feature: null
status: active
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf
tags: [design, docs-sync, process]
keywords: [workflow-compaction, two-doc-kind, deepen-ideation, hoist-then-point, drift-guard, planning-handoff]
author: claude
features_touched: [workflow]
loops_completed: [ideation, wrap-up]
shipped: [workflow-compaction-two-doc-kind, two-doc-kind-compaction-model, point-dont-restate-guard-rule-home, compaction-prototype-scope-parameters, workflow-doc-generalization-unproven, verify-ssot-and-metrics-by-location-not-intent]
---

# Workflow-compaction ideation deepened (two-doc-kind design, no implementation)

## What happened

This was a Chat-mode "deepen ideation" session, scoped explicitly to refine the
`orchestration/workflow/*.md` compaction approach from the 2026-07-06 orchestration-skill
review's Point 2 (`[[point-02-orchestration-skill-compaction]]`, project `reviews/code-review/`)
before a future session implements it. Preparation, Planning, and Execution were never entered
— the loop ran Ideation only, then Wrap-up. Ideation's WORK ran dual-system production (an
independent Claude leader draft + an independent Codex proposer draft, reconciled with zero
escalated rows — 10 of 14 draft rows changed toward the Codex proposal, 4 kept as the Claude
leader's own). The resulting draft went through two full dual-system evaluation rounds — both
evaluators returned `REVISE` at iter1 (8 distinct correctness/precision findings), and the
targeted iter2 fix resolved every finding; the manager verified the fixes and recorded a
manual `PASS`.

## What shipped

**The deepened design — [[workflow-compaction-two-doc-kind]]** (`features/workflow/design/`).
Point 2's original review proposed one uniform 8-point skeleton for all 8
`orchestration/workflow/*.md` docs. This session's Ideation loop found that proposal fits only
5 of the 8 docs (the per-loop wrappers) and does not fit the 3 cross-cutting sub-phase docs
(`evaluation.md`, `record.md`, `production.md`, none of which have a peer skill owning their
manager orchestration). The refined design replaces the single skeleton with a two-doc-kind
model, a concrete pointer mechanism, and a drift guard, validated by a full `ideation.md`
prototype (39% line / 58-59% content reduction, honestly reported both ways).

**Four locked decisions** (all `features/workflow/decisions/`, all feature-scope `workflow`):

- [[two-doc-kind-compaction-model]] — `loop-orchestration` (5 loop docs, 8-point skeleton as
  8 answers) vs `gate-orchestration` (3 cross-cutting docs, a separate 6-point gate-doc
  skeleton with stable `[GATE:{doc}.{gate-name}]` IDs). This is the refinement of Point 2's
  original single-skeleton proposal.
- [[point-dont-restate-guard-rule-home]] — the pointer-discipline rule lives as the FIRST entry
  under `.gobbi/projects/gobbi/rules/docs/`, slug `point-dont-restate-workflow-docs` (this
  project's `rules/` tier was previously empty — `NO_PROJECT_RULES` — and gets its first entry
  from this design). The companion **content-level drift guard is
  `orchestration/scripts/check-workflow-pointer-drift.sh`** — a 7-check script (doc-kind marker
  presence, all-5-typed-pointer-block presence, context-aware tree-redraw detection,
  pointer-form-aware no-commit-restatement detection, no stray `### Dual-system production`
  heading, no seven-perspective table in `evaluation.md`, no session-tree fence in `record.md`)
  that fails closed on any missing/unreadable required doc and avoids non-portable `\b` ERE.
- [[compaction-prototype-scope-parameters]] — five fixed implementation parameters: (1) the
  `**Doc kind:**` marker is visible prose, not frontmatter; (2) the guard's no-tree-redraw check
  covers ALL 8 docs including the 2 gate docs that keep compact tables; (3) prototype order is
  `ideation.md` first, then `execution.md`; (4) `production.md` gets shape-only treatment this
  pass (its runtime-command content is Point 3's separate scope); (5) the DISCUSSION sub-step
  table is (M) orchestration content, not restatable/pointable, and is kept in every loop doc.
- The **hoist-then-point pre-step** (documented inside [[workflow-compaction-two-doc-kind]]
  Part 2, not a separate decision file): a pointer is only valid if its named owner already
  holds the content. A form-covering grep found the no-commit git-mechanics rule lives ONLY in
  the 5 loop docs today — `record.md` has zero hits — so that one block must be HOISTED into
  `record.md` first, before the 5 loop docs are compacted to a pointer. The output-tree and
  dual-production blocks already have live owners and skip the hoist step.

**One process mistake — [[verify-ssot-and-metrics-by-location-not-intent]]**
(`mistakes/verification/`, project-scope). The iter1 draft asserted `record.md` owned the
no-commit rule and reported a 39%-line reduction "hitting the ~40% target" — both on the
strength of intent, not verification. The iter2 grep + honest content-based remeasurement
(58-59%, not 39%) caught it. Filed alongside the two sibling verify-don't-assume mistakes this
mistake extends: [[blast-radius-map-from-named-files-not-exhaustive-grep]] and
[[clean-verdict-unreliable-without-edge-case-stress]].

## What got stuck

Nothing got stuck this session — DISCUSSION, WORK, and both EVALUATION rounds completed inside
one Ideation loop with a clean iter2 `PASS`.

## What shifted

The scope narrowed, on purpose, partway through WORK: an earlier draft claimed the skeleton
"fits the five loop docs cleanly." The dual-system evaluators (independently, both systems)
pushed back — only `ideation.md` has a worked prototype in this session's output. The design
was walked back to the explicit [[workflow-doc-generalization-unproven]] gate rather than
shipping the overclaim.

## Decisions to respect

- **This design REFINES Point 2's skeleton — it does not replace it wholesale.** The future
  implementation session should build the compaction from THIS session's `draft-iter2` model
  (the two-doc-kind split + hoist-then-point + the concrete drift guard), not from Point 2's
  original review recommending one uniform 8-point skeleton for all 8 docs.
- **Generalization beyond `ideation.md` is UNPROVEN** — see
  [[workflow-doc-generalization-unproven]]. Before compacting each remaining doc, Planning MUST
  re-run the 5-gate acceptance test (who to spawn / what to pass / what proves completion /
  which decisions need the user / which doc owns each procedure) per doc AND re-verify that
  doc's own loop-specific (M) content survives the pointer swap:
  - `preparation.md` — the Re-Ideate routing (a manager path-change, not a `REVISE`) + the
    generated-skill sole-writer exception.
  - `planning.md` — the plan-artifact staging + dependency/lane-conflict escalation.
  - `execution.md` — the executor-continuation rule (shared-subsystem/under-cap) + per-task
    nesting + per-task value telemetry.
  - `wrap-up.md` — promotion commits ≠ session-record writes (Wrap-up's RECORD may touch
    memory; this loop's commit boundary is inverted versus the other four).
  - **At least one gate doc** (`record.md` or `evaluation.md`) needs a worked
    gate-orchestration prototype — the Genre B skeleton has zero worked examples yet; this is
    the KEY TENSION this design names but does not resolve.
- **Cross-point coordination with the 2026-07-06 review's other two points** (see
  `[[orchestration-skill-agent-review]]`, `notes/workflow/2026-07-06-orchestration-skill-agent-review.md`,
  the prior handoff this note does not overwrite):
  - Point 3's change-set E edits `workflow/{evaluation,record,production}.md`, which this
    compaction ALSO touches — sequence or fold these so one does not clobber the other.
  - Point 1's `maxIterations` "default 5" lines collide with this compaction's edits — land
    Point 1 first if it has not already shipped.
  - Do ONE combined dead-xref cleanup across Point 3's dead links + Point 2's originally-missing
    mistake files + the recurring `skills-mirror-symlinks-not-copies.md` reference, rather than
    three separate sweeps.
  - Point 3's Codex-runtime matrix and the `agent-teams.md` currency refresh remain outstanding
    from the prior session and are independent of this compaction — they do not block it.

## Next session

The future implementation session should: (1) hoist the no-commit git-mechanics rule into
`record.md` first (the hoist-then-point pre-step); (2) apply the two-doc-kind skeleton to
`ideation.md` using this session's validated prototype as the concrete reference; (3) run the
5-gate acceptance test + loop-specific re-verification on `preparation.md`, `planning.md`,
`execution.md`, `wrap-up.md` before compacting each; (4) prototype the gate-orchestration
skeleton on at least one of `record.md` / `evaluation.md`; (5) ship
`check-workflow-pointer-drift.sh` in the same PR as the `rules/docs/point-dont-restate-workflow-docs`
rule (the design's one still-open recommendation — build the guard with the rule, don't
backlog it); (6) fold in the Point 3 change-set E sequencing and the combined dead-xref cleanup
noted above.

## Related

- [[workflow-compaction-two-doc-kind]] — the deepened design this session shipped
- [[two-doc-kind-compaction-model]] — the locked doc-kind split decision
- [[point-dont-restate-guard-rule-home]] — the locked guard-rule home decision
- [[compaction-prototype-scope-parameters]] — the locked implementation-scope parameters
- [[workflow-doc-generalization-unproven]] — the locked Planning-time gate
- [[verify-ssot-and-metrics-by-location-not-intent]] — the process mistake promoted this session
- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — sibling verify-don't-assume mistake
- [[clean-verdict-unreliable-without-edge-case-stress]] — sibling verify-don't-assume mistake
- [[orchestration-skill-agent-review]] — the prior (2026-07-06) handoff this note does not overwrite; source of Point 2's original review and Points 1 + 3's still-pending items
- [[point-02-orchestration-skill-compaction]] — Point 2's original review this session's design refines
