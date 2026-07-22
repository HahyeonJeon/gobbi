---
name: fix-d7-d1-review-findings
description: "Deferred fix queue for the 40 D7+D1 adversarial-review findings (review-only session → future scoped Execution)."
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-29
session: 0305008a-4073-428a-8094-fbb6d0808dea
tags: [evaluation, process]
keywords: [adversarial-review, d7, d1, fix-queue, staleness, live-ux]
author: claude
priority: high
project-scope: true
shipped_in: null
---

# Fix queue — D7 + D1 adversarial-review findings

## v0.5.3 lifecycle reconciliation

The reviewed paths and finding text below remain historical evidence. Do not execute the former
Preparation instructions against the current tree. D1-005, D1-012, D1-013, D1-015, and D1-031 are
closed or obsolete because readiness now runs inside Planning DISCUSSION. D1-028's old
`4-execution/` path must be re-derived against the current `3-execution/` tree. All other findings
remain open only after their locations and assumptions are revalidated against the four-loop model.

## Context

The 2026-06-29 adversarial-review session ran two dimensions — **D7** (live-session UX /
progress-visibility) and **D1** (E2E lifecycle + S1-S7 scenarios, S5 memory-staleness centerpiece) —
dual-system, and produced **40 findings**. The session was **review-only** (charter is review-only;
fixes are separate Execution sessions), so no finding was fixed. This backlog is the deferred fix
queue. The **source of record** for every finding (full per-finding record, evidence, proposed
remediation, cross-system divergence) is
`reviews/adversarial-review/2026-06-29-gobbi-adversarial-review.md`.

## Why deferred

The user chose review-only for this charter slice. Fixing findings is out of scope for a review
session and belongs in a scoped Execution session that can plan, change source, and re-verify.

## When to pick up

Any time after this session — no hard prerequisite. Recommended sequencing: take the **priority
head** first (below), then the systemic doc-sweep clusters, then the Low text-polish items. The S5
staleness items (D1-001 / D1-002 and the PREVENT/REPAIR cluster) are best handled by a dedicated
**design** session that decides the re-sync direction (see the SUGGESTED future direction in the
reviews artifact) rather than spot-fixes.

## Suggested approach

**Priority head (do first):**
- **Critical (2) — S5 staleness, real not theoretical:** D1-001 (no always-on DETECT scan),
  D1-002 (sampled live memory holds concrete stale `active` guidance).
- **High (6):** D1-005 (Ideation→Preparation handoff doc), D1-006 (CLAUDE.md dangling `claude`
  skill link), D1-008 (`workflow/wrap-up.md` missing 5-stage order), D1-010 (Wrap-up PREVENT gap —
  no memory co-touch), D1-011 (staleness review doubly-gated: dormant AND over-cap), and the D7
  High D7-R1 (Blocked/Waiting not file-backed live state).

**Medium (25): group into sweeps rather than isolated edits.**
- *Preparation-omission pattern* (one sweep): D1-013 (sub-step counts), D1-015 (eval fire-point
  list), D1-031 (status-display WORK-verb list) — Preparation was inserted into the lifecycle and
  several enumerations were never updated.
- *Broken-ref / template-drift* (verified Medium): D1-003 (Ideation PASS→Planning doc-precision),
  D1-007 (delegation link too shallow), D1-009 (`session.template.json` missing `iterations[]`).
- *Staleness machinery* (pairs with the Critical design session): D1-021 (no freshness metadata),
  D1-022 (no supersession resolvability guard), D1-023 (move-on-terminal unenforced), D1-024
  (guards syntactic-only), D1-025 (guard invocation/scan-surface drift), D1-026 (no references
  link-rot check), D1-027 (REPAIR detection-gated).
- *Other workflow/skill Medium:* D1-012 (Preparation outputs no consumer), D1-014 (DISCUSSION
  ownership contradictory), D1-016 (EVALUATION-side degraded-mode stamp), D1-017 (Wrap-up stage-2
  name + Glossary gap), D1-018 (iteration-cap escalation drift), D1-019 (`{session-id}`
  Claude-only), D1-020 (Codex install path underdocumented).
- *D7 Medium (UX surface):* D7-R2, D7-R3, D7-R4, D7-R5, D7-R6, D7-R7, D7-R8 — note D7-R5 (Auto
  per-task cursor in state.json) is the PARENT fix that R2/R3/R4 derive from; sequence it first
  within the D7 cluster.

**Low (7):** D1-028 (phantom `4-execution/staging/` source), D1-029 (Planning `dependencies`
should-vs-must), D1-030 (ITER/EXIT 5th-phase clarification), D1-032 (plugin count 22-vs-19) — plus
the three already-Medium-clustered Preparation items appear in their sweep above.

**Note on overlap with existing backlogs.** Some findings overlap pre-existing project backlog
entries (e.g. `archive/backlogs/process/2026-07-21-claude-skill-dangling-ref.md` ↔ D1-006;
`archive/backlogs/process/2026-07-20-wrapup-workflow-doc-broken-delegation-link.md` ↔ D1-007;
`backlogs/process/layer2-references-stale-after-system-dropped.md` is a D1-001/002 witness). A future
fix session should reconcile this consolidated queue against those entries (close or supersede the
narrow ones once the consolidated fix lands) rather than fixing the same surface twice.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-29-0305008a-4073-428a-8094-fbb6d0808dea/`

## Related

- [[gobbi-adversarial-review]] — the source-of-record reviews artifact (all 40 findings)
- [[review-handoff-next-session]] — the next-session handoff
- [[run-deep-adversarial-review]] — the standing review backlog this slice executes against
