---
name: coupling-mischaracterization-deferred
description: "Deferred finding: independence claim for dangling claude-skill link overstated; the coupling to the project-memory feature exists but the finding is deferred."
tags: [coupling, claude-skill, scope, deferred]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
status: deferred
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
type: decisions
domain: docs-sync
---

# "Unrelated to retrofit" independence claim was overstated — but the defer still stands

## Context

The Preparation readiness work characterized the dangling `[claude skill](skills/claude/SKILL.md)` link as "out-of-scope `.claude/`-surface drift unrelated to the memory-doc retrofit."

A Project-perspective evaluation found this independence claim overstated: the gobbi entry-point skill (`skills/gobbi/SKILL.md`, the FLAG-2 row) states the missing `claude` skill's intended home is the `project-memory` value-feature — the exact feature this session retrofits, under Principle 13 (No Document Work Without a Spec) that governs the doc-work.

The coupling exists (same feature, same P13). The draft framing understated it by calling it "unrelated."

## Decision

The defer decision is USER-RATIFIED and stands (explicit avoid-unnecessary-change steer, no skill generated this loop). No re-ideate. The characterization is recorded here as an open annotation — the independence claim was imprecise but the defer is safe and correct.

## Rationale

The defer is correct regardless of the coupling: the memory-doc retrofit itself does not depend on a `.claude/`-authoring skill (independently confirmed by both Claude and Codex evaluators — the hot path is `memorization/rules.md` + `memory-map.md` + `templates/*` + P13 directly). The "unrelated" phrasing was imprecise but did not affect the readiness conclusion.

For future sessions: the correct characterization is "project-memory-feature-adjacent drift, deferred per user's avoid-unnecessary-change steer" — not "unrelated."

## Alternatives considered

- Re-characterize inline in the draft — not done (post-EVALUATION mutation; the rawdata draft is preserved as-is).

## Consequences

- FLAG-2 (HIGH, open) remains the canonical record; its HIGH classification should stand.
- A future session should update the characterization if re-opening the dangling-link item.

## Related

- [`backlogs/claude-doc-standard-skill-missing`](../../../backlogs/claude-doc-standard-skill-missing.md) — the FLAG-2 (HIGH, open) record that remains canonical
- [`skills/gobbi/SKILL.md`](../../../skills/gobbi/SKILL.md) — the entry-point skill whose FLAG-2 row names project-memory as the missing `claude` skill's home
- [triplicate-backlog-remediated](triplicate-backlog-remediated.md) — the sibling decision that dropped the redundant third backlog

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Preparation readiness review, Project-perspective finding F2.
