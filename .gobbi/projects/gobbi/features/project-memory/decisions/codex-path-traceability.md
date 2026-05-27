---
name: codex-path-traceability
description: "Decision: Codex C-PREP-001 path-precision finding addressed — entrypoint doc must be cited as .claude/CLAUDE.md not CLAUDE.md."
tags: [codex, path, traceability, entrypoint]
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
type: decisions
domain: docs-sync
---

# Entrypoint doc must be cited as `.claude/CLAUDE.md`, not bare `CLAUDE.md`

## Context

A path-precision concern was raised against the readiness work: the entrypoint document was cited as `CLAUDE.md:60` when the correct path is `.claude/CLAUDE.md:60`. There is no root-level `CLAUDE.md` in this repository — the file lives under `.claude/`, so the bare-path citation would not resolve for a future reader.

The proposed fix was to correct the path before the related backlog was promoted to project memory.

## Decision

The imprecise citation was resolved by removing the artifact that carried it: the redundant staged backlog tracking the dangling claude-skill link was dropped as a triplicate (see [triplicate-backlog-remediated](triplicate-backlog-remediated.md)). No surviving record carries the bad path. The remaining authoritative backlogs (the HIGH and MEDIUM dangling-link records) are committed files this work did not mutate, so their citations stand as-is.

## Rationale

There was no live record left to correct: the only artifact carrying `CLAUDE.md:60` was the triplicate backlog, and that was removed for a separate reason (atomicity). Editing source rawdata after the fact is forbidden by the read-only-rawdata constraint, so the correct path is recorded here as the durable note instead.

## Alternatives considered

Edit the path inline in the originating draft — rejected: that draft is read-only audit rawdata and must not be mutated after the fact. Recording the corrected path in this decision is the durable substitute.

## Consequences

Future work that re-opens the dangling-link tracking must cite the entrypoint as `.claude/CLAUDE.md`, never bare `CLAUDE.md`. No outstanding correction action remains for this session.

## Related

- [triplicate-backlog-remediated](triplicate-backlog-remediated.md) — the removal of the artifact that carried the imprecise path
- [`.claude/CLAUDE.md`](../../../../../../.claude/CLAUDE.md) — the entrypoint document whose canonical path this decision pins
