---
name: sweep-every-occurrence-when-fixing-a-multi-surface-claim
description: A fix corrected a claim in its primary doc but left the same claim stated in a sibling child/scenario/checklist, so the "fixed" defect resurfaced as a residual round after round.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-16
session: 054f402b-a9ab-4af6-875d-078233778a0b
tags: [process, docs-sync, verification]
keywords: [fix-propagation, residual, grep-sweep, multi-doc, crud-9w1h, half-applied-fix]
author: claude
priority: high
domain: docs-sync
---

# A spot-fixed claim left residuals in sibling docs and re-failed every review round

## What happened

Across a multi-doc skill review, the same corrected claim kept resurfacing as a "residual of a fixed defect":

- The bare-`void`-is-not-a-promise-handler correction was applied to `SKILL.md` and `async-resources.md` but
  missed `scenarios.md` (a seed scenario still called a bare `void` "Good handling").
- The Node-strips-vs-Bun/Deno-transpile correction was applied to `runtime-deltas.md` line 223 but left ~6 other
  surfaces (SKILL.md H3, modules-tooling §4, checklists TS-CHECK-03, scenarios TS-SCENARIO-05, …) still calling
  the shared direct-run mode "type-stripping."

Each was caught in a LATER review round (iter2, iter3) as a fresh High/Medium finding, costing extra
review+fix cycles for what was one logical correction.

## Why it happens

A skill (or any doc set) states the same rule on multiple surfaces by design — the SKILL.md rule, the child-doc
mechanics, the seed scenario, the checklist item, the eval crosswalk. Fixing "the doc" naturally means editing
the surface in front of you (the one the finding cited), and the fix then LOOKS complete. But a claim that lives
in N surfaces needs N edits; a spot-fix of one is a half-applied fix. The other surfaces are exactly where an
adversarial reviewer (or the next reader) hits the stale version.

## Correct approach

When a fix corrects a factual/normative CLAIM (not a one-off typo), treat it as a project-wide sweep, not a
single edit: `grep` the whole doc set for every phrasing of the claim and fix each occurrence in the SAME
change. This is principle-9 CRUD+5W1H applied to a claim — enumerate the affected surfaces (parent rule, child
mechanics, scenario, checklist, crosswalk, examples) before editing, and verify with a residual grep to zero
afterward. A residual grep ("no occurrence of the old phrasing remains") is the completion check, the same way a
harness/link guard is a completion check.

## How to detect

Signals you are about to leave a residual: the cited finding is in ONE file but the claim is a general rule the
skill teaches (rules/scenarios/checklists all restate it); or the fix reword touches a term that appears many
times (`grep -c` shows > 1). Signal it already happened: a re-eval returns a finding that is the "same class" as
one you fixed last round, in a different file. Before committing a claim-fix, run `grep -rniE "<old phrasing>"`
over the whole doc set and require zero hits outside the intended edits.

## Related

- [[verify-time-sensitive-facts-not-hedge-from-stale-cutoff]] — a sibling review-round lesson from the same
  session.
- Reinforces principle 9 (Think CRUD-and-5W1H before editing) and principle 10 (finish in-scope work) — a
  half-propagated fix is both an un-traced blast radius and an unfinished edit.
