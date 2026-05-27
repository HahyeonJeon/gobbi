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

The `agents[]` array persisted in `session.json` by the PostToolUse hook records, per spawned subagent: `id` (UUID), `name` (agent role), `type`, `step`, `phase`, `iter`, `model`, `system`, `transcriptPath` (a local filesystem path), `tokensUsed`, `startedAt`, and `finishedAt`. A Codex risk evaluation of this hook flagged that no formal privacy or retention policy is documented for this persisted data. This backlog entry tracks writing that policy.

## Why deferred

The persisted fields are operational telemetry, not personally identifying information: there is no user content and no credentials. The `transcriptPath` points into `~/.claude/projects/...`, which is already under the user's local filesystem control. Because the data is obvious non-PII today, a formal privacy/retention policy (for example, auto-purge after N days or redaction on publish) is a separate design decision that was out of scope for the hook task, and was deferred rather than blocking the ship.

## When to pick up

Before any `session.json` data leaves the local filesystem — for example, if a future analytics or sharing feature transmits or publishes session telemetry. At that point a formal privacy review should be run, referencing this entry, and a retention/redaction policy decided.

## Suggested approach

Add a brief privacy/retention note to `session.template.json` (low effort) documenting that `agents[]` is local-only operational telemetry, and define the retention rule (keep / auto-purge after N days) plus any redaction required before the data leaves the local filesystem.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/` — Codex risk-perspective evaluation of the `agents[]` hook (two passes).
