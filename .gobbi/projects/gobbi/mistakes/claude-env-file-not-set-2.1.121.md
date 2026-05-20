# `$CLAUDE_ENV_FILE` is empty in the hook subprocess — Claude Code 2.1.121 and earlier

Project gotcha documenting the upstream env-file regression and gobbi's stance.

## Priority

High — silently breaks the F4 SessionStart env-propagation mechanism, causing `CLAUDE_SESSION_ID` / `CLAUDE_PROJECT_DIR` not to propagate to the `/gobbi` skill and subsequent CLI calls.

## What happened

PR-FIN-1b (commit `a48ea7c`, PR #217) shipped `gobbi config env` and `gobbi hook session-start` on the design assumption that Claude Code's documented `$CLAUDE_ENV_FILE` mechanism would propagate `CLAUDE_SESSION_ID`, `CLAUDE_PROJECT_DIR`, etc. to subsequent commands in the session. The design was based on the official Claude Code documentation for hook env-file persistence.

In Claude Code 2.1.121 (and earlier, including 2.0.76+), `$CLAUDE_ENV_FILE` is empty in the hook subprocess. The documented mechanism does not work. `gobbi config env` correctly detects the missing var and emits a stderr WARN then exits 0 (non-blocking), but this means the env-file is never written and no vars are propagated.

## Investigation

Upstream issue https://github.com/anthropics/claude-code/issues/15840 confirmed and then closed as `not_planned`. Anthropic does not intend to fix the env-file mechanism. Gobbi must work around it on its own side.

## Correct approach

Do NOT rely on `$CLAUDE_ENV_FILE` for propagating `CLAUDE_SESSION_ID` or `CLAUDE_PROJECT_DIR` in hook subprocesses. The `runConfigEnv` function already handles the missing var gracefully (WARN + return). For hook-side dispatch (PR-FIN-1d), use `payload.session_id` from the stdin JSON payload directly — this arrives via stdin independently of `$CLAUDE_ENV_FILE` and is robust to the regression.

For skill-side session-id discovery (the `/gobbi` skill), the pre-PR-FIN-1b discovery dance was retired in PR-FIN-1b assuming env-file would work. Restoration of the discovery dance or an alternative stable-path env file is tracked in issue #220 (P1). Until that issue ships, the `/gobbi` skill cannot reliably discover the session id automatically.

## Affects

- `/gobbi` SKILL.md — "Discovering the real session ID" section was removed in PR-FIN-1b; may need to return
- `gobbi config env` — silently no-ops when `$CLAUDE_ENV_FILE` is unset (the function works correctly, but produces no effect)
- Any code path that expected `CLAUDE_PROJECT_DIR` to arrive automatically via `$CLAUDE_ENV_FILE` into subsequent hook or skill invocations

## References

- Upstream: https://github.com/anthropics/claude-code/issues/15840 (closed not_planned)
- Gobbi-side workaround tracking: issue #220
- PR-FIN-1b: #217 (shipped the env-file design)
- PR-FIN-1d: #218 (confirms payload-stdin path is robust to this regression)
