---
name: claude-code-hooks-stdin-contract
description: "Claude Code hooks documentation — SessionStart hook stdin contract"
type: references
scope: feature
feature: install-runtime
status: active
created: 2026-05-22
session: 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d
tags: [hooks, env-vars, session-start, stdin-json]
title: "Claude Code hooks documentation — SessionStart hook stdin contract"
source: https://docs.anthropic.com/en/docs/claude-code/hooks
accessed: 2026-05-22
ref_type: docs
---

# Claude Code hooks documentation — SessionStart hook stdin contract

Split from the env-var-audit Ideation references bundle. Consulted via assistant subagent lookup during the Ideation loop; informed locked design decisions in the Idea artifact.

## Insight

The SessionStart hook receives a stdin JSON payload with 8 fields: `session_id`, `transcript_path`, `cwd`, `hook_event_name` (always `"SessionStart"`), `source` (one of `startup`/`resume`/`clear`/`compact`), `agent_id` (optional), `agent_type` (optional), `permission_mode` (optional). The `source` field is separate from `hook_event_name` — this distinction was the basis for adding `CLAUDE_HOOK_SOURCE` as a new env-var export.

Additionally confirmed: `$CLAUDE_CODE_SESSION_ID` is a **runtime-auto-set** env var (not hook-only); hook-only vars (only available inside a hook handler via stdin JSON) include `CLAUDE_SESSION_ID`, `CLAUDE_TRANSCRIPT_PATH`, `CLAUDE_CWD`, `CLAUDE_HOOK_EVENT_NAME`, and the optional fields. Runtime-set in Bash subprocesses: `CLAUDE_CODE_SESSION_ID`, `CLAUDE_EFFORT`, `CLAUDECODE=1`, `CLAUDE_CODE_REMOTE`.

## Why it applies

The assistant subagent lookup result was the empirical grounding for the rename decision (which var is runtime-set vs hook-only) and the hook contract (which fields to export from stdin JSON). Without this cross-reference, the rename from `$CLAUDE_SESSION_ID` to `$CLAUDE_CODE_SESSION_ID` would have been an untested claim. The lookup confirmed the official docs-side distinction.

## Source

- Primary: https://docs.anthropic.com/en/docs/claude-code/hooks (Claude Code hooks reference page)
- Accessed: 2026-05-22 via assistant subagent dispatched during env-var-audit Ideation loop

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-05-22 | 2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d | Grounded env-var rename decision; informed hook contract (which fields to export); basis for `CLAUDE_HOOK_SOURCE` addition |
