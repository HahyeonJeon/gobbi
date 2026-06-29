---
type: mistakes
skill: git
description: "Recorded traps for git — load before doing git work"
updated: 2026-06-27
---

# Git — Mistakes

> Load before any git work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Executor Edited Main Tree Not Worktree Copy

`priority: high` · `domain: process` · `added: 2026-06-26` · `status: active` · `tags: [git, process, verification]`

**What happened** — The brief defined `PM = $WT/.gobbi/projects/gobbi` (the per-session worktree). The executor read and Edited the MAIN-tree absolute path, dropping the `worktrees/{branch}/` segment. Because gobbi edits its OWN skill tree, the same tracked path `.gobbi/projects/gobbi/skills/...` exists in BOTH the main checkout (branch `develop`) and the worktree checkout (the session branch) as separate inodes. All 6 edits landed in the main tree; the worktree copies stayed untouched. The verification gate (which read `$PM` = worktree) reported the OLD values (`schemaVersion 2`, `integration: null`), surfacing the error.
**Why it happens** — Self-referential repo trap: when the project being edited is gobbi itself, the worktree contains a nested `.gobbi/projects/gobbi/skills/` that mirrors the main tree's path exactly. An absolute path that omits the `worktrees/{branch}/` prefix silently resolves to the main tree — it is NOT a relative-path slip, so re-`cd` and `git -C` discipline do not catch it. The Edit tool reported success because the main-tree file IS a valid writable file; nothing flagged the wrong tree.
**How to detect** — The task edits files under `.gobbi/projects/{name}/skills/...` AND the project name equals the repo's own gobbi project (self-edit), so the worktree contains a nested duplicate of that subtree. Before the FIRST Read/Edit, confirm the path begins with the worktree root (it must contain `worktrees/{branch}/`). A gate that reads `$PM`/worktree returns BASELINE values after edits "succeeded" → the edits hit a different tree.
**Correct approach** — Resolve every in-scope path against the absolute worktree root from the brief (`$WT` / `session.json.git.worktreePath`) and verify each path literally contains the `worktrees/{branch}/` segment before the first write. When the gate disagrees with the edits, immediately diff main-tree vs worktree inodes (`ls -i`) rather than re-editing. Recovery: per-file `git restore --source=HEAD -- <paths>` on the main tree (safe, single-file), then re-apply against the worktree — never `cp` main→worktree when the worktree branch carries prior commits that diverge from the main baseline.

### Related
- [[executor-wrote-to-main-tree-not-worktree]] — the recorded mistake this is the self-edit variant of

## Executor Wrote To Main Tree Not Worktree

`priority: high` · `domain: process` · `added: 2026-06-18` · `status: active` · `tags: [process, execution, git]`

**What happened** — During a `feature-readme` → `feature.md` rename, the executor edited the reference files using an absolute path rooted at the MAIN repo tree instead of the per-session worktree. The edits landed on the live working tree, not the isolated worktree branch. The executor caught it at its first verification gate and `git restore`'d the stray files; the manager independently confirmed the main tree was clean afterward.
**Why it happens** — The delegation listed in-scope files as worktree-relative paths. The executor resolved them against a repo-root absolute prefix rather than the session worktree path. A `cd` into the worktree does NOT persist across tool-call boundaries, and an absolute path that omits the `worktrees/<branch>/` segment silently targets the main tree — the file exists there too, so there is no error to flag the mistake.
**How to detect** — Any time you edit a file that exists in BOTH the main tree and a worktree, and your write path does not contain `worktrees/<branch>/`, you are writing to the wrong tree. The tell after the fact: a worktree-scoped content check still shows OLD content (your edits "didn't take"), while `git -C <main-tree> status` shows unexpected modified files.
**Correct approach** — Construct EVERY Write/Edit path from the session worktree path as the absolute root — the full path must contain `worktrees/<branch>/`. Never rely on a prior `cd` (it resets across tool boundaries). Use `git -C <worktree>` for all git operations. Verify immediately after the FIRST edit with a worktree-scoped `git grep` or `git -C <worktree> status`; if the worktree shows no change, you wrote elsewhere — stop and fix before continuing.
**User feedback** — The user did not surface this directly; the executor caught the wrong-tree write at its own first verification gate. The discipline above is the corrected approach the session adopted, and the reason every brief in that session pins absolute worktree paths on every write surface.
**Recurred (2026-06-29, D2 review)** — A leader-reviewer brief gave the write path as `WT/.gobbi/.../C3a.md`, defining `WT` at the top as the absolute worktree root and expecting the subagent to substitute it. 5 of 6 leaders substituted correctly; the 6th resolved the `WT/` prefix against its main-tree Bash CWD and wrote `C3a.md` to the main tree (recovered by `mv` into the worktree + removal of the stray gitignored main-tree session dir). The root cause is BRIEF-AUTHORING + MANAGER side, not only the executor's — two added preventions: (1) **Never leave a placeholder in a write path.** Paste the FULLY-EXPANDED absolute worktree path (no `WT/`, `$WT/`, `<worktree>/`, or CWD-relative `.gobbi/...`) for every write target in every delegation brief — a placeholder prefix IS the trap, because a fresh subagent's Bash CWD defaults to the main repo root. (2) **The manager verifies the artifact at the EXACT worktree path after the subagent returns** — `test -e` / `ls` the literal worktree path before treating the work as captured; do NOT trust the subagent's reported `ARTIFACT:` line, which may be a normalized/shortened form that hides a wrong-tree write.

