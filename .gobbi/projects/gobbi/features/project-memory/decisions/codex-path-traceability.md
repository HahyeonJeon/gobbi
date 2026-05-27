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
type: general
domain: docs-sync
finding_ids: [C-PREP-001]
---

# Codex C-PREP-001: Path Precision `.claude/CLAUDE.md:60` vs `CLAUDE.md:60` — Addressed (for the record)

## Context

The Codex evaluator (overall.md, C-PREP-001) noted that the Preparation draft and staged backlog cite the entrypoint doc as `CLAUDE.md:60` when the correct path is `.claude/CLAUDE.md:60` (no root `CLAUDE.md` exists; the file lives under `.claude/`).

The recommended fix was: before Wrap-up promotes the backlog, correct the path in the draft/backlog to `.claude/CLAUDE.md:60`.

## Decision

Addressed by remediation: the staged backlog `dangling-claude-doc-skill-link.md` was DELETED during MEMORIZATION (redundant triplicate — see `triplicate-backlog-remediated.md`). There is no backlog to correct. The path imprecision is moot for the surviving FLAG-2/FLAG-3 records, which are committed files not mutated by this session.

The rawdata draft (`preparation/rawdata/draft-iter1.md`) is preserved as-is per the read-only rawdata constraint; the imprecision is noted here for the record only.

## Related

- `preparation/evaluation/iter1/codex/overall.md` — C-PREP-001 finding
- `preparation/staging/decisions/triplicate-backlog-remediated.md` — primary remediation
