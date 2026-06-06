---
name: interview-skill-line72-ties-gate-to-configuration
description: interview/SKILL.md:72 frames the interview auto-recommendation as running "during the workflow's Configuration step" — inconsistent with the gobbi-owns-the-gate boundary; reconcile in a dedicated pass.
type: backlogs
scope: feature
feature: workflow
status: open
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [interview, orchestration, docs-sync, boundary]
---

# `interview/SKILL.md:72` still ties the interview gate to Configuration

## What

`interview/SKILL.md` line 72 (the "Auto-recommendation from Configuration" trigger) reads: *"during the workflow's Configuration step, the manager applies the 3-tier detection from the project-memory baseline check in `gobbi/SKILL.md` § session bootstrap."* This keeps the interview/project-memory gate associated with the workflow's **Configuration** step.

## Why it matters

Session 06668274 task 04 established the boundary principle (user-stated): the project-memory baseline check and interview auto-recommendation are owned by **`gobbi/SKILL.md` session bootstrap**, NOT by orchestration's Configuration step. Task 04 removed the pointer paragraph from `orchestration/SKILL.md § Step 1`. The `interview/SKILL.md:72` wording (and possibly its "Auto-recommendation **from Configuration**" heading) is a residual softer version of the same boundary leak — it still implies Configuration runs the gate.

## Deferred deliberately

The user chose to keep task 04 narrow (orchestration paragraph only) and explicitly deferred `interview/SKILL.md:72`. Reconciling it well requires deciding the exact gobbi-bootstrap ↔ workflow-Configuration ↔ interview-invocation boundary wording (the gate runs in gobbi bootstrap step 5, before the workflow's Configuration step) — worth a dedicated pass rather than a rushed reword.

## Suggested fix

Reword `interview/SKILL.md:72` (and review its heading) so the auto-recommendation is attributed to `gobbi/SKILL.md` session bootstrap (the project-memory check), not to "the workflow's Configuration step." Keep the Empty/Sparse/Mature tier prose. Verify no other doc re-introduces the Configuration-owns-the-gate framing.

## Related

- `[[always-worktree-model-replaces-direct-mode]]` — task 03 decision (dropped orchestration's 3-tier table + row 7).
- Implemented boundary cleanup: commit `28d15e8` (task 04, orchestration paragraph removal).
