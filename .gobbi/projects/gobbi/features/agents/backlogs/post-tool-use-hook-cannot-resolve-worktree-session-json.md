---
name: post-tool-use-hook-cannot-resolve-worktree-session-json
description: The PostToolUse agents hook (and the reconstructor) resolve session.json from the main-tree cwd, but under the always-worktree model the real session.json lives in the worktree — so agents[] is never populated; both also read final-turn usage from the parent toolUseResult instead of summing each agent's own transcript for the cumulative figure.
type: backlogs
scope: feature
feature: agents
status: active
created: 2026-06-05
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [hook, worktree, session-json, agents-metadata, telemetry, bug]
priority: high
related: [hook-silence-no-agents-mutation-diagnostic, schema-extension-agents-status-field]
---

# Hook cannot resolve the worktree's `session.json`; also reads the wrong token source

## Trigger

Session 06668274 (Chat, task 06) spawned many subagents (executor / evaluator / assistant / leader), yet `session.json.agents[]` held only the 1 manager seed entry at session end. The hook `post-tool-use-agents.sh` IS registered (matcher `Task|Agent` on `PostToolUse` + `PostToolUseFailure`) and IS coded to upsert agents[], but it populated nothing this session. Verified empirically (the live transcript carries all the spawn `toolUseResult` payloads; the worktree `session.json` carries 1 entry).

## Root cause (two independent defects)

1. **Worktree-path mismatch.** `post-tool-use-agents.sh` resolves the session dir from its stdin `cwd`: `resolve_project_name`/`resolve_session_dir` scan `$cwd/.gobbi/projects/<name>/sessions/*-<session_id>`. Under the always-worktree model the session runs with `cwd` at the MAIN tree, but the live `session.json` lives in the WORKTREE (`.../worktrees/.../.gobbi/projects/<name>/sessions/...`). The main-tree path for this session's id does not exist, so `resolve_session_dir` fails and the hook `bail`s silently with exit 0. Result: no upsert, ever, for worktree sessions. `reconstruct-agents.sh` shares this defect (same main-tree `$(pwd)` assumption).

2. **Wrong token source (final-turn, wrong file).** Even when the hook DOES fire, it reads token data from the parent `toolUseResult.usage.*` — the subagent's FINAL-turn breakdown from the PARENT transcript. That is doubly wrong: it is the final turn only (not cumulative), and it is the wrong file (the cumulative figure must be summed from the agent's OWN transcript, `${transcript%.jsonl}/subagents/agent-<agentId>.jsonl`). The parent `toolUseResult.totalTokens` is a different, much smaller headline metric and is not the cumulative sum either. `reconstruct-agents.sh` has the same wrong-source read.

## Proposed fix (code — separate session)

- **Resolver:** teach both scripts to prefer the worktree `session.json`. Options to evaluate: (a) read `session.json.git.worktreePath` from the main-tree session dir if one exists, or have the manager pass the worktree path via the hook payload/env; (b) search worktrees under `.gobbi/projects/<name>/worktrees/*/.gobbi/projects/<name>/sessions/` for the matching session-id. Pick at code-fix ideation.
- **Tokens:** change both scripts to compute each agent's CUMULATIVE `tokensUsed` (`{input, output, cacheRead, cacheCreation, total}`) by summing `message.usage` per turn over the agent's OWN transcript (`${transcript%.jsonl}/subagents/agent-<agentId>.jsonl`; manager from the main transcript with `isSidechain==false`), matching the new `agents[]` schema (schemaVersion 2). Stop reading `toolUseResult.usage` / `toolUseResult.totalTokens`. See `orchestration/SKILL.md § Recording operation metadata` (reframed session 06668274) for the exact `jq`.

## Interim mitigation (already in place)

Per the reframed `orchestration/SKILL.md § Recording operation metadata`, the **manager** records each agent's cumulative token usage via `jq` over that agent's own transcript (per-subagent on return + bulk reconcile at MEMORIZATION/Wrap-up). The hook/reconstructor are convenience seeders of routing fields, not the source of truth for tokens — so the missing/incorrect-token defect no longer blocks accurate session telemetry. This backlog tracks repairing the automated path so the manual `jq` step has a working fallback.

## Related

- `features/agents/scenarios/hook-silence-no-agents-mutation-diagnostic.md` — the scenario describing this silent-failure surface.
- `features/agents/backlogs/schema-extension-agents-status-field.md` — adjacent agents[] schema work.
