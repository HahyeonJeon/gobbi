---
name: iter-artifact-edited-in-place-destroys-snapshot
description: Editing a prior iteration package destroys frozen evidence; every material revision requires a new full iteration directory.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process, docs-sync]
keywords: [iteration-snapshot, draft-freeze, immutable-evidence, full-revision, subject-digest]
author: claude
priority: medium
domain: process
---

# Never edit a prior iteration's frozen evidence in place

## What happened

In a historical loop, a revision changed the previous iteration's canonical draft in place. The original subject disappeared, evaluator citations no longer referred to the reviewed bytes, and the record could not prove what changed between evaluations.

## Why it happens

The author treated revision as a patch to the latest canonical file instead of a new complete pass. That erases the evaluated subject and tempts the next review to reuse old creation or evaluation evidence.

## Correct approach

Keep every prior `working/iteration-{n}/` and `evaluation/iteration-{n}/` artifact immutable. A user-approved REVISE starts `iteration-{n+1}` with two new independent drafts, two new reciprocal cross-reviews, a new synthesis, resolved open decisions, and two fresh complete evaluation reports.

Do not flip status fields inside prior session artifacts or reuse their evaluator identities. The new subject has a new digest and its own evidence package. `state.json.current.iteration` advances only through the state-machine transition after the finding-disposition gate.

## How to detect

The proposed revision edits any file below a prior `working/iteration-*` or `evaluation/iteration-*` directory, or attempts to keep the same subject digest after a material change. Another signal is a new iteration lacking one of the six required dual-WORK artifacts or either fresh system report.

## Related

- [[freeze-producer-artifact-before-evaluating]] — the WORK-time origin of this freeze discipline
- [[iter-artifact-snapshot-frozen-not-mutated]] — the scenario that covers this trap
