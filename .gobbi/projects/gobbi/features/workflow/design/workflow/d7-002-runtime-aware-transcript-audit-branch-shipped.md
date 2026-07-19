---
name: d7-002-runtime-aware-transcript-audit-branch-shipped
description: RECORD branches on session.json.system so a Codex-null transcriptPath is a degraded-pass, not a false Critical, as shipped
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [design, process]
keywords: [GEN-D7-002, transcriptPath, session.json.system, degraded-pass, runtime-aware, exit-checklist]
author: claude
supersedes: d7-002-runtime-aware-transcript-audit-branch
superseded_by: null
related: []
---

# Runtime-aware transcript audit branch (as shipped)

> **v0.5.3 current-contract note:** this invariant now applies to the four productive loop skills. Preparation references in the historical problem statement show where the original defect was found; they are not current paths.

## Problem

`codex/SKILL.md` and `gobbi/SKILL.md` permit `transcriptPath: null` for a Codex session when rollout
lookup fails ("do not block"), but `record/SKILL.md`'s RECORD Step 2 raised a Critical
`general`/`unevaluable` finding for ANY absent transcriptPath, runtime-neutral. The "transcript
copied" contract was additionally asserted as a required success at Step 9 VERIFY, the base exit
checklist, the RECORD row in `orchestration/SKILL.md`, the record-map rules, AND word-identically in
each of the five loop docs' own RECORD exit checklists (`ideation/SKILL.md`, `planning/SKILL.md`,
`preparation/SKILL.md`, `execution/SKILL.md`, plus 2 descriptive lines in
`orchestration/workflow/record.md`) — so a Codex session with a legitimately null transcriptPath
failed its own per-loop exit checklist on every single loop, every iteration.

## Scope

In scope: `record/SKILL.md` (the Step 2 CREATE action, the Inputs enumeration, the transcript-capture
paragraph, the Step 9 VERIFY action, the Outputs bullet, the Exit checklist item, the Output-paths
table row), `record/record-map.md` (the transcript-rules copy bullet + a new clarifier bullet),
`orchestration/SKILL.md` (the lifecycle RECORD row). Out of scope: `state.template.json` /
`session.template.json` (no schema change — the fix branches on the EXISTING
`session.json.system` field, never adds a new one); the five per-loop RECORD exit-checklist
restatements (these DEFER to `record/SKILL.md`'s canonical procedure via an explicit
"Canonical procedure ... do not re-derive" note already present in each — confirmed by iter3
ideation-loop verification, so amending the base governs all five without a per-loop edit).

## Approach

RECORD's transcript-copy step and every "transcript copied" contract surface now branch on the
EXISTING `session.json.system` field (`claude-code` vs `codex`) — no new schema field. For
`system: codex` with `transcriptPath: null`: RECORD skips the raw-transcript copy, writes a
lower-severity `general`/`process` audit-degraded note (not a Critical `unevaluable` finding), and
every VERIFY / exit-checklist / RECORD-row surface treats this as a **degraded-pass** — the loop is
not blocked and the checklist item is satisfied by the degraded note, not failed. For
`system: claude-code` with an absent transcript: the Critical `general`/`unevaluable` finding and the
VERIFY-fail / exit-checklist-fail behavior are UNCHANGED — Claude Code always has a resolvable
transcript path, so an absence there remains a genuine, loud failure, never silently downgraded.

A new clarifier bullet in `record-map.md` states explicitly: a Codex-null path is an
audit-coverage degradation, not a licence to promote any raw audit surface — the durable signal
remains `session.json` plus the degraded note, never the raw transcript itself (which stays
gitignored, session-ephemeral, and is never promoted regardless of runtime).

## Scenarios

- **Golden — Codex null.** `session.json.system = "codex"`, `CODEX_THREAD_ID` set, rollout lookup
  fails, `transcriptPath: null` → RECORD skips the raw copy, writes the `general`/`process`
  audit-degraded note, and every VERIFY / exit-checklist surface passes as degraded-pass — the loop
  continues.
- **Golden — Claude Code missing transcript (unchanged).** `session.json.system = "claude-code"` with
  an absent transcript path → still Critical `general`/`unevaluable`, still VERIFY-fail, still
  gate-2-block behavior — no weakening of the existing runtime-neutral rule for Claude Code.
- **Regression check — per-loop restatement deferral.** All four per-loop RECORD exit checklists
  (ideation / planning / execution / wrap-up) carry the "Canonical procedure:
  `record/SKILL.md` ... do not re-derive" deferral note. The pre-v0.5.3 iter3 verification covered
  five loop docs, including the former Preparation loop; the current contract has four restatement
  sites, so the base fix still closes every active site.

## Validation

A runtime-aware trace confirming a Codex-null session passes Step 9 VERIFY and every per-loop exit
checklist as degraded-pass; a trace confirming a Claude Code missing-transcript session still fails
loudly; a case-insensitive, root-relative grep across all four current loop docs plus
`orchestration/workflow/record.md` confirming each restates the "transcript copied" gate but defers
to the base via the canonical-procedure note; both Claude and Codex Execution-loop iter1 and iter2
evaluations confirmed the branch is coherent across `gobbi/SKILL.md`, `orchestration/SKILL.md`,
`record/SKILL.md`, and `record/record-map.md`.

## Trade-offs

Optimizes for: closing the false-Critical / false-exit-checklist-failure defect for every Codex
session on every loop, without adding a new schema field (lower blast radius than the considered
alternative). Accepts: the branch depends on `session.json.system` being set correctly — a malformed
or missing `system` field falls through to the pre-existing general "required field missing → halt"
path rather than a bespoke new halt (a deliberate scope decision; adding a dedicated halt path for an
unset `system` was assessed and declined as unnecessary scope expansion during Execution's
integration reconciliation).

## Open issues

None outstanding — both systems' iter2 evaluation confirmed the fix resolves the defect with no
regression and no new gap.

## Related

(none — this fix is self-contained; no cross-reference to another staged concept from this loop)
