---
name: task01-t1c-trace-overclaim
description: Task 01 traces-to field overclaims T1.c anchor whose actual edit lives in Task 02 — checklist item to align traces-to with actual task assignments.
type: checklists
scope: feature
feature: workflow
status: open
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [planning, traces-to, task-accuracy, checklist]
domain: docs-sync
last_updated: 2026-05-24
---

# Conformance task traces-to overclaim — implementation checklist

Task 01's `traces-to` field claims the git/SKILL.md P2 invocation-note anchor, but the actual P2 invocation-note edit is assigned to Task 02 (`02-git-skill-worktree-path-qualifier`) — as stated in Task 02's own `traces-to` and confirmed in the plan's self-review spec-coverage table. The Task 01 heading also still reads "T1.a + T1.d (partial)" while its `traces-to` lists a different anchor set, so the heading and the trace have drifted apart.

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Task 01 `traces-to` must only include anchors whose actual implementation work happens in Task 01 | novel | pending | Review `traces-to` fields vs file-map assignments before finalizing any future plan revision |
| 2 | Task heading must match the primary `traces-to` anchors (not drift to stale anchor names) | novel | pending | Cross-check heading vs `traces-to` on every plan task before PASS |

## Item details

### 1. Align `traces-to` with the actual file-map assignment

**Anchor reasoning**: novel — no reference governs trace accuracy; the rule is that a task only traces anchors whose edits it actually performs, so the trace stays an accurate audit link.

### 2. Keep the heading consistent with `traces-to`

**Anchor reasoning**: novel — the heading must name the same anchors the trace does, or post-execution audit reads a stale label.

Low severity — the executor reads `traces-to:` fields and the task `what`, not the heading, so the heading mismatch is cosmetic. Accurate `traces-to` fields still matter for post-execution audit (linking what was implemented to what was planned). This was out of the surgical fix scope when surfaced; carry it to a future plan revision or fix it in Execution brief prep.
