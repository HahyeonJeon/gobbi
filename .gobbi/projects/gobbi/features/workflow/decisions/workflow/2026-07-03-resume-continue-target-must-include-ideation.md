---
name: resume-continue-target-must-include-ideation
description: The resume continue-target must include Ideation, not only Preparation/Planning/Execution/Wrap-up
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [resume, continue-target, mid-ideation-resume, GEN-D7-001]
author: claude
related: [d7-001-split-fresh-init-resume-rehydration-shipped]
---

# Resume continue-target must include Ideation

## Context

GEN-D7-001's row 4 / row 4R split (fresh-init vs resume-rehydration) named the productive steps a
resumed session could continue into, but the first version of that continue-target list omitted
Ideation — implying a resumed session mid-Ideation would restart Ideation rather than continue it.
The Execution loop's iter1 dual-system evaluation caught this as a Claude-side finding (labeled F1
in the reconciliation: Type `design_flaw`, Domain `process`, Severity High, Confidence 85) alongside
Codex's O1 (resume-detection circularity) and O2 (Chat staging materialization) findings.

## Decision

`gobbi/SKILL.md` and `orchestration/SKILL.md`'s row 4R now list all five productive steps —
Ideation, Preparation, Planning, Execution, Wrap-up — as valid resume continue-targets, with an
explicit distinction preserved: resuming mid-Ideation means CONTINUING the persisted, already-Active
Ideation state (read it, validate the row-4R invariants, proceed) — never re-stamping
`workflow.ideation.state = "Active"`, which stays a fresh-only action reserved for row 4.

## Rationale

A resumed session can legitimately be interrupted mid-Ideation (the user closes the terminal
mid-discussion, a `/clear` fires, the harness compacts). Excluding Ideation from the continue-target
meant every such resume would silently re-enter Ideation from scratch, discarding whatever
scope-lock progress the session had made — a narrower but real instance of the same state-clobber
risk GEN-D7-001 set out to close for Preparation/Planning/Execution/Wrap-up. Including Ideation
closes the gap without weakening the no-re-stamp invariant: row 4R still only ever READS a persisted
Active step; the fresh-only stamp stays exclusively a row-4 action.

## Alternatives considered

- **Leave Ideation out of the continue-target and treat a mid-Ideation interruption as always
  restart-from-scratch.** Rejected — Ideation can run multiple discussion rounds and iterations; a
  resumed session restarting it loses real progress and contradicts the "continue, don't clobber"
  intent of the D7-001 fix for every other step.
- **Special-case Ideation with its own resume branch, separate from row 4R.** Rejected as
  unnecessary complexity — row 4R's existing invariants (validate persisted state, never re-stamp,
  fail-safe halt on inconsistency) already generalize to Ideation without a separate code path.

## Consequences

Every place that enumerates the resume continue-target (`gobbi/SKILL.md:107`,
`orchestration/SKILL.md:104` and `:112`) must list Ideation alongside the other four productive
steps, and any future addition of a sixth productive step must extend the same enumeration — this is
now a co-touch site for any change to the productive-step list.

## Related

- [[resume-detection-must-read-only-pre-branch-persisted-facts]] — the sibling iter1 finding (Codex
  O1) fixed in the same iter2 correction pass
