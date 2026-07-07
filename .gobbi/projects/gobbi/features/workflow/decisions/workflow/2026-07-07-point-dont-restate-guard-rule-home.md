---
name: point-dont-restate-guard-rule-home
description: The workflow-doc pointer-discipline rule (FLAG-2) lives as the first rules/docs/ entry, point-dont-restate-workflow-docs.
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf
tags: [design, docs-sync, process]
keywords: [rules, guard, pointer-mechanism, hoist-then-point, drift-guard]
author: claude
---

# FLAG-2 guard-rule home: first `rules/docs/` entry

## Context

The workflow-doc compaction design replaces restated content in `orchestration/workflow/*.md`
with typed owner pointers, enforced by a prose rule paired with a runnable guard
(`check-workflow-pointer-drift.sh`). The rule needed a durable home that is loaded at session
start by every agent, not one that lives only inside a design doc read once at Ideation or
Planning.

## Decision

The guard-backing rule lives as the first entry under `.gobbi/projects/gobbi/rules/docs/`,
slug `point-dont-restate-workflow-docs`: "In `orchestration/workflow/*.md`, any concept whose
SSOT is a peer skill, `record-map.md`, `production.md`, `evaluation/SKILL.md`, or
`record/SKILL.md` is referenced by exactly one typed owner pointer (single, or the two named
split-owners) and MUST NOT be reproduced as a fenced block, redrawn tree, enumerated value
list, or restated procedure. Hoist-then-point: never point at content the owner does not yet
hold."

## Rationale

gobbi's own established pattern pairs a prose rule (the "why") with a runnable guard (the
"gate") — the same pairing `memory/rules.md` § 4 uses for `validate-frontmatter.sh`. The
project `rules/` tier is the correct home because this is a durable, project-wide, load-bearing
behavioral invariant, not a one-off design note: it must survive past this session and be
re-loaded by every future agent touching `orchestration/workflow/*.md`.

## Alternatives considered

- **Leave the rule embedded only in the design doc.** Rejected — a design doc is read once at
  Ideation/Planning, not loaded every session; a future agent editing `workflow/*.md` without
  having read this session's design would have no cue to avoid restating owned content.
- **Stage it as a `notes/` or standalone `design/` entry instead of `rules/`.** Rejected for the
  same non-durability reason — `notes/` and `design/` are not part of the session-start load
  set the way `rules/` is.

## Consequences

`.gobbi/projects/gobbi/rules/` — currently absent/empty (`NO_PROJECT_RULES`) — gets its first
entry, area `docs`, at Wrap-up promotion. `check-workflow-pointer-drift.sh` is the companion
runnable guard; whether it ships in the same PR as this rule or is backlogged is the session's
one remaining open question (see the design doc's `## Open questions`).

## Related

- [[two-doc-kind-compaction-model]] — the compaction model this rule enforces