## Executor Git Stash In Worktree During Verify

`priority: medium` · `domain: git` · `added: 2026-06-19` · `status: active` · `tags: [process, git, execution, verification]`

**What happened** — During an Execution-loop Verify step, an executor ran `git stash` inside the worktree to get a "clean baseline" to compare its edits against — a Forbidden Operation in a worktree. The stash reverted the executor's own in-scope uncommitted edits. It recovered with `git stash pop` and re-verified, but the work was briefly at risk of being lost (a stash pop can conflict, and an interrupted session would leave the edits buried in a stash entry).
**Why it happens** — The executor reached for `git stash` as a familiar "save my work, get a clean tree, look at the baseline, restore" trick — not recognizing that `git stash` is Forbidden in worktrees because uncommitted work is too easily lost (an unpopped stash, a conflicting pop, a session that ends before the pop). This re-occurred despite the git skill's explicit ban, which means the ban was not surfaced in the executor's working context at the moment the "compare against baseline" need arose.
**How to detect** — An executor (or any agent) planning a "stash, check the clean tree, unstash" sequence during Verify, or any `git stash` / `git stash pop` appearing in a worktree's command history. The intent phrasing to catch: "let me stash to get a clean baseline" — that is the trigger; redirect to `git show HEAD:<path>` / `git diff` before it runs.
**Correct approach** — Never `git stash` in a worktree. To compare current edits against a baseline, use read-only inspection: `git show HEAD:<path>` for the committed version, `git diff` / `git diff HEAD` for the uncommitted delta, `git diff <ref> -- <path>` for any other baseline — none touch the working tree. Executor briefs MUST restate the no-stash-in-worktree rule inline, at the point where verification/baseline-comparison is described, not only in the git skill the executor may not have loaded.

### Related
- [[executor-wrote-to-main-tree-not-worktree]] — a sibling executor git-discipline trap (writing outside the worktree); both are worktree-safety violations a brief must pre-empt inline

## Git Stash In Worktree Recurred Despite Loaded

`priority: high` · `domain: verification` · `added: 2026-06-26` · `status: active` · `tags: [verification, git, process]`

**What happened** — The already-recorded `executor-git-stash-in-worktree-during-verify` trap re-triggered during Execution task 06, while CONSTRUCTING a verification gate: the command being written used `git stash` to compare a working file against a baseline inside the worktree. The mistake file was loadable, yet it did not prevent the slip, because it was being re-introduced as a NEW verify-gate command — a context the recording does not cue.
**Why it happens** — The recorded mistake describes the trap as "an executor runs `git stash` during Verify", cueing the recognizer to watch for `git stash` in command HISTORY. But this recurrence was in command-AUTHORING — writing a verify gate that embeds `git stash`. A loaded mistake is a passive reference, not an active gate: nothing intercepts the moment an agent types `git stash` into a new command. Loading raises awareness of the trap-as-described, not the trap-as-re-encountered on a different surface.
**How to detect** — Any time you AUTHOR a verify command (a `verifies:` gate, a checklist assertion, a guard script) inside a worktree session, scan the command you just wrote for the literal token `git stash` before committing it — not only your interactive shell history. The trigger is "I need to compare a working file to its committed baseline" — exactly where `git stash` gets reached for, and exactly where it is wrong in a worktree.
**Correct approach** — Never put `git stash` (or `git stash pop`) in ANY worktree command — interactive OR authored into a gate / checklist / script. To compare against a baseline, use `git show HEAD:<path>` (read the committed blob) or `git diff` / `git diff HEAD -- <path>` (show the delta) — both non-mutating and safe in a worktree that carries prior commits. Treat the recorded mistake as covering command-construction, not just live command runs.

