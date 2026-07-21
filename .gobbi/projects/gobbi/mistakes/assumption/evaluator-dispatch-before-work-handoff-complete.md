---
name: evaluator-dispatch-before-work-handoff-complete
description: The manager dispatched evaluators before the WORK package and writer handoff were complete, creating a moving target.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [process]
keywords: [freeze-before-evaluate, status-report, idle-confirmation, artifact-reread, one-writer]
author: claude
priority: high
domain: process
---

# Do not dispatch evaluators before WORK handoff is complete

## What happened

In a historical Ideation iteration, the manager treated an idle notice as completion, edited the same candidate as the assigned leader, and dispatched evaluators while the leader could still write. The evaluators reviewed different bytes from the artifact later presented as frozen.

## Why it happens

An availability signal was mistaken for a structured status report, and artifact ownership was not explicit. The manager skipped the required report, idle/addressability confirmation, and reread sequence, so neither task completion nor byte immutability was proven.

## Correct approach

Wait for the assigned specialist's explicit structured report for the stable assignment. Confirm the dispatch is idle and addressable, then reread the promised synthesis and complete dual-WORK package. Require the package validator to pass, resolve every material item in `open-decisions.md`, and freeze the subject digest. Only then transition `state.json` to EVALUATION and dispatch two fresh evaluators.

Keep one writer for the synthesis. If a user decision changes it, route the edit through that writer and repeat the completion handshake. An idle notification or lagging task-list status is only scheduling information; it never proves completion or failure.

## How to detect

The only completion evidence is an idle notice, task-list state, or the manager's visual judgment. Other signals are an unresolved decision, a failing package validator, an active writer, or a synthesis hash that changes after evaluator dispatch.

## Related

Sibling trap (skill-surface, not a memory-tier `[[slug]]` link): `skills/evaluation/mistakes.md#freeze-canonical-candidate-before-evaluating` covers the same immutable-subject boundary from the evaluator side.
