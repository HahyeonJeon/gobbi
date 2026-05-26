---
name: privacy-retention-agents-metadata-deferred
description: Formal privacy/retention policy for agents[] session.json metadata is not documented; deferred as non-PII for now.
type: backlogs
scope: feature
feature: agents
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [privacy, retention, agents-metadata]
disposition: deferred
domain: privacy
privacy: true
supersedes: null
superseded_by: null
---

# Privacy/retention note for agents[] metadata not formally documented

## Context

A Codex risk evaluation of the agents[] hook (session 1b26cf20) flagged that the `agents[]` data persisted in `session.json` includes subagent IDs, token counts, model names, transcript paths, and timing data. No formal privacy or retention policy is documented for this data.

## Decision

Deferred from T3 scope. The persisted data is non-PII (no user content, no credentials). Formal privacy/retention note is a follow-up.

## Rationale

The `agents[]` fields are operational telemetry: `id` (UUID), `name` (agent role), `type`, `step`, `phase`, `iter`, `model`, `system`, `transcriptPath` (local path), `tokensUsed`, `startedAt`, `finishedAt`. None of these are personally identifying. The transcript path points to `~/.claude/projects/...` which is already controlled by the user's local filesystem.

Formal retention policy (e.g., auto-purge after N days, redaction on publish) requires a separate design decision that is out of scope for T3.

## Alternatives considered

- Add a brief privacy note to session.template.json: low effort; deferred as "obvious non-PII" for now.

## Consequences

Before any session.json data leaves the local filesystem (e.g., if shared via a future analytics feature), a formal privacy review should reference this finding.

## Source

Session 1b26cf20 evaluation — Codex risk perspective, agents[] hook evaluation (two passes). Original finding ref: COD-RISK-003.
