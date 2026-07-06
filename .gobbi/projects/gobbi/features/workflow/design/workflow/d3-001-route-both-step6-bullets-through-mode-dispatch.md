---
name: d3-001-route-both-step6-bullets-through-mode-dispatch
description: Fix direction for GEN-D3-001 — gobbi/SKILL.md Step 6 bootstrap entry bypasses the mode-doc dispatch
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [docs-sync, design]
keywords: [gen-d3-001, bootstrap-entry, mode-dispatch, step-6, resume-bullet]
author: claude
---

# GEN-D3-001 — route both `gobbi/SKILL.md` Step 6 bullets through the mode-doc dispatch

## Problem

`gobbi/SKILL.md` Step 6 tells a fresh manager the first productive step is Ideation and to load the
`ideation` skill directly (fresh bullet), and tells a resuming manager to continue by "loading that step's
skill" (resume bullet). `orchestration/SKILL.md` § Workflow instead says the manager reads `settings.mode`
after Configuration and delegates Steps 2-6 to `auto-mode.md` or `chat-mode.md`. The two entry docs disagree
on where control goes after Configuration, for BOTH the fresh and the resume path.

## Scope

In scope: rewriting both Step 6 bullets in `gobbi/SKILL.md` so they route through the mode-doc dispatch.
Out of scope: the mode-dispatched state-machine design itself (a ratified ADR, session `2026-05-28-8eed14fb`)
— this decision does not reopen it, only makes `gobbi/SKILL.md` conform to it.

## Approach

Rewrite the fresh bullet to hand off to `orchestration/SKILL.md` § Workflow, which reads `settings.mode` and
dispatches to the matching mode doc; the mode doc's Step 2 row enters Ideation. Keep a one-line cue that
Ideation is the first productive step, but the dispatch goes through the mode doc, not a direct
`ideation`-skill load. Rephrase the resume bullet so a resumed session continues the persisted active step
through `orchestration/SKILL.md` § Step 1 row 4R + the selected mode doc's state machine — never "loading
that step's skill" directly. The resume CONTINUE semantics (no re-stamp of Ideation; mid-Ideation continues,
not restarts) are preserved verbatim; this is a wording fix, not a behavior change.

## Scenarios

- S1 (golden) — fresh manager: Config → Step 6 → `orchestration/SKILL.md` § Workflow → mode doc → Ideation.
  The two entry docs agree.
- S5 (resume) — Config row 4R rehydrates the persisted active step → Step 6 resume bullet routes CONTINUATION
  through the mode doc's state machine → the step is continued (no re-stamp of Ideation).

Full enumeration lives in `sessions/2026-07-05-1fecddb4-255e-4829-9912-42deb9c36fc8/1-ideation/outputs/ideation-output.md` § Scenarios.

## Validation

Manual fresh-manager reader-journey trace (S1) and resume reader-journey trace (S5). Targeted grep for a
stale direct-load instruction on either bullet (`first productive step is **Ideation**.*load the [.ideation.
skill]|loading that step.s skill` in `skills/gobbi/SKILL.md`) returning no hit. `check-markdown-links.sh`
delta-clean (new links to `orchestration/SKILL.md` § Workflow / § Step 1 row 4R resolve).
`check-workflow-mirror-consistency.sh` stays clean (regression only — no workflow file is added or removed).

## Trade-offs

Rejects reverting `orchestration/SKILL.md` to match `gobbi/SKILL.md` (Option B) because that would break the
ratified mode-dispatch ADR and Chat mode's per-task-slice machine. Rejects leaving both docs live with a
reconciling note (Option C) because that patches the symptom while the contradictory instruction stays live.
Costs a two-bullet edit in one file; no shared-file conflict with the D3-002 or D1-002 fixes beyond a
non-overlapping read-only reference to the same `auto-mode.md`/`chat-mode.md` cluster.

## Open issues

None outstanding for this design direction. Execution owns the actual bullet rewrite; this decision fixes
direction only.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — shares the mode-doc file cluster
  (non-overlapping edit regions)
- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the sibling High finding from the same
  2026-07-01 adversarial review bundle