### Related
- [[executor-git-stash-in-worktree-during-verify]] — the recorded mistake that recurred

## Absolute Path Typo On Write Evades Cwd Guard

`priority: high` · `domain: process` · `added: 2026-06-16` · `status: active` · `tags: [process]`

**What happened** — While writing a file revision, an agent mistyped one character in the UUID/session-id segment of an absolute Write path (e.g. `...a87f...` instead of the correct `...a67f...`). The path was well-formed and pointed to a valid location — just the wrong one. The Write tool accepted it silently and created a stray directory tree. The agent re-wrote to the correct path but could not `rm` the stray tree (permission-blocked); the manager cleaned it up manually.
**Why it happens** — A single-character typo in an absolute path produces a path that is syntactically valid and resolves to a real location. The Write tool has no way to know the caller intended a different path. This error silently succeeds — it does NOT trigger the cwd-reset protections that catch relative or `pwd`-derived path errors, because those guards test whether a path is relative or stale-derived. A mistyped absolute path passes those checks; the protection that prevents cwd-reset drift is exactly what makes a mistyped absolute path undetectable at write time.
**How to detect** — Watch whenever an agent retypes a long UUID or session-id segment into an absolute Write/Edit path from memory or context rather than copying it from a confirmed source; uses a UUID segment that differs from another known path in only one position; or, after a Write, the expected file does not appear where assumed — check whether a stray tree was created at a near-miss path instead.
**Correct approach** — Never retype the session-id or UUID segment of an absolute path by hand. Always paste it from a confirmed source: the delegation prompt's stated write root, the output of a prior `pwd` or `ls`, or a verified `find`/Bash result from this turn. Prefer constructing long absolute paths from a verified `$ROOT` variable over typing the full path inline. If the path must be typed, verify the UUID segment character-by-character against the confirmed source before submitting the Write call.

## Worktree Empty Dir Sweep Deletes Live Session Scaffold

`priority: high` · `domain: git` · `added: 2026-06-23` · `status: active` · `tags: [process]`

**What happened** — During P5 cleanup of a merged PR's worktree, the documented empty-parent sweep `find .gobbi/projects/<name>/worktrees/ -type d -empty -delete` was run. That command recurses the ENTIRE worktrees tree and deletes EVERY empty dir — including the freshly-scaffolded but still-empty loop dirs and transcripts of the CURRENT live session's own worktree, which `init-record-map.sh` had just created. The live session's record skeleton was wiped.
**Why it happens** — `find <dir> -type d -empty -delete` is not "remove the leftover parent of the worktree I just removed" — it is "remove every empty directory anywhere under <dir>". A just-scaffolded session tree is all-empty dirs, so it matches. The git skill's P5 step 3 and P8 stage 7 BOTH prescribe this exact whole-worktrees form for the nested-branch empty-parent case, so the footgun is in the documented procedure, not just ad-hoc use.
**How to detect** — Any time a cleanup runs `find .../worktrees/ -type d -empty -delete` (or any recursive empty-dir delete) while another worktree/session is live or just-scaffolded. Red flag: the target path is the shared `worktrees` parent rather than the single removed worktree's own parent directory.
**Correct approach** — Scope the empty-parent cleanup to ONLY the removed worktree's parent chain. For a flat branch name there is no leftover parent — skip the find entirely. For a nested branch name (`feat/42-x` → leftover `worktrees/feat`), `rmdir` just that specific parent, or run the find rooted at that specific parent, never at the shared `worktrees` root. (The git skill P5 step 3 / P8 stage 7 commands should be fixed to the scoped form — tracked separately as a git-workflow backlog.)
