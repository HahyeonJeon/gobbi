---
name: workflow-doc-routing-3fix-shipped
description: "3-High workflow-doc-routing bundle (GEN-D3-001/D3-002/D1-002) shipped — the 2026-07-01 adversarial-review FIX campaign continues"
type: notes
scope: project
feature: null
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync, verification]
keywords: [2026-07-01-adversarial-review, gen-d3-001, gen-d3-002, gen-d1-002, review-fix-campaign, option-s]
author: claude
features_touched: [workflow]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [d3-001-route-both-step6-bullets-through-mode-dispatch, d3-002-manager-refs-specialist-phase-loads-column-split, d1-002-canonical-pointer-replaces-drifted-routing-table, evaluator-dispatch-before-work-handoff-complete]
---

# 3-High workflow-doc-routing bundle shipped (GEN-D3-001 / GEN-D3-002 / GEN-D1-002)

## What happened

The 2026-07-01 adversarial-review FIX campaign continued with the 3-High workflow-doc-routing bundle,
picked after landing PR #333 (`6a0d747c`, the prior session's GEN-D2-001/GEN-D3-005 fix). The user chose
this bundle over three other candidate fix units (a 2-High subset, D1-002+D4-003 standalone, or a
corpus-reconcile session) because all three findings share one theme: a manager-facing doc contradicts
the canonical contract it claims to follow. Ideation ran a genuine dual-system design fork on GEN-D3-002 —
the Claude leader's own first recommendation (an advisory legend, Option L) lost to Codex's structural
two-column split (Option S) after the leader re-weighed the root-cause argument; the manager surfaced the
fork to the user rather than self-deciding (Design is Always-Ask). The user locked Option S. Preparation
ran a right-sized manager-verified readiness check (no evaluator spawn). Planning decomposed the locked
design into 3 executor tasks with an explicit sequencing/anchor-coupling note between tasks 02 and 03.
Execution shipped all 3 tasks in one continued executor run, delta-clean against the Preparation-captured
guard baseline, with dual-system EVALUATION PASS (Claude + Codex, all 7 perspectives, no divergence).

## What shipped

- **GEN-D3-001** (`cacc54c7`) — `gobbi/SKILL.md` Step 6: both the fresh-manager and resume bullets now
  route through `orchestration/SKILL.md § Workflow` / the selected mode doc, instead of the fresh bullet
  loading `ideation/SKILL.md` directly and the resume bullet saying "load that step's skill." Resume
  CONTINUE semantics preserved verbatim.
- **GEN-D3-002** (`5946cfa0`) — `auto-mode.md §2` + `chat-mode.md §3`: the single `Refs` column split into
  `Manager refs` (the `workflow/*.md` doc) + `Specialist phase loads` (the phase skill(s) the spawned
  agent loads, including the workflow-header-named companions — `research/SKILL.md` at Ideation Sub-C,
  `memory/memory-map.md` at RECORD — but NOT the full `delegation/SKILL.md` Load block). Applied across
  all 9 per-loop tables (5 auto-mode, 4 chat-mode). The `auto-mode.md:81` inbound anchor to
  `#routing-findings-to-record` preserved verbatim.
- **GEN-D1-002** (`a2c23096`) — `workflow/evaluation.md § Routing Findings to RECORD`: the drifted,
  Type-only local routing table (whose sole `general` row sent findings to `staging/references/`,
  contradicting the canonical Domain-routed table) replaced with a canonical pointer to
  `evaluation/SKILL.md § Finding Metadata` + `record/SKILL.md`, plus 2 inline constraints. The
  `## Routing Findings to RECORD` heading — the live inbound anchor target — kept unchanged.
- 3 commits, 4 files (+54/−56), delta-clean on every changed-source surface (12 pre-existing broken
  markdown links + 3 pre-existing `git/mistakes.md:33` skill-mistakes findings are baseline, outside the
  edit set). Branch `claude-2026-07-05-1fecddb4-255e-4829-9912-42deb9c36fc8`, NOT pushed (manager owns
  git finalization).
