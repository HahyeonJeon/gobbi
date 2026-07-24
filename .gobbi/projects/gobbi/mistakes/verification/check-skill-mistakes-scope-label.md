---
name: check-skill-mistakes-scope-label
description: check-skill-mistakes.sh --all is now labelled a wider-than-scope no-regression guard rather than an in-scope conformance check, so a future failure is diagnosed in the skill that actually drifted
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [verification]
keywords: [f3-risk-03, f2-risk-03, guard-scope-labelling, check-skill-mistakes-all, no-regression-guard]
author: claude
priority: low
domain: process
supersedes: null
superseded_by: null
related: []
---

# Label a wider-than-scope guard invocation honestly, so a future failure is diagnosed correctly

## What happened

A plan ran `check-skill-mistakes.sh --all` as a verification step (it checks every companion
`mistakes.md` file project-wide, not only the one file under active edit). At iter1 the wrong invocation
(`check-skill-mistakes.sh <a single SKILL.md>`) was used and failed with dozens of unrelated violations —
a wrong-target guard. At iter2 the target was corrected to `--all`, but the plan did not state that
`--all` checks files OUTSIDE the plan's own edit scope.

## Why it happens

A guard invocation that is technically correct (the right command, the right flag) can still mislead a
reader if its SCOPE relative to the task's own boundary is left implicit. `--all` is deliberately wider
than a narrow edit lock — it is a standing project-wide no-regression check, not an in-scope conformance
gate for one task's edits — and without a label, a future FAILURE of this specific guard step would be
hard to correctly attribute (is it this task's own files, or an unrelated companion the task never
touched?).

## Correct approach

Label the invocation explicitly as a wider-than-scope no-regression guard in the task's own prose,
distinct from the in-scope conformance checks. This is a plan-authoring/self-description discipline: any
standing project-wide guard run inside a narrowly-scoped task should say so, so a failure is diagnosed
against the guard's real scope rather than assumed to be the task's own regression.

## How to detect

A task's verification block runs a project-wide or cross-cutting guard (a linter, a `--all`-flagged
conformance script, a repo-wide check) inside a task whose edit scope is a narrow subset of what the guard
covers, and the task prose does not say the guard's scope is wider than the task's edit boundary.

## Related

(none — cross-cutting process trap; not yet linked to another project mistake)
