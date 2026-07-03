---
name: fresh-resume-predicate-strict-complement
description: The fresh/resume predicate is not a strict complement — a crash-mid-Configuration state matches neither literal clause
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process]
keywords: [fresh-vs-resume, strict-complement, crash-mid-configuration, guard-state-2, GEN-D7-001]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Fresh/resume predicate is not a strict complement

## Context

The iter2 fix for GEN-D7-001 rewrote the resume signal to depend on settings + persisted
`state.json` + the row-1 worktree guard, replacing the circular `previousSessionId` check. The
Execution loop's iter2 Claude evaluation (Structure + Consistency perspectives, findings LC-1/LC-2,
Low severity, Confidence 25) confirmed the rewrite closes the Critical clobber path but noted the
fresh-iff and resume-iff clauses, taken literally, do not cover every possible state: a session that
crashes between row 2 (worktree-guard state 2) and row 4 (before `state.json` is more than a
config-only stub) matches neither the literal "resume iff" clause nor the literal "fresh iff (state 1
OR no prior files)" clause.

## Why deferred

This narrow crash-mid-Configuration state is benign — the manager's actual behavior defaults it to
fresh (row 4 stamps Ideation Active), which is correct because no productive workflow state exists
yet to clobber. It does not reintroduce the GEN-D7-001 defect. The gap is a documentation precision
issue (the predicate's prose isn't literally a strict complement), not a live correctness bug, so it
was not blocking for this session's PASS and does not need to gate the fix that was in scope.

## When to pick up

No hard prerequisite. Natural trigger: the next time `orchestration/SKILL.md`'s Configuration
procedure (rows 1-5) is touched for any other reason — fold in an explicit third clause (or an
`else` branch) covering the crash-mid-Configuration case so the predicate is a literal, provably
exhaustive complement instead of relying on "defaults benignly to fresh" as an implicit fallback.

## Suggested approach

Add an explicit third case to the fresh/resume classification: "guard state 2 (worktree exists, no
prior productive state) AND `state.json` is config-only or absent" → classify explicitly as fresh
(not merely by falling through), with a one-line rationale note ("no productive state to clobber").
This turns the current two-clause predicate into a documented three-way partition covering fresh /
resume / crash-mid-configuration, with the last collapsing into fresh by explicit rule rather than by
omission.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-03-bf4dc336-65bd-4a52-9055-d79fc82b7e2e/`

## Related

- [[resume-detection-must-read-only-pre-branch-persisted-facts]] — the Critical fix this Low-severity
  follow-up refines
