---
name: research-ideation-reference-staging-conflict
description: research and ideation skills give the leader opposite instructions on who stages references and when
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-29
session: 40b9a93e-5ec4-43d7-bd16-075b0c7fa303
tags: [docs-sync, process]
keywords: [research-skill, ideation-skill, reference-staging, between-skill-conflict, dogfooding]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
---

# Research and ideation skills contradict each other on reference staging

## What happened
While authoring the Ideation WORK output as the leader, two skills loaded for the same task gave
contradictory instructions for the same write surface. `research/SKILL.md` states the leader
writes external insights to `working/research/{slug}.md` only and MUST NOT write to
`staging/references/` during WORK — RECORD (PASS only) promotes them. `ideation/SKILL.md` WORK
step 2 tells the leader to stamp the references template directly at `staging/references/{slug}.md`
during WORK. The leader cannot satisfy both. Discovered via dogfooding (using gobbi to review gobbi).

## Why it happens
The research skill defines a generic two-step model (leader writes `working/research/`, assistant
promotes at RECORD) to keep `staging/references/` an assistant-owned PASS-only surface. The
ideation skill independently defines a leader-direct staging step. Neither cites the other; each
was authored to be internally consistent, so the cross-skill contradiction was never reconciled.
This is the exact "between-skill" inconsistency class the review's dimensions 2 and 4 target — a
skill is self-consistent but contradicts a peer it is co-loaded with.

## Correct approach
One surface, one owner, one rule. Reconcile by making the ideation WORK step defer to the research
skill's two-step model (leader → `working/research/`, RECORD → `staging/references/`), OR make the
research skill carve out ideation as an explicit exception. Until reconciled, follow the binding
task brief (here the brief + ideation WORK step 2 staged references directly). The deep review must
add a "no co-loaded skill gives the same role opposite instructions for the same surface" check.

## How to detect
Two skills appear together in one Load-Directives block AND both prescribe an action for the SAME
session subdir / role. Trigger phrase: a skill says "MUST never write to X during WORK" while a
co-loaded skill says "write to X during WORK." Grep the Memory Access Matrix rows of co-loaded
skills for the same path with opposite access.

## Related

- [[codex-exec-timeout-exceeds-bash-cap]] — a sibling skill↔harness / between-skill mismatch surfaced by dogfooding the same session
