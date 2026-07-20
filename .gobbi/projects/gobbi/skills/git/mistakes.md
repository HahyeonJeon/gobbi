---
type: mistakes
skill: git
description: "Recorded traps for git — load before doing git work"
updated: 2026-07-20
---

# Git — Mistakes

> Load before any git work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Executor Edited Main Tree Not Worktree Copy

`priority: high` · `domain: process` · `added: 2026-06-26` · `status: active` · `tags: [git, process, verification]`

**What happened** — The brief defined `PM = $WT/.gobbi/projects/gobbi` (the per-session worktree). The executor read and Edited the MAIN-tree absolute path, dropping the `worktrees/{branch}/` segment. Because gobbi edits its OWN skill tree, the same tracked path `.gobbi/projects/gobbi/skills/...` exists in BOTH the main checkout (branch `develop`) and the worktree checkout (the session branch) as separate inodes. All 6 edits landed in the main tree; the worktree copies stayed untouched. The verification gate read the exact worktree paths and still found the committed preimage, surfacing the error.
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
**Recurred (2026-06-29, D2 review)** — A leader-reviewer brief gave the write path as `<WT>/.gobbi/.../C3a.md`, defining `WT` at the top as the absolute worktree root and expecting the subagent to substitute it. 5 of 6 leaders substituted correctly; the 6th resolved the `WT` placeholder prefix against its main-tree Bash CWD and wrote `C3a.md` to the main tree (recovered by `mv` into the worktree + removal of the stray gitignored main-tree session dir). The root cause is BRIEF-AUTHORING + MANAGER side, not only the executor's — two added preventions: (1) **Never leave a placeholder in a write path.** Paste the FULLY-EXPANDED absolute worktree path (no `WT` placeholder, `$WT` variable, `<worktree>` marker, or CWD-relative `.gobbi/...`) for every write target in every delegation brief — a placeholder prefix IS the trap, because a fresh subagent's Bash CWD defaults to the main repo root. (2) **The manager verifies the artifact at the EXACT worktree path after the subagent returns** — `test -e` / `ls` the literal worktree path before treating the work as captured; do NOT trust the subagent's reported `ARTIFACT:` line, which may be a normalized/shortened form that hides a wrong-tree write.

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

**What happened** — During P5 cleanup of a merged PR's worktree, the documented empty-parent sweep `find .gobbi/projects/<name>/worktrees/ -type d -empty -delete` was run. That command recurses the ENTIRE worktrees tree and deletes EVERY empty dir — including the freshly-scaffolded iteration, evaluation, staging, and output directories of the CURRENT live session, which `skills/record/scripts/session-record.sh init` had just created. The live session's record skeleton was wiped.
**Why it happens** — `find <dir> -type d -empty -delete` is not "remove the leftover parent of the worktree I just removed" — it is "remove every empty directory anywhere under <dir>". A just-scaffolded session record contains many deliberately empty directories, so it matches. The git skill's P5 step 3 and P8 stage 7 BOTH prescribe this exact whole-worktrees form for the nested-branch empty-parent case, so the footgun is in the documented procedure, not just ad-hoc use.
**How to detect** — Any time a cleanup runs `find .../worktrees/ -type d -empty -delete` (or any recursive empty-dir delete) while another worktree/session is live or just-scaffolded. Red flag: the target path is the shared `worktrees` parent rather than the single removed worktree's own parent directory.
**Correct approach** — Scope the empty-parent cleanup to ONLY the removed worktree's parent chain. For a flat branch name there is no leftover parent — skip the find entirely. For a nested branch name (`feat/42-x` → leftover `worktrees/feat`), `rmdir` just that specific parent, or run the find rooted at that specific parent, never at the shared `worktrees` root. (The git skill P5 step 3 / P8 stage 7 commands should be fixed to the scoped form — tracked separately as a git-workflow backlog.)

## Codex Subagent Apply Patch Wrong Tree

`priority: high` · `domain: git` · `added: 2026-07-06` · `status: active` · `tags: [git, codex, process, verification]`

