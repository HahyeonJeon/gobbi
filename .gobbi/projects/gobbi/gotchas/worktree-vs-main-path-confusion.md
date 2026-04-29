# Worktree-vs-main-repo path confusion in delegated agents

When the orchestrator delegates work to an executor inside a worktree at `.claude/worktrees/<name>/`, the agent's `Read`/`Edit`/`Write` tool calls sometimes resolve to the **main repo path** (`/playinganalytics/git/gobbi/...`) instead of the **worktree path** (`/playinganalytics/git/gobbi/.claude/worktrees/<name>/...`). Both paths exist for the same files via separate inodes on disk; the main-repo path returns stale (pre-PR) content while the agent thinks it's reading the worktree's in-progress state.

---

### Three reproductions in one session

---
priority: high
tech-stack: bun, claude-code
enforcement: advisory
---

**What happened**: Wave A.1 session `2b32dd91-5872-4e94-bcbb-2b706f440ef8` hit this 3 times — sub-agents S1 (A.1.2 + A.1.9), S6 (A.1.7 + A.1.8), and the R1+R2 remediation pass each spent 10–15 minutes self-recovering before correctly committing inside the worktree.

**Why it happens**: The orchestrator's prior `cd <worktree>` Bash commands persist the cwd for subsequent Bash invocations, but `Read`/`Edit`/`Write` tool calls take absolute paths and don't track the worktree boundary. Agents that internalize `/playinganalytics/git/gobbi/` as "the repo path" prepend that to relative-feeling paths and hit the main tree silently.

**Recovery cost**: cherry-pick orphan commits, reset the wrong branch, transfer diffs via `git diff` → patch → `git apply`. This is mechanical but expensive (10–15 min) and risks losing in-progress work if the agent panics.

**Correct approach**:

1. **Pre-flight sanity check.** Before the first `Edit`/`Write` call, the agent reads ONE file it knows was modified in a recent worktree commit. If the content matches expectations → on the right path. If it shows pre-PR content → switch all paths.
2. **Lead with the worktree path** in the briefing: "Use this absolute path for ALL Read/Edit/Write calls; the main repo at `/playinganalytics/git/gobbi/` is OUT OF SCOPE."
3. **Verify post-commit via `git -C <worktree>`** — `git -C <worktree> log --oneline -1` should show the new commit; if it shows a prior commit, the work landed elsewhere.

**Refs**: issue #149 — fix proposal: update `_delegation` agent briefings to require the pre-flight sanity check, OR add a tooling-level `gobbi worktree assert <path>` guardrail.
