# `gobbi note collect` requires CLAUDE_TRANSCRIPT_PATH and meta-file copy across session-id boundaries

`gobbi note collect` resolves subagent records under `~/.claude/projects/<slug>/<CLAUDE_SESSION_ID>/subagents/`, but the SubagentStop hook writes meta files under the live Claude session-id dir. When the gobbi workflow session-id differs from the Claude session-id (e.g., a second wave in the same Claude session creates a new gobbi UUID), the collect command can't find the meta files. Workaround: copy meta files into the gobbi-session dir before invoking collect, and pass `CLAUDE_TRANSCRIPT_PATH` explicitly.

---

priority: high
tech-stack: gobbi-cli, claude-code
enforcement: advisory
---

**Priority:** High

**What happened:** Wave B.1 (session `dc016347-d795-4b0b-9439-7d5abe756b34`, 2026-04-26) generated a fresh gobbi UUID for the new wave because the previous gobbi workflow (Claude session `dbaf6f5f-...`) had already reached `done` post-/clear. The actual Claude session was `f53ee44b-...`. Three IDs in play. After each executor completed, `gobbi note collect <agent-id> 01 b11-schema-mirror /…/sessions/<gobbi-session-id> --phase execution` failed three times in succession:

1. First — `Error: CLAUDE_TRANSCRIPT_PATH is not set.` Fix: set `CLAUDE_TRANSCRIPT_PATH=/home/jeonhh0061/.claude/projects/-playinganalytics-git-gobbi/<claude-session-id>.jsonl`.
2. Second — `Error: Meta file not found: /home/jeonhh0061/.claude/projects/-playinganalytics-git-gobbi/<gobbi-session-id>/subagents/agent-<id>.meta.json`. The hook writes meta files under the Claude-session dir, but collect looks under the gobbi-session dir. Fix: `cp -p ~/.claude/projects/<slug>/<claude-session-id>/subagents/agent-<id>.* ~/.claude/projects/<slug>/<gobbi-session-id>/subagents/`.
3. Third — `Error: subtasks/ directory not found: /…/<gobbi-session-id>/execution/execution/subtasks`. The note-dir argument is the SESSION dir (not the execution subdir); `--phase execution` adds the subdirectory. Fix: pass `/…/sessions/<gobbi-session-id>` (without `/execution`).

After fixing all three, collect populated `subtasks/01-b11-schema-mirror.json` correctly. Repeated for all three subtasks.

**Why it happens:** The session-id-discovery boundary documented in `learnings/gotchas/cli-vs-skill-session-id.md` resolves which session-id the CLI uses for state-db / config / metadata. But `gobbi note collect` reads from BOTH (a) Claude's transcript file (which is keyed by Claude session-id) and (b) the SubagentStop hook's meta-files (also written under Claude session-id). When `CLAUDE_SESSION_ID` is overridden to the gobbi-session-id (so workflow status / config land correctly), collect can't find the Claude-side artifacts.

**User feedback:** Self-caught during execution step. Costs ~5 minutes friction per executor; ~15 minutes total this wave.

**Correct approach (workaround):**

```bash
B1=$(cat /tmp/b1_session_id.txt)               # gobbi session-id
CLAUDE_DIR=/home/jeonhh0061/.claude/projects/-playinganalytics-git-gobbi
CLAUDE_SID=f53ee44b-7b5b-410d-85e6-827d19dd048d # actual Claude session-id

# Step 1: copy subagent meta + jsonl into gobbi-session dir
cp -p $CLAUDE_DIR/$CLAUDE_SID/subagents/agent-<agent-id>.* $CLAUDE_DIR/$B1/subagents/

# Step 2: invoke collect with explicit transcript path + correct note-dir (session dir, not /execution)
CLAUDE_TRANSCRIPT_PATH=$CLAUDE_DIR/$CLAUDE_SID.jsonl \
CLAUDE_SESSION_ID=$B1 \
gobbi note collect <agent-id> <subtask-NN> <slug> /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/$B1 --phase execution
```

To find the actual Claude session-id: `ls -lt ~/.claude/projects/<slug>/*.jsonl | head -1` — the most-recently-modified `.jsonl` is the live session.

**Long-term fix (out of scope for B.1):** The CLI should accept a `--claude-session-id` flag (or auto-discover via `ls -t`) so cross-session-id resolution doesn't require manual file copying. File a backlog issue for the CLI change if friction recurs.

**When to apply this gotcha:** Whenever a gobbi workflow session is initialized with a UUID that differs from `CODEX_COMPANION_SESSION_ID` or the actual Claude session — typically when running a second wave in the same Claude session, or after `/clear` if the gobbi-side session-id is regenerated.

**Refs:** Wave B.1 session `dc016347-d795-4b0b-9439-7d5abe756b34`; SubagentStop hook at `packages/cli/src/commands/workflow/capture-subagent.ts`; collect command at `packages/cli/src/commands/note.ts:342`. Related: `cli-vs-skill-session-id.md`, `gobbi-workflow-cli-from-main-tree.md`.