- Memory promoted: 8 decisions, 3 design docs, 5 checklists, 2 discussions, 1 backlog cross-ref
  (`features/workflow/backlogs/process/d5-012-ideation-skill-md-stale-routing-copy.md`), 1 project-tier
  mistake (`mistakes/assumption/evaluator-dispatch-before-work-handoff-complete.md`).

## What got stuck

Nothing blocked. One process near-miss surfaced and was recorded as a mistake: at Ideation iter1, the
manager spawned the dual evaluators before the producer (ideation-leader) had returned an explicit
`STATUS: DONE` — a premature `idle_notification` was misread as completion, and the manager itself edited
the producer-owned draft to apply lock markers while the leader independently resumed cleanup edits (two
writers racing one file). The racing edits were cosmetic (stale fork-prose); the locked design content
never changed, so the evaluation stayed valid — but the freeze-before-evaluate invariant was violated and
is recorded as a trap (`mistakes/assumption/evaluator-dispatch-before-work-handoff-complete.md`), related
to but distinct from the existing skill-owned trap `evaluation/mistakes.md#freeze-canonical-candidate-before-evaluating`.

## What shifted

- The D3-002 fork resolution itself (Option L → Option S) was the session's one substantive redirect —
  the leader's own recommendation flipped after weighing that a structural fix makes its own regression
  class non-recurrable, and the user locked that direction.
- One deferred-then-verified gap: the D3-002 design's blast-radius section left "check the rest before
  writing" as a TODO for 5 workflow-header mappings even while locking Option S on an incomplete co-touch
  map. Both Ideation evaluators independently verified all 5 before PASS, so no error resulted — but the
  discipline gap (locking before fully verifying) is itself recorded as a mistake-candidate; the manager
  judged it a MINOR, already-verified-sound observation and dropped it at Wrap-up rather than promoting a
  redundant trap (see the promotion manifest for the explicit drop rationale).

## Decisions to respect

- **Option S is locked** for the `Manager refs` / `Specialist phase loads` structural split — do not
  reopen the L-vs-S fork; see `features/workflow/discussions/memory/2026-07-05-d3-002-structural-split-locked-plus-design-approvals.md`.
- **D5-012 (`ideation/SKILL.md:496`) stays deferred** — the same stale routing-table wording GEN-D1-002
  fixed at `workflow/evaluation.md` also lives at `ideation/SKILL.md:496`; out of THIS bundle's locked
  scope by explicit user decision, tracked as its own backlog item, not silently folded into D1-002.
- **FLAG-2 (the `claude` doc-authoring skill) and GEN-D4-003 stay deferred** — neither was part of the
  locked 3-finding scope; do not fold either into a future doc-routing session without a fresh scope
  decision.
- **The inline-label fallback for D3-002 is user-confirmed** — Option S renders as one `Refs` column with
  per-row two-part inline labels (not a literal two-column table split), because the per-loop tables carry
  a wide prose Action column that renders poorly with 6 columns. Both evaluators confirmed this fallback
  is genuinely within Option S, not a drift back toward the rejected legend (Option L).

## Next session

Continue the 2026-07-01 adversarial-review FIX campaign. This session closes 3 of the original 4
remaining Highs (GEN-D3-001, GEN-D3-002, GEN-D1-002); **GEN-D4-003 is now the only remaining High**
(`backlogs/evaluation/fix-d4-review-findings.md:223`). Also open: ~25 Medium findings, 3 Lows, and
GEN-D7-004 (Medium, blocks full GEN-D1-003) from the same review. The older 2026-06-29 G2/G3 deployment-
hygiene clusters (successor to the shipped G1, PR #329) remain unstarted and are not yet tracked in a
dedicated gobbi memory file — carried forward as manager/session context only.

## Related

- [[d3-001-route-both-step6-bullets-through-mode-dispatch]] — design shipped this session
- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — design shipped this session
- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — design shipped this session
- [[evaluator-dispatch-before-work-handoff-complete]] — mistake promoted this session
- [[d5-012-ideation-skill-md-stale-routing-copy]] — backlog cross-ref promoted this session
