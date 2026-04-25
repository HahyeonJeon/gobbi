# Session ID Discovery

Project gotchas about discovering the real Claude session ID when the `/gobbi` setup runs gobbi CLI commands.

---

### `$CLAUDE_SESSION_ID` is not populated in the orchestrator env

**Priority:** High (wrong output looks correct)

**What happened:**
During `/gobbi` setup on 2026-04-21, I ran `gobbi config set $CLAUDE_SESSION_ID ...` expecting the env var to carry the real session ID. The var was empty, so I generated a `manual-$(date +%s)` fallback and persisted settings + initialized the workflow under that fake ID. A real session dir was created at `.gobbi/sessions/manual-1776744819/` polluting the runtime layer.

**User feedback:**
"before you start. you should catch exact claude session id."

**Correct approach:**
`$CLAUDE_SESSION_ID` is not exported into the Bash tool env. To discover the real session ID at `/gobbi` setup:

1. Prefer `$CODEX_COMPANION_SESSION_ID` — the Codex companion plugin receives the Claude session ID and re-exports it. Check `env | grep CODEX_COMPANION_SESSION_ID`.
2. Fallback — list `~/.claude/projects/{slug}/*.jsonl` and take the most recently modified file; the filename (minus `.jsonl`) is the current session ID. The slug is derived from the project path (e.g., `-playinganalytics-git-gobbi` for `/playinganalytics/git/gobbi`).
3. Do NOT generate a `manual-*` fallback. Wrong session ID contaminates `.gobbi/sessions/` and `gobbi.json` with orphan entries that need manual cleanup (`rm -rf .gobbi/sessions/manual-*` + `gobbi config delete manual-*`).

Once discovered, export once per command: `CLAUDE_PROJECT_DIR=/playinganalytics/git/gobbi CLAUDE_SESSION_ID=<real-id> gobbi <subcommand>`.

**Related:** the `/gobbi` skill's FOURTH step (`gobbi config get $CLAUDE_SESSION_ID`) and the setup-question persistence step both assume `$CLAUDE_SESSION_ID` is populated. They should be updated to discover via CODEX_COMPANION_SESSION_ID or transcript mtime. File a backlog issue.
