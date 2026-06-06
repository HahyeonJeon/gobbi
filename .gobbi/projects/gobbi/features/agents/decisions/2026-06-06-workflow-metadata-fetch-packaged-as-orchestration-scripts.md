---
name: workflow-metadata-fetch-packaged-as-orchestration-scripts
description: Session-operation-metadata fetch is packaged as two runnable shell scripts under skills/orchestration/scripts/ and invoked by the manager at MEMORIZATION and Wrap-up.
type: decisions
scope: feature
feature: agents
status: active
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [orchestration, session-metadata, shell-scripts, telemetry]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Package workflow-metadata fetch as runnable orchestration scripts

## Context

Task 06 of this session established that per-agent token-usage data should be recorded in `session.json` by reading each agent's own transcript. The question was: where does this logic live and how does the manager invoke it? Two options existed: (a) embed the reconciliation prose inline in the orchestration skill and require the manager to reason through the steps, or (b) ship the logic as discrete shell scripts the manager calls by name.

## Decision

The session-operation-metadata fetch is packaged as two runnable scripts under `skills/orchestration/scripts/`:

1. `agent-token-usage.sh [--main] <transcript>` — reads one agent's `.jsonl` transcript and prints cumulative `{input, output, cacheRead, cacheCreation, total}` token counts for that transcript.
2. `reconcile-session-metadata.sh <session.json> <main-transcript>` — the idempotent bulk orchestrator. It enumerates the spawn list from `session.json`, calls `agent-token-usage.sh` on each agent's own transcript, sums the manager transcript via `agent-token-usage.sh --main`, upserts `agents[]` in `session.json` by `id` while preserving routing fields (name, type, model, step, phase, etc.), then recomputes `usage.sessionTotal` and writes atomically under `flock`.

The manager runs `reconcile-session-metadata.sh` at MEMORIZATION and Wrap-up as an idempotent safety net.

## Rationale

Runnable scripts keep the orchestration skill readable: the skill describes the procedure and calls `reconcile-session-metadata.sh`; the implementation is self-contained in the script. The scripts are idempotent (safe to re-run), composable (the bulk reconciler delegates to the single-agent script), and verifiable (the executor dogfood-ran the reconciler on a copy of this session's `session.json` and confirmed the unit transcript total `2544324` for agent `a7363717821bc156d` was reproduced exactly, with `usage.sessionTotal` approximately 151-157M across 24-25 agents). Routing-field preservation and fail-safe-on-bad-input were confirmed by the task-07 evaluation.

## Alternatives considered

**Inline manager prose:** the manager reasons through transcript enumeration and jq arithmetic on each iteration. Rejected: fragile, verbose, and duplicates logic on every invocation.

**CLI subcommand (`gobbi metadata reconcile`):** the TypeScript CLI could expose this. Rejected for now: the scripts are simpler to ship, have no build dependency, and the CLI approach is a future upgrade path, not a blocker.

## Consequences

- `skills/orchestration/scripts/agent-token-usage.sh` and `reconcile-session-metadata.sh` are the canonical implementation. The `.claude/skills/orchestration/` file-symlink does NOT auto-mirror subdirectories; the scripts are reachable via the canonical path today.
- `orchestration/SKILL.md § Recording workflow metadata` documents when and how the manager calls the reconciler. The compact redesign in task 07 merged the prior sub-section, removed the now-redundant `### Session metadata` heading, fixed table column names (`spawn` / `transcript` vs the prior misaligned names), and folded git-stamp timing guidance into the procedure body.
- `reconcile-session-metadata.sh` currently matches `agents[0]` as the manager (index assumption). A `type=="manager"` match would be more robust; see the follow-up backlog.

## Related

- `[[session-operation-metadata-recording-from-agent-transcripts]]` — task-06 decision that established the recording design this task implements.
- Commit `88c6921` — implementation + orchestration skill compact redesign.
- Backlog: `backlogs/wire-metadata-reconciler-into-wrapup-and-claude-mirror.md` — follow-up items deferred from this task.
