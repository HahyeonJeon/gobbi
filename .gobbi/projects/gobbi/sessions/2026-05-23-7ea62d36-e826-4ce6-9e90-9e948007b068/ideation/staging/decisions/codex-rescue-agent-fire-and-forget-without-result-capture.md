---
date: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
status: accepted
feature: gobbi-orchestration-workflow-improvements
supersedes: null
superseded_by: null
mistake-candidate: true
domain: process
severity: high
loop: ideation
iter: 3
---

# `codex:codex-rescue` Agent Returns Fire-and-Forget Placeholder, Not Real Result

## Context

During Ideation iter3 evaluation, the manager dispatched a `codex:codex-rescue` plugin agent to perform the Codex evaluation of `draft-iter3.md`. The agent returned quickly with a placeholder message indicating the task was still running. No evaluation files were written to the session staging directory. The evaluation directory `evaluation/iter3/codex/` remained empty. The manager had to authorize recovery via direct `codex exec` from a Bash tool call, which succeeded synchronously and produced all 8 evaluation files.

## What went wrong

The `codex:codex-rescue` plugin agent fires the codex companion task asynchronously and returns immediately, without awaiting completion or capturing real output. Its response is a placeholder like "task is still running" or "the background job has been submitted". The underlying `codex-companion.mjs` tracks jobs in `broker.json` (e.g., `.gobbi/projects/gobbi/worktrees/.../state.json`) with a `status` field. The plugin agent does not poll for `status="completed"` before returning — it delegates to the runtime and exits.

## Why it went wrong (mistaken assumption)

The manager assumed `codex:codex-rescue` behaves synchronously: spawn, wait for completion, read output. In reality the plugin agent's "job is to forward the request to the Codex companion script" (per `agents/codex-rescue.md:12`) and return. The forwarding is asynchronous. The manager did not check whether the codex:codex-rescue agent contract guarantees synchronous completion. Result: zero files written, evaluation directory empty, session blocked.

## How to recognize

Trigger signals:
- `codex:codex-rescue` Agent returns within a few seconds with a message containing "task is still running", "background job", or "submitted".
- The targeted output directory (e.g., `evaluation/iter3/codex/`) remains empty after the agent returns.
- Checking the broker/state file shows `"status": "running"` with a stale or absent `pid`.
- No `.md` files appear under `sessions/{session-id}/{loop}/evaluation/iter{n}/codex/` after the spawn.

## Corrected approach

1. **Use `codex exec` via Bash directly (synchronous, universal pattern)**. Replace `Agent(subagent_type="codex:codex-rescue", ...)` with a direct Bash invocation:
   ```
   timeout 600 codex exec --cd /playinganalytics/git/gobbi \
     -s workspace-write \
     "$(cat delegation-prompt.md)"
   ```
   This is synchronous: the command blocks until the codex agent completes, captures stdout, writes files as instructed in the prompt, and returns a real exit code.

2. **Post-exec verification**. After `codex exec` completes, run:
   ```
   find /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/{session-id}/{loop}/evaluation/iter{n}/codex/ -name '*.md'
   ```
   Confirm files exist at the main-tree absolute path (not nested in any worktree). This is the 3rd corrective from `mistakes/codex-eval-session-write-path-nested-in-worktree.md`.

3. **Manager-side `codex:codex-rescue` usage**. If the plugin agent is used (manager-only convenience), the manager must monitor the background job to completion — poll `/codex:status` (user-only) or check broker.json status — before treating the output as available. This is not scalable for evaluation flows; prefer `codex exec` directly.

## Related

- `mistakes/codex-eval-session-write-path-nested-in-worktree.md` — companion mistake (wrong write path when worktree CWD is inherited)
- Design A of this session: codex skill invocation-patterns section, "Why subagents must use `codex exec`"
- `~/.claude/plugins/cache/openai-codex/codex/1.0.2/agents/codex-rescue.md:12` — "only job is to forward the user's rescue request to the Codex companion script"
- Session: `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`, loop: ideation, iter: 3
- Empirical witness: iter3 Codex evaluation was initially unavailable because `codex:codex-rescue` returned a placeholder; direct `codex exec` succeeded and produced all 8 evaluation files within the session
