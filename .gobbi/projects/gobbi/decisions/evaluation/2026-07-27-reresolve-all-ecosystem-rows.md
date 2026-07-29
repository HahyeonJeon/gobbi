---
name: reresolve-all-ecosystem-rows
description: Record the approved Task 18 all-row ecosystem evidence correction and waiver.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-27
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [execution, evaluation]
keywords: [react-pr-369, task-18, ecosystem, version-timestamps, claude-absence]
author: user
supersedes: null
superseded_by: null
---

# Re-resolve every ecosystem row before making a global selector claim

## Context

The user approved `CODEX-CONSISTENCY-001` as `open`.

## Decision

Task 18 iteration 3 must
retain the exact-version publication method and apply it mechanically to every
affected concrete npm row before the file makes an all-row claim. Statuses must
be recomputed from those version-specific timestamps. Wildcard package
families and non-registry entries require explicit evidence handling rather
than an invented selector result.

Codex-only continuation is authorized by `Claude absent Execution iteration 3
task 18.`

## Rationale

An all-row claim requires the same exact-version evidence method for every concrete row and explicit handling for exceptional rows.

## Alternatives considered

Sampling was rejected because it cannot support an all-row claim. Inventing selector results for wildcard or non-registry entries was rejected because those inputs lack the required evidence.

## Consequences

Every affected ecosystem row must be recomputed before retaining the global claim. No Claude, publication, or merge evidence is implied.
