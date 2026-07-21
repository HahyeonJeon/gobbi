---
name: workflow-state-record-coherence-fixes
description: Cluster-1 review-fix session — 4 High findings from the 2026-07-01 adversarial review fixed (resume split, RE-IDEATE verdict drop, Chat RECORD staging, Codex transcript degrade)
type: notes
scope: project
feature: null
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [cluster-1, GEN-D1-001, GEN-D1-003, GEN-D7-001, GEN-D7-002, review-fix-campaign, dual-system]
author: claude
features_touched: [workflow]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: true
---

# Workflow-state + RECORD coherence — Cluster 1 review-fix session

## What happened

This session continued the 2026-07-01 adversarial-review fix campaign (PR #329's aftermath),
scoped to exactly Cluster 1's 4 validated High findings — each a doc that promised a
state-machine or RECORD behavior the schema or reader could not actually represent:

- **GEN-D7-001** — the resume path re-stamped `workflow.ideation.state = "Active"` unconditionally
  on every Configuration entry, so a resumed session mid-Execution silently reset to Ideation.
- **GEN-D1-001** — `RE-IDEATE` was framed as an evaluator "verdict" the aggregation model and
  `state.json` schema cannot actually emit.
- **GEN-D1-003** — Chat mode's per-slice RECORD staged typed findings into a subtree
  (`chat/tasks/{NN}-{slug}/...`) Wrap-up's promotion inventory never globbed, so Chat findings
  were unpromotable.
- **GEN-D7-002** — RECORD's transcript-copy Critical rule did not account for Codex's
  permitted-null `transcriptPath`, so a Codex session would false-fail a Claude-only invariant.

## What shipped

Ideation locked 4 fix directions (3 loop iterations — iter1 FAIL, iter2 REVISE, iter3 PASS by
manager-verified convergence). Preparation confirmed readiness with no gaps (iter1 PASS). Planning
decomposed the locked design into a strictly sequential 4-task plan (iter1 PASS): T01 (D7-001) →
T02 (D1-001) → T03 (D1-003) → T04 (D7-002), run as 2 continued executor sessions (E1: T01→T02, E2:
T03→T04). Execution shipped all 4 tasks (iter2 PASS after 1 REVISE round) as one focused commit per
task, editing `orchestration/SKILL.md`, `gobbi/SKILL.md`, `orchestration/auto-mode.md`,
`orchestration/workflow/preparation.md`, `preparation/SKILL.md`, `orchestration/chat-mode.md`,
`wrap-up/SKILL.md`, `record/SKILL.md`, `record/record-map.md`.

Each fix's corrected mechanism:
- **D7-001** — Configuration splits fresh initialization from resume rehydration. Resume reads three
  pre-branch-persisted facts (`settings.json` exists, `state.json` shows a non-Configuration
  Active/Revising step, the row-1 worktree guard is not orphaned) — never a field the same branch
  stamps. Mode reconfigure on resume is tolerated, not a false halt. The resume continue-target
  includes Ideation (not only Preparation/Planning/Execution/Wrap-up).
- **D1-001** — `RE-IDEATE` collapsed into the existing Preparation DISCUSSION model: a per-gap user
  decision, never an evaluator/aggregation verdict. The 3 verdict-framing sites were deleted.
- **D1-003** — Chat mode now runs the UNMODIFIED base RECORD procedure per slice (no Step 6-7 skip,
  no "Wrap-up mines the transcript" promise); Wrap-up's promotion inventory is extended to glob the
  Chat staging subtree at every site (Memory-Access-Matrix row, the rule, Inputs, Step-2).
- **D7-002** — RECORD branches on the existing `session.json.system` field: a Codex-null
  `transcriptPath` degrades to a lower-severity audit note and PASSES every exit checklist; a
  Claude Code session missing a transcript still fails Critical. No new schema field was added.

## Dual-system anti-groupthink wins

- **Ideation** caught a Critical false premise at iter1 (Claude Project perspective, F-PROJ-1):
  the locked D1-003 rationale ("no GEN-D7-004 dependency, wrap-up unchanged") was actually false —
  the recommended direction still required a Wrap-up-side inventory change. Corrected at iter2
  without reopening the user's already-locked choice — the model stayed (b), the design under it
  was fixed.
- **Execution** iter1 dual-system evaluation independently caught two distinct classes of defect:
  Codex found **O1** (Critical, confidence 85, cross-confirmed by Claude) — the resume-detection
  predicate depended on `session.json.previousSessionId`, a field stamped only AFTER the very
  branch it was meant to gate, making a session's FIRST resume circular and mis-classified as
  fresh — and **O2** (High) — the D1-003/D7-004 dependency (Chat staging is unpromotable without
  the deferred scaffold) had already resurfaced 3 times across the feature's lifecycle without
  being recognized as the same pre-existing gap. Claude independently found **F1** (High,
  confidence 85) — the resume continue-target omitted Ideation. All three were fixed at iter2.
- 2 evaluation iterations ran in both Ideation and Execution; Preparation and Planning each passed
  clean at iter1 with zero adversarial findings.

## What got stuck

None of the 4 in-scope findings were deferred. Three items were explicitly carried out of scope by
the locked Scope Contract and remain open in `backlogs/`:
- **GEN-D7-004** (chat/tasks scaffold + drift-gate materialization) — the dependency GEN-D1-003
  documents as manager-materialized in the interim; building the scaffold/drift-gate tooling itself
  is deferred.
- **fresh/resume predicate strict-complement gap** — a crash-mid-Configuration state matches
  neither the fresh nor the resume literal clause; low priority, unresolved by this session's fix.
- **Pre-existing `check-markdown-links.sh` false-positive** on worktree-nested `.claude/hooks|scripts`
  links — unrelated to this session's edits, filed as its own backlog item.

## What shifted

The `RE-IDEATE` collapse (D1-001) removed a schema-shaped concept (a "verdict" value) rather than
adding one — the corrected model is strictly simpler (one fewer aggregation-verdict case) than the
draft it replaced.

## Decisions to respect

- **Resume detection reads only pre-branch-persisted facts** — never a field the same branch
  stamps (the general circular-predicate rule this session's D7-001 fix encodes).
- **`RE-IDEATE` is a DISCUSSION-model user decision, never an evaluator verdict** — do not
  reintroduce a `RE-IDEATE` enum value anywhere in the aggregation/state model.
- **Chat mode's per-slice RECORD is the UNMODIFIED base RECORD procedure** — no Chat-specific
  reconstruction step exists; Wrap-up's inventory extension is the only Chat-aware surface.
- **Codex-null `transcriptPath` is a degraded-pass, Claude-null is still Critical** — the
  runtime-aware branch in `record/SKILL.md` is the single site; per-loop exit checklists defer to
  it and were NOT independently edited.

## Next session

3 of the original 2026-07-01 review's Highs remain open outside this session's locked Cluster-1
scope (GEN-D1-002, GEN-D2-001, GEN-D3-001/002, GEN-D4-003) — see the review files under
`features/workflow/reviews/` (if promoted in a prior session) for the full finding set. This
session's own follow-ups are `archive/backlogs/process/2026-07-20-d7-004-chat-tasks-scaffold-and-drift-gate.md`
(high priority) and `backlogs/workflow/fresh-resume-predicate-strict-complement.md` (low priority).
A PR for this session's 7 commits is pending manager finalization at Wrap-up stage 5 (after this
promotion's dual-system memory-validation gate passes).

## Related

- [[d7-001-split-fresh-init-resume-rehydration-shipped]] — the D7-001 design as shipped
- [[d1-001-drop-re-ideate-verdict-shipped]] — the D1-001 design as shipped
- [[d1-003-chat-staging-wrapup-inventory-extension-shipped]] — the D1-003 design as shipped
- [[d7-002-runtime-aware-transcript-audit-branch-shipped]] — the D7-002 design as shipped
- [[workflow-state-record-coherence-fix-plan]] — the Planning-loop task decomposition
