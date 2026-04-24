# CLI vs Skill: Session-ID Discovery

The `gobbi` CLI and the `/gobbi` orchestrator skill handle session-id discovery differently. Mixing the two produces silent failures (wrong session dir written, orphaned config entries).

---

### The CLI only reads `$CLAUDE_SESSION_ID`

**Priority:** High (wrong output looks correct)

**What happened:**
An agent writing CLI integration code tried to `import` Codex-plugin env vars into the CLI itself ("the CLI should know about `$CODEX_COMPANION_SESSION_ID`"). This couples the CLI to plugin-specific environments.

**Correct approach:**

The `gobbi` CLI reads exactly one env var for session identity: **`$CLAUDE_SESSION_ID`**. If absent, it accepts `--session-id <id>` as an explicit flag. If both are missing, it exits with code 2.

The CLI is **agnostic** to how the session-id was discovered. It does not know about `$CODEX_COMPANION_SESSION_ID` or transcript-mtime fallbacks.

**The `/gobbi` orchestrator skill handles env discovery.** Per the `session-id-discovery` gotcha: `$CLAUDE_SESSION_ID` is NOT populated in the orchestrator's Bash tool env, so the skill checks `$CODEX_COMPANION_SESSION_ID` first, then falls back to the most-recently-modified transcript JSONL under `~/.claude/projects/{slug}/`. Once discovered, the skill passes the id to CLI calls via **`--session-id <id>` explicitly**, or by setting `CLAUDE_SESSION_ID=<id>` as an inline env assignment for the single command.

**Example (skill → CLI call):**

```
CLAUDE_SESSION_ID=$DISCOVERED gobbi config set workflow.ideation.discuss.mode user
```

or

```
gobbi config set workflow.ideation.discuss.mode user --session-id $DISCOVERED
```

Never rely on `$CLAUDE_SESSION_ID` already being in the CLI process env — it is not.

**Why the boundary matters:**

- Keeps the CLI plugin-neutral (works outside Codex companion plugin context)
- Centralizes discovery logic in the skill where the env actually carries the right vars
- Makes CLI testable in isolation with either env or flag input
