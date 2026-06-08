---
type: backlogs
scope: feature
feature: workflow
created: 2026-06-08
priority: high
status: open
---

# session.json token accounting: manager skips the reconcile + hook/script key mismatch

## What happened

Session 422308da (PR #296) closed Wrap-up with `agents[].tokensUsed` all zero/absent and `usage.sessionTotal = 0`. The token data was never recorded during the run. Backfilled post-session by recreating the worktree, re-keying entries, and running `reconcile-session-metadata.sh` (sessionTotal came out ~188.8M).

## Three distinct defects to fix (skill-improvement work — next session)

1. **Manager never ran the reconcile.** `orchestration/SKILL.md § Workflow Metadata → Recording workflow metadata` requires the manager to record per-agent `tokensUsed` at each subagent return AND a bulk reconcile (`scripts/reconcile-session-metadata.sh`) at **every MEMORIZATION + Wrap-up**. Nothing in the per-loop MEMORIZATION procedure or the manager's checklist forces it, so it was silently skipped at all 5 MEMORIZATIONs + Wrap-up. **Fix:** make the reconcile a hard, checklisted step — either in each loop's MEMORIZATION exit checklist (`memorization/SKILL.md`) or as an explicit manager action at MEMORIZATION/Wrap-up in `orchestration/workflow/memorization.md` + `wrap-up/SKILL.md`. Consider having the MEMORIZATION assistant run it (it already updates `session.json`), or gate Wrap-up EXIT on `usage.sessionTotal > 0`.

2. **Hook and reconcile script disagree on the `agents[].id` key.** `post-tool-use-agents.sh` seeds each specialist entry with `id = tool_use_id` (`toolu_…`), but `reconcile-session-metadata.sh` (and the spec) key by the short `toolUseResult.agentId`. Running the reconcile as-is therefore APPENDS agentId-keyed duplicates instead of merging — 17 partials + 17 reconciled = 34. The backfill worked around it by re-keying entries `tool_use_id → agentId` (map built from the main transcript: `select(.toolUseResult.agentId!=null) | {tuid: .message.content[0].tool_use_id, aid: .toolUseResult.agentId}`) BEFORE reconciling. **Fix:** make the hook seed `id = agentId` (it has `toolUseResult.agentId` at PostToolUse time), OR make the reconcile re-key by the transcript map, so the two agree on one identity key. Pick one canonical key and align both.

3. **Codex-side agents are not captured at all.** Codex evaluators run via `codex exec` (Bash), not as Claude `Agent` spawns, so they produce no `agent-<id>.jsonl` and never appear in `agents[]`. For this session that hid ~12 evaluator runs' token cost. **Fix:** decide whether `usage` should account for Codex (e.g., parse `codex exec` stdout "tokens used" lines into a `codexAgents[]` or a `usage.codex` field) or document explicitly that `agents[]`/`usage.sessionTotal` is Claude-only. Either way, state it so a reader does not mistake `sessionTotal` for the whole-session cost.

## Why it matters

`agents[].tokensUsed` exists for after-the-fact token-budget analysis (the spec's stated single purpose). A session that ships with it zeroed defeats that purpose, and the key mismatch means the documented recovery tool fails closed (duplicates) for anyone who runs it naively.

## Related

- Backfill commit on branch `claude-2026-06-07-422308da-…`.
- Process mistake: manager-skipped-token-reconcile (verify-the-telemetry-was-recorded discipline; sibling of the verification-theater family).