**What happened** — A Codex subagent ran shell reads and verification with `workdir` set to the session worktree, but wrote evaluation files through patch paths like `.gobbi/projects/...`. Those patch writes landed in the main checkout, not the worktree session path.
**Why it happens** — `exec_command.workdir` anchors shell commands only. Other write surfaces can resolve relative patch paths against the subagent's own root, so a shell command can verify the right tree while patch output appears in a different checkout.
**How to detect** — Runtime evidence shows worktree-scoped shell commands, but the reported patch targets are relative `.gobbi/...` paths. The expected files are missing under `session.json.git.worktreePath`, while the main checkout reports the unexpected changes.
**Correct approach** — Give every writable session-artifact target as a fully expanded absolute path under the worktree root. After the subagent returns, verify the exact worktree path with `test`, `find`, or `rg` before accepting the artifact.

### Related
- [[executor-wrote-to-main-tree-not-worktree]] — the general wrong-tree write trap.
- [[edit-tool-silent-write-failure-on-worktree]] — disk state must be verified from the target tree.

## Moving Base Invalidates Diff Stat Gate

`priority: high` · `domain: verification` · `added: 2026-07-06` · `status: active` · `tags: [git, verification, process]`

**What happened** — A task plan encoded a fixed numeric diff-stat gate for `develop..HEAD`. The branch still had the expected commits, but `develop` moved, so the same previous branch produced a different diff stat. After the user approved a pinned base snapshot, `develop` moved again and the symbolic diff changed again.
**Why it happens** — A branch-name comparison is a moving target. Treating the current `develop..HEAD` stat as a stable property of a previous branch bakes an unstated base commit into the verification contract.
**How to detect** — A verification command references a mutable branch name such as `develop..HEAD` while expecting a fixed number like `116 files changed`. The gate can change even when the audited branch's own commits do not.
**Correct approach** — Pin the base commit for numeric diff-stat gates in historic branch audits. If the task intentionally follows a moving branch name, verify the stat at Execution time and do not lock a literal number before the command runs. If the base moved, record the divergence and ask before revising the task contract.

### Related
- [[verify-state-from-authoritative-source-not-proxy]] — live source evidence overrides proxy assumptions.
- [[literal-grep-gate-false-fails-legitimate-usage]] — literal gates can fail for reasons outside the intended property.

## Provenance Trailer Syntax Drift

`priority: medium` · `domain: git` · `added: 2026-07-06` · `status: active` · `tags: [git, verification, process]`

**What happened** — A branch audit stopped at the fact that each commit had an `AI-Provenance-Record` trailer. The trailers were traceable, but several did not match the canonical `gobbi://session/{session-id}/task/{task-id}` shape.
**Why it happens** — Human traceability and syntax conformance are easy to conflate. A review that checks only for trailer presence can miss a missing URI scheme, a wrong task segment, or a non-task terminal segment.
**How to detect** — Any provenance review says "all commits have the trailer" without comparing each trailer against the documented shape. Red flags include a missing URI scheme, direct task path pieces, or a terminal wrap-up segment where the parser expects a task segment.
**Correct approach** — Record syntax drift separately from absent provenance when every commit remains traceable. In audit-only work, preserve the git-log evidence and do not rewrite history; leave any trailer standardization to an explicitly scoped follow-up.

## Manager Edited Main Checkout Not The Session Worktree

`priority: high` · `domain: verification` · `added: 2026-07-11` · `status: active` · `tags: [verification, process]`

**What happened** — In a multi-worktree session (the feature branch lived in a linked worktree), the manager's first Read/Edit targeted the MAIN checkout's copy of the file — which is on `develop` — instead of the worktree's copy on the feature branch. The edit "succeeded" (the `old_string` matched, because the same text existed on both trees), so nothing errored and the change silently landed on the wrong tree.
**Why it happens** — The main checkout and the worktree hold the SAME relative path (`.gobbi/projects/{name}/skills/.../SKILL.md`), so an absolute path that omits the worktree prefix resolves to the main tree. The two files often share identical text, so an Edit against the wrong one matches and reports success — the mistake produces no error signal.
**How to detect** — After an edit, a verification grep against the WORKTREE-absolute path still shows the pre-edit content (the edit landed elsewhere); or `git -C <main> status` shows an unexpected modification on `develop` for a file the session should be changing only in the worktree.
**Correct approach** — In any worktree session, every Read / Edit / grep uses the WORKTREE-absolute path (`.../worktrees/<branch>/...`), and every git op uses `git -C <worktree-abs>` (never a bare `git` or a main-tree path). Verify each edit against the worktree path. If the wrong tree was touched, `git -C <main> checkout -- <path>` restores it, then re-apply on the worktree.
