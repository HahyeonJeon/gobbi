---
name: session-operation-metadata-recording-from-agent-transcripts
description: "Per-agent token usage (session operation metadata) is recorded by the manager reading each agent's own transcript file — not the PostToolUse hook and not toolUseResult.totalTokens."
type: decisions
scope: feature
feature: agents
status: active
created: 2026-06-06
session: 06668274-cee3-4bc0-9125-91a327467cd2
tags: [agents, session-metadata, token-usage, transcript, schema]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Record per-agent token usage by reading each agent's own transcript

## Context

`session.json` carries an `agents[]` array that should capture per-agent token usage (cumulative `tokensUsed` breakdown) for session-level analytics. Prior to this task, `agents[].tokensUsed` was never being populated: only 1 of 15 agents had a recorded entry in a representative session. Two candidate sources existed for the data — the PostToolUse hook and `toolUseResult` fields on the parent transcript — but neither was appropriate. The correct source needed to be identified and the schema updated to match.

## Decision

Session operation metadata (per-agent token usage) is recorded by the **manager** running `jq` over **each agent's own transcript file**. This is the canonical source of truth. The PostToolUse hook and `toolUseResult.totalTokens` / `toolUseResult.usage` are both rejected for this purpose.

## Rationale

**Why each agent's own transcript is the correct source:**

Every agent — both subagents and the manager itself — has its own transcript file on disk. The cumulative token usage for an agent equals the sum of `message.usage.{input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens}` across every turn in that agent's transcript.

**Transcript file locations:**
- Subagents: `${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl` where `<agentId>` is the short `toolUseResult.agentId` value.
- Manager: the main session transcript (`$CLAUDE_TRANSCRIPT_PATH`), filtering turns where `isSidechain == false`.
- The parent transcript's `toolUseResult` entries are used ONLY to enumerate spawns (agentId + agentType + tool_use_id); no usage metric is read from them.

**Why PostToolUse hook is rejected:**

The PostToolUse hook cannot resolve the worktree's `session.json` path under the always-worktree model — the session file lives in the worktree, but the hook's CWD is the main tree. Additionally, the hook fires after each tool use during execution, so it captures only final-turn usage, not cumulative usage across the full agent run. This bug is tracked at `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`.

**Why `toolUseResult.totalTokens` and `toolUseResult.usage` are rejected:**

`toolUseResult.totalTokens` (e.g., 76170) is a different, smaller metric that does not equal the cumulative per-turn breakdown sum (e.g., 2.54M in the same session). `toolUseResult.usage` reflects the final turn only, not the cumulative total. Both are rejected for the stored figure. Empirical research confirmed this discrepancy by comparing both sources against the per-turn transcript sum.

## Alternatives considered

1. **PostToolUse hook** — rejected: cannot resolve the worktree `session.json` path; reads only final-turn usage, not cumulative. Bug filed at `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`.
2. **`toolUseResult.totalTokens`** — rejected: empirically confirmed to be a different metric (not equal to cumulative breakdown sum); not the figure to store.
3. **`toolUseResult.usage` (final-turn only)** — rejected: final-turn usage only; not cumulative across the agent's full run.

## Consequences

**Schema (schemaVersion 2):** `agents[]` per-entry carries `tokensUsed:{input,output,cacheRead,cacheCreation,total}` (all cumulative); manager appears at `agents[0]` (uniform, not special — it has a transcript like any other agent); session-level `usage:{sessionTotal,computedAt}` added; routing fields `tool_use_id`/`sub_step`/`status` added per agent entry. `schemaVersion` bumped 1→2.

**Recording cadence:** record on each subagent return (when the manager reads `toolUseResult.agentId` and processes the agent's transcript) plus a bulk idempotent reconcile at MEMORIZATION/Wrap-up.

**Reference doc corrected:** `features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` had an incorrect `tokensUsed ← usage.*` mapping and was updated in the same task.

**Commits:** `44ca2f6` (reframe + schema v2 template) and `7a119ad` (remediation).

## Related

- `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` — the hook bug that blocked the alternative approach
- `features/install-runtime/references/claude-code-transcript-tooluseresult-empirical.md` — corrected empirical reference for `toolUseResult` fields
- `plugins/gobbi/.claude-plugin/skills/orchestration/templates/session.template.json` — schemaVersion 2 template
- `[[workflow-metadata-fetch-packaged-as-orchestration-scripts]]` — follow-on decision packaging the recording logic as runnable scripts

## Amendment — session c7673705 (2026-06-08)

Session c7673705 shipped the automated implementation of the recording approach this decision endorsed. This AMENDS (refines) — it does NOT reverse — the decision. The original rejection of `toolUseResult.usage` / `toolUseResult.totalTokens` / final-turn reads still holds.

**What changed:**

- **Task 02 (commit `6cedca99`)** — `PostToolUse` hook (`post-tool-use-agents.sh`) now reads SUBAGENT tokens from each subagent's OWN complete transcript (`${CLAUDE_TRANSCRIPT_PATH%.jsonl}/subagents/agent-<agentId>.jsonl`) — the canonical source endorsed by this decision. The hook also resolves the worktree `session.json` deterministically (the path-mismatch bug tracked in `features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md` is fixed here). The hook does NOT use `toolUseResult.usage` or final-turn reads.

- **Task 03 (commit `4e80e1b6`)** — reconcile script converges on `agentId` and captures Codex agent tokens.

- **Task 04 (commit `35bd3e2e`)** — `SessionEnd` hook is the AUTHORITATIVE WRITER for the manager rollup: it computes `usage.sessionTotal` (sum of all agents' `tokensUsed.total`) and `usage.grandTotal` (`sessionTotal + codex.total`), and runs last — after all per-agent PostToolUse entries are written.

- **Task 06b (commit `be2afdea`)** — single-pass reconcile to meet the 500ms hook-latency gate.

**Net result:** the PostToolUse hook + SessionEnd hook together automate the recording cadence described in the original `## Consequences` section. The worktree-resolution backlog (`features/agents/backlogs/post-tool-use-hook-cannot-resolve-worktree-session-json.md`) is closed by task 02.
