---
name: fix-d3-d5-review-findings
description: Deferred fix queue for the 29 cycle-2 D3 + D5 adversarial-review findings (review-only — queued for a future scoped session)
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea-d3d5
tags: [evaluation, process]
keywords: [adversarial-review, d3, d5, harness-comparison, text-polish, fix-queue, cycle-2]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Fix the cycle-2 D3 + D5 review findings

## Context

Cycle 2 of the gobbi adversarial-review charter reviewed two dimensions — D3 (harness comparison, 14 findings) and D5 (text-polish, 15 findings) — dual-system, review-only. No source was edited. This backlog queues all **29 findings** as a deferred fix queue. The full evidence, per-axis mechanisms, and per-candidate locations live in the review artifact: `reviews/adversarial-review/2026-06-29-gobbi-adversarial-review-d3-d5.md`.

## Why deferred

The charter mandates review-only passes: findings are staged, not fixed in the review session. Each fix is its own scoped change — some touch capability surfaces (D3), some are doc-centralization edits across multiple skills (D5). They need a fresh Ideation/Planning frame and the user's scope+priority decision before any source is edited.

## The fix queue

### D3 — capability gaps (the 5 both-systems-agree `behind` axes + guardrails)

Directional fixes for the 5 `behind` axes, highest-value first:

1. **D3-005 — Staleness re-sync (High).** Add an Agent-OS "Discover Standards"-style re-extraction pass that re-derives conventions/facts from the live tree, diffs against stored memory, and stages stale-memory candidates with source citations for user-confirmed supersession. Run it as its OWN dual-system loop. (Suggestion-level per charter Decision-5.)
2. **D3-006 — Dependency-aware planning (High).** Add (a) a per-task complexity/priority score, (b) a deterministic "next = highest-priority deps-satisfied task" selector, (c) an `expand_task` split for high complexity. Verify claude-task-master license before reusing code; the scheduling rule is a general algorithm — reimplement fresh.
3. **D3-001 — Skill discovery (Medium).** Add an ADVISORY skill-discovery preflight suggesting candidate SKILL.md paths for Load Directives — never replacing the deterministic hand-listed contract or the grep backstop.
4. **D3-002 — Live progress visibility (Medium).** Add a `todo-from-checklists` projection seeded from the Planning task list + Evaluation Stage-1 frame, surfaced via the runtime's native todo UI; `state.json` stays authoritative.
5. **D3-008 — Token economy / doc-density (Medium).** Extend child-doc layering toward staged injection — Load Directives list only the slice a phase needs, with full-doc escalation. Pairs with the D5 text-polish work.

Lower-priority D3 directional fixes (parity-gap axes): D3-004 additive semantic index, D3-007 first-run portability diagnostic, D3-012 telemetry dashboard projection, D3-013 scaffolder + generated extension index. Axes D3-010 / D3-011 have no current fix (deliberate host delegation). D3-014 is a shallow reference-refresh task to run before any implementation.

**Differentiator guardrails — constraints on EVERY D3 fix, not fixes themselves:**

- The semantic memory index (D3-004) must stay ADDITIVE over the canonical markdown — never a DB replacement.
- Progressive disclosure (D3-008) must NEVER drop the dual-system load-bearing docs (`orchestration/workflow/production.md`; `evaluation/SKILL.md` producer/evaluator separation) from the load path.
- The D3-003 shared-memory idea must never cross into evaluator contexts; the D3-005 re-sync must run as its own dual-system loop.

### D5 — text-polish (centralize / compact / move candidates)

- **Centralize (7 + the split D5-008):** D5-001 dual-system production block (5 loop skills → `production.md`), D5-002 value-telemetry counts (→ `record/SKILL.md`), D5-003 eval file-naming rule (→ `evaluation/SKILL.md`), D5-004 EVALUATION procedure table (→ `orchestration/workflow/evaluation.md`), D5-005 area-selection algorithm (→ `memory/rules.md §1.5`), D5-006 staging-field strip list (→ `memory/rules.md §2.6`), D5-007 Load-Directives companion-path mechanism (→ `delegation/SKILL.md`), D5-008 worktree write-root null→error rule (→ `git/SKILL.md § Worktree CWD discipline`).
- **Compact (4):** D5-009 wrap-up no-delete / move-on-terminal (4× → keep `:84-86`), D5-010 wrap-up idempotency (2× → keep Core Principles), D5-011 coding/review.md available-now-vs-deferred caveat (3-4× → keep `:358`), D5-012 Ideation RECORD section (→ pointer to `record/SKILL.md`).
- **Move (1):** D5-013 code-review taxonomy → new child `skills/coding/review-taxonomy.md` (NOT deletion; leave a compact index table).
- **Keep (2 — no fix):** D5-014 wrap-up routing table + 5-stage pipeline, D5-015 git Procedures P1-P8. Length is procedural/safety-justified.

**SAFETY FLOOR on every D5 edit (drop count = 0):** keep ONE complete statement of each MUST-safety rule — D5-008 (`worktreePath` null→error), D5-009 (no-delete / archive path), and the degraded-mode label rule inside D5-001 (`production_mode: claude-only` + `codex_proposal_absent_reason`, full in `production.md` + `record/SKILL.md:260`). Never compact a safety rule into ambiguity (Principle 7 floor).

## When to pick up

No hard prerequisite. Recommended after the remaining charter dimensions (D2 / D4 / D6) are reviewed, so a single fix campaign can address the full finding set with consistent scope. The two High-severity D3 capability fixes (staleness re-sync, dependency-aware planning) are larger design efforts — each likely its own session. The D5 centralize/compact edits can run as a focused doc-polish session and pair naturally with the D3-008 progressive-disclosure work.

## Suggested approach

Run as a future scoped session: pick up this backlog, frame the chosen subset (D3 capability fixes vs D5 doc-polish — likely separate sessions), and run gobbi's normal Ideation→Planning→Execution loops. Read the review artifact for the per-finding evidence and exact file locations before editing. The user decides scope and priority at pick-up.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-0305008a-4073-428a-8094-fbb6d0808dea-d3d5/`

## Related

- [[gobbi-adversarial-review-d3-d5]] — the review artifact with full per-finding evidence
- [[review-handoff-d2-d4-d6]] — the next-session handoff (review D2 / D4 / D6 first)
- [[run-deep-adversarial-review]] — the parent charter-execution backlog
