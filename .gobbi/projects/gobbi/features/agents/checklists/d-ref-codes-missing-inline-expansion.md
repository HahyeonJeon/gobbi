---
name: d-ref-codes-missing-inline-expansion
description: Checklist of opaque decision codes (D-3-3, D-4, D-5, D-9) in executor task briefs that lack inline expansion, causing fresh-executor misinterpretation risk.
type: checklists
scope: feature
feature: agents
status: active
created: 2026-05-24
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [executor-brief, inline-expansion, docs-sync]
scenario: executor-brief-self-sufficiency
domain: docs-sync
loop: planning
---

# Opaque decision reference codes lack inline expansion in executor briefs (D-3-3/D-4/D-5/D-9)

## Situation

The session-foundations-bundle-b planning brief (session 1b26cf20) referenced opaque decision codes (D-3-3-resolver step ii, D-4 design file, D-5 skip rationale, D-9 skip rationale) without inline expansion. Without inline expansion, a fresh executor may misunderstand or skip the referenced decision logic.

Examples from the original brief:
- Task 07 brief: "D-3-3-resolver step (ii) directory scan fallback" — refers to a directory scan fallback step in the transcript resolver
- Task 07+08 agent table: "D-9 skip rationale — codify in script header until N≥2" — refers to a decision to defer the gobbi-shell-script-conventions skill (fewer than 2 scripts existed at the time)
- Task 05: "per D-4 design file" — refers to a 5-file enumeration of files in scope (the hook script, reconstructor, session.json writer, unit tests, and integration test)

## Checklist Items

| # | Item | Status | Verification |
|---|---|---|---|
| 1 | Execution brief for Task 07 must inline-expand D-3-3-resolver step (ii): the directory scan fallback in the transcript resolver | pending | Manager adds inline expansion to delegation brief |
| 2 | Execution brief for Task 05 must inline-expand the D-4 5-file scope: hook script, reconstructor, session.json writer, unit tests, integration test | pending | Manager adds inline expansion |
| 3 | Execution brief for Task 07+08 must inline-expand D-9 rationale: no `gobbi-shell-script-conventions` skill yet (fewer than 2 scripts); codify rationale in script header comments | pending | Manager adds inline expansion |

## Notes

The manager can address this during Execution delegation by embedding the relevant decision text directly in each task's brief, rather than relying on the executor to load Preparation iter3 rawdata. The references are resolvable — the Preparation staging artifacts exist.
