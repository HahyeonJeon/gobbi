# Worktree-Based Task Operation

Feature description for gobbi's worktree isolation model. Read this to understand why tasks run in dedicated git worktrees, what constraints that creates, and how parallel sessions stay safe.

---

> **One worktree, one branch, one PR. Parallel tasks are parallel repositories — they cannot contaminate each other.**

Gobbi runs each task in its own git worktree under `.gobbi/worktrees/{branch-path}/`. A worktree is a full working copy of the repository at a specific branch. Two tasks in two worktrees share git history but have independent working trees — a file edited in one worktree does not affect the other until it is merged. This is isolation by construction, not by discipline.

The base branch is verified before cutting a worktree: the CLI checks that the base branch is up to date before creating the task branch. This prevents a common failure mode where a task branch is cut from a stale base and later requires a complex rebase before its PR can merge cleanly. Each worktree runs the project-configured install command after creation — dependencies are resolved in the task's environment, not inherited from the parent.

The branch exclusivity invariant means a branch may only be active in one worktree at a time. Creating a worktree for a branch that already has an active worktree is rejected. This prevents two agents from concurrently modifying the same branch and producing conflicting commits. Combined with each worktree's independent working tree, branch exclusivity means two sessions working simultaneously cannot produce commits on the same branch or diffs that the integration step would have to untangle.

The full task lifecycle threads through the worktree: a tracking issue captures the task contract; the CLI cuts a branch and worktree from the verified base; subagents commit verified work into the worktree; the orchestrator pushes the branch and opens a pull request once all subagent work is complete; the PR is reviewed and merged; the worktree and branch are cleaned up. Each stage has a clear owner, so integration points stay inspectable.

Role boundaries within a task are explicit: subagents commit within their worktree; the orchestrator pushes. Subagents should not push branches. Pushing is the orchestrator's action, after it has confirmed the work is complete and verified. This boundary keeps the commit and push steps inspectable — there is a clear point where the orchestrator reviews what subagents produced before it moves that work to the remote.

After a PR is merged, the worktree is cleaned up. The branch is removed, the worktree directory is deleted, and the session's association with that worktree is closed. Cleanup is not automatic on merge — it is an explicit step so that partially-merged work or merge conflicts are not silently discarded.

---

**Read deeper:**

| Document | Covers |
|----------|--------|
| `deterministic-orchestration.md` | How Workflow Configuration creates the worktree when git mode is worktree-PR |
| `gobbi-memory.md` | How worktree-scoped work writes artifacts into the active session's `rawdata/` directories |
| `cli-as-runtime-api.md` | The CLI surface that manages the worktree lifecycle (creation, cleanup, base-branch verification) |
