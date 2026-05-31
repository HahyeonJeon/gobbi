---
artifact_type: decision
mistake-candidate: true
domain: process
created-by: 2026-05-30-0fd65721
created-at: 2026-05-30T15:15:00Z
---

# Subagent wrote session memory to the main tree instead of the worktree root

**What went wrong**
The Ideation leader was told to `cd` into the session worktree
(`.gobbi/projects/gobbi/worktrees/chore/session-2026-05-30-0fd65721`) and root all
session-memory writes there. It instead wrote `draft-iter1.md` and all staged
references/backlogs to the **main tree** session path
(`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/.../ideation/...`),
splitting the session artifacts across two trees (manager's discussion-log was in the
worktree; leader's files in the main tree). The manager had to consolidate by hand.

**Why it went wrong**
A `cd` issued in one Bash tool call does NOT persist to later tool calls — the shell is
re-initialized each call. The leader's later Write calls used an absolute path built from
the canonical `sessions/{date}-{id}/...` pattern WITHOUT the worktree prefix, because the
delegation prompt gave the worktree path as a "cd first" instruction rather than as the
literal absolute write root for every file. "cd to the worktree" is not a durable contract.

**How to recognize it next time**
Any delegation in worktree-pr mode where the prompt says "cd to the worktree" but then
references write targets by the bare `sessions/{date}-{id}/{loop}/...` relative pattern.
If the subagent's reported ARTIFACT path lacks the `/worktrees/<branch>/` segment, it wrote
to the wrong tree.

**Corrected approach**
In every worktree-mode delegation prompt, give the subagent the FULL worktree-absolute path
for each write target (e.g. `<worktreePath>/.gobbi/projects/.../ideation/rawdata/draft-iter{n}.md`)
— not "cd to X then write to sessions/...". Pass `session.json.git.worktreePath` as the
explicit absolute root and instruct: "every write path begins with this root; do not
construct paths relative to your shell cwd." Relates to the cwd-reset / wrong-branch mistake
family already in project memory.
