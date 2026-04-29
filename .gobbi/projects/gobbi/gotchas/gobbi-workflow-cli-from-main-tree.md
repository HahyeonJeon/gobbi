# `gobbi workflow` CLI must run from main tree, not from worktree

The `gobbi workflow status`, `gobbi workflow transition`, and related commands fail with `could not resolve an active session directory` when invoked from inside a worktree. They must run from the main repo tree.

---

priority: high
tech-stack: gobbi-cli, bun
enforcement: advisory
---

**Priority:** High

**What happened:** During Wave A.2 (session `dbaf6f5f-403c-4645-b7c3-8962dc16c2d5`) the orchestrator was running `gobbi workflow transition` calls from inside the worktree at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/docs/150-wave-a2-9doc-reconciliation`. The CLI errored:

```
gobbi workflow transition: could not resolve an active session directory.
Set CLAUDE_SESSION_ID or pass --session-id.
```

`CLAUDE_SESSION_ID` was already exported. Running the same command from `/playinganalytics/git/gobbi` (main tree) succeeded immediately. Hit twice this session before the cause was identified.

**Why it happens:** `gobbi workflow status` resolves the session by walking from the current working directory upward looking for `.gobbi/state.db` — the workspace-scoped event store added in Wave A.1. The worktree has its own checkout but the workspace root (`.gobbi/state.db`) lives at the main tree. From inside a worktree, the CLI walks upward and either misses the main tree's `.gobbi/` or finds a different one. Either way, the session resolution fails.

**User feedback:** Self-caught during Wave A.2 orchestration. Memorized in Wave A.2 evaluation phase.

**Correct approach:**

1. **Always run `gobbi workflow *` commands from the main tree**, even when the work itself happens in a worktree. Use absolute paths or cd back to the main tree before invoking:

   ```
   cd /playinganalytics/git/gobbi && gobbi workflow transition COMPLETE
   ```

2. **Pair this with the `_git` rule** that the orchestrator owns the workflow lifecycle (status, transitions, eval verdicts). Subagents inside worktrees don't run these commands.

3. **For batched operations**, capture the session ID once and use absolute-path invocations:

   ```
   DISCOVERED=dbaf6f5f-...
   cd /playinganalytics/git/gobbi
   CLAUDE_SESSION_ID=$DISCOVERED gobbi workflow status
   CLAUDE_SESSION_ID=$DISCOVERED gobbi workflow transition COMPLETE
   ```

**Refs:** Wave A.2 session `dbaf6f5f-403c-4645-b7c3-8962dc16c2d5` evaluation phase. Related: `cli-vs-skill-session-id.md` (session-id resolution boundary).
