# Edit tool follows the absolute path you give it, not the current working directory

When the executor reads a file by absolute path from the main tree (e.g., during the orientation/study phase), then later issues `Edit` calls with that same absolute path, the edits land in the main tree even though the working directory is the worktree. The Edit tool has no concept of "the current worktree"; it just opens the path you hand it.

---

priority: high
tech-stack: claude-code, git-worktrees, gobbi
enforcement: advisory
---

**Priority:** High

**What happened:** Wave C.1.2 (session `320426b9-2fa2-46c1-8f0b-c83fdef97795`, 2026-04-26) — the executor was working in `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/feat/156-prompts-as-data` (the worktree). During the Study phase, the executor read source files (`migrations.ts`, `store.ts`, `events/index.ts`, `commands/maintenance/migrate-state-db.ts`) using absolute paths into the **main tree** at `/playinganalytics/git/gobbi/packages/cli/src/...`. When the executor moved into the Execute phase and called Edit on those same absolute paths, the four C.1.2 edits landed in the main tree, NOT the worktree. The mistake was discovered when `git status` from the worktree showed only the pre-existing dep changes — no new modifications. Recovery cost ~2 minutes: save `git diff` from the main tree to a patch file, `git restore` the main tree, `cd` back to the worktree, `git apply /tmp/c12.patch`.

**Why it happens:** Reading a file from the main tree's absolute path is sometimes intentional (e.g., reading a stable reference document that does not change between branches). But when you re-use the same absolute path in `Edit`, you are silently authoring outside the active branch. The worktree's same-relative path is a different inode; the file content can match (post `git checkout`) and yet writes to one do not affect the other. There is no warning. Tests pass because they are run by `bun test` which (a) the executor ran from the worktree's cwd, but (b) the worktree's source files were not modified — what passed was nothing about the change.

**User feedback:** Self-caught when post-edit `git status` in the worktree showed no source-file modifications. The executor immediately surfaced the mistake rather than committing.

**Correct approach:**

1. **When you read a file for orientation, use the worktree-relative path** if you intend to later edit it. For files that have no per-branch differences (design docs, ideation/synthesis files in `.gobbi/projects/gobbi/sessions/<sid>/`), reading from main is fine — you will not edit those.

2. **Before issuing an Edit on an absolute path**, mentally check: does this path start with `<worktree-root>/`? If you are working in a worktree, every code edit must start with `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/<branch>/...`, NOT `/playinganalytics/git/gobbi/...`.

3. **After issuing a batch of edits**, run `git status` in the worktree before committing. Empty output for the files you just changed = wrong tree.

4. **Recovery** when the mistake is caught after the edits land in the wrong tree:
   - `cd <wrong-tree> && git diff <touched-files> > /tmp/recovery.patch`
   - `cd <wrong-tree> && git restore <touched-files>`
   - `cd <correct-tree> && git apply /tmp/recovery.patch`
   - Verify `git status` shows the expected modifications in the correct tree.

5. **Long-term**: when the orchestrator hands the executor a worktree path, the executor's mental model should anchor on that path. Cite the worktree-relative path in the executor's notes ("worktree:packages/cli/src/workflow/migrations.ts") rather than the main-tree absolute. The Read tool's `file_path` parameter accepts both; prefer worktree paths for files you may edit.

**When to apply this gotcha:** Any wave executed in a `.gobbi/projects/gobbi/worktrees/feat/<n>-<slug>/` worktree. The risk is highest for code edits that span multiple files in deep subdirectories (`packages/cli/src/workflow/`, `packages/cli/src/commands/`) because reading those files for study is natural during the orientation phase, and the absolute path is what the Read tool returns in error messages.

**Refs:** Wave C.1.2 session `320426b9-2fa2-46c1-8f0b-c83fdef97795`. Related: `worktree-vs-main-path-confusion.md`, `gobbi-workflow-cli-from-main-tree.md`.
