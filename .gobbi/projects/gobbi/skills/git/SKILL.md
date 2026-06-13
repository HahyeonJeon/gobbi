---
name: git
description: Git / GitHub workflow with worktree isolation. Load when managing branches, worktrees, PRs, or the issue-to-merge lifecycle.
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Git

Git and GitHub workflow. Load this skill when a task involves branching, worktree setup, PR creation, or the full issue-to-merge lifecycle.

The manager owns the lifecycle (issues / branches / pushes / PRs / merges / cleanup). Subagents work inside a worktree and commit their verified work; they never push, never create PRs, never touch issues. This boundary keeps integration controlled and predictable.

Companion file: [`conventions.md`](conventions.md) — deterministic rules for branch naming, commit grammar, footer trailers (including the `AI-Provenance-Record` trailer for AI-authored commits), PR template, label registry, and worktree path formula.

---

## Memory Access Matrix

The agent in any role (manager or subagent) MUST observe these tier boundaries.

| Resource | Reads | Writes |
|---|---|---|
| **Workspace files (in-scope worktree)** | manager + subagent | subagent (its task's `files:` scope only) |
| **Workspace files (out-of-scope)** | manager + subagent | none |
| **Worktree commits (local)** | manager + subagent | subagent (one focused commit per task, after Verify passes) |
| **Branches (local)** | manager + subagent | manager (create / rename) |
| **Branches (remote)** | manager | manager (push); subagent **never pushes** |
| **GitHub issues** | manager | manager (create / label / close); subagent **never touches** |
| **GitHub PRs** | manager | manager (create / merge); subagent **never touches** |
| **Git config (`~/.gitconfig`, `.git/config`)** | both | **never modified by either** — user config only |
| **Session notes / mistakes** | both | both — use `session.json.git.worktreePath` as the absolute root. `worktreePath` is always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal. Worktree-relative path construction via `git -C "$worktreePath" rev-parse --show-toplevel` for symlink + commit operations. Transcript path (`session.json.transcriptPath`) lives in user home (`~/.claude/projects/`) — not under either tree. |

**Critical rule — write paths**: session writes (notes, mistakes, memory drafts) MUST use `session.json.git.worktreePath` as the absolute root. `worktreePath` is always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal. Transcript paths (`session.json.transcriptPath`) live in `~/.claude/projects/...` and are outside both trees — never attempt to redirect them. The manager passes the worktree path in every delegation prompt when git is active. A subagent constructing a path relative to its current working directory rather than reading `session.json.git.worktreePath` risks writing to the wrong tree.

**Delete semantics**: this skill never deletes git history (no `branch -D` on un-merged branches without user confirmation; no `git reset --hard` outside Forbidden Operations exceptions). Worktrees are removed during cleanup (Procedure P5), but the local commits on the squash-merged branch are preserved in the reflog.

---

## Core Principles

> **Every task gets its own worktree.**

Worktrees are the mechanism that prevents concurrent session corruption. One worktree means one branch means one PR. This is the isolation invariant that makes parallel sessions safe. Without it, two sessions in the same working tree produce indistinguishable diffs — the manager cannot tell which changes belong to which session, and legitimate work gets reverted as scope creep.

> **The manager owns the git lifecycle. Subagents work within it.**

The manager creates worktrees, names branches, pushes to remote, creates PRs, monitors CI, merges, and cleans up. Subagents work inside a worktree — they commit their verified work but never push, never create PRs, never touch issues. This boundary keeps integration controlled and predictable.

> **Every task starts from a GitHub issue.**

The issue is the contract between ideation and execution. The manager either creates an issue from ideation output or picks up an existing issue the user provides. The issue number drives branch naming, PR references, and traceability. Without an issue, the work has no anchor. Multi-task features can use a hierarchical model — a parent issue for the feature and sub-issues for each independent task. See [`conventions.md`](conventions.md) for the sub-issue model.

> **Subagents commit. The manager pushes.**

This separation is the key to controlled integration. Subagents make focused, well-verified commits in the worktree as they complete their work. The manager pushes all commits and creates the PR only after all subtasks are complete and verified. Premature pushing from subagents would bypass the manager's integration authority.

> **AI provenance via the `AI-Provenance-Record` trailer.**

Every agent-authored commit carries an `AI-Provenance-Record:` footer trailer pointing back to the session and task. The trailer is the provenance record — it does NOT use `Co-Authored-By:` (which implies collaborator consent). See [`conventions.md` § Commit Trailers](conventions.md#commit-trailers).

---

## Prerequisites

Before the git workflow can function, certain conditions must hold. These divide into two severity tiers.

**Critical — block until resolved:**

| Prerequisite | Why it blocks |
|---|---|
| `gh` CLI available and reachable | Entire PR lifecycle depends on it |
| `gh` CLI authenticated to the remote | API access required for issue / PR / CI |
| Repository has a configured `origin` remote | Pushing and PR creation require a remote target |

These prerequisites gate the **PR lifecycle only**. The worktree and its branch are always created with local git — no `gh` is required for them. **No-`gh` resilience**: if the user cannot install `gh`, cannot authenticate, or no remote is available, the session still creates the worktree and commits on the branch; the manager DEFERS the PR and surfaces a "PR deferred — push/open when `gh` is available" notice. The session never falls back to working in the main tree.

**Warning — inform the user, continue:**

| Prerequisite | If missing |
|---|---|
| Configured base branch exists on the remote | Worktree creation will fail later; user may intend to create it |
| `.gobbi/projects/<name>/worktrees/` in `.gitignore` | Worktree contents appear in the main repo's `git status` |
| No orphaned worktrees from crashed sessions | Offer cleanup or recovery (see Procedure P6) |
| Worktree directory ignored — verified via `git check-ignore -q .gobbi/projects/<name>/worktrees/` | Pre-creation safety check |

**Re-verification principle**: base branch existence and the `.gitignore` check should be re-verified at the point of use (Procedure P2), not only at session start. Early checks catch problems early; late re-checks catch changes that occurred between setup and execution.

---

## Role Boundaries

| Responsibility | Manager | Subagent |
|---|---|---|
| Issue | Creates or picks up; labels; closes (when needed) | Never touches |
| Worktree | Creates before delegation, removes after merge | Works within (cd to path first) |
| Branch | Names and creates locally | Commits to it |
| Push to remote | Pushes after all subtasks are complete | **Never pushes** |
| PR | Creates, monitors CI | **Never creates** |
| Merge | `gh pr merge --squash --delete-branch`; pulls into local base | **Never merges** |
| Cleanup | Worktree remove + prune + empty parent dir cleanup | Never |

The manager passes the worktree's absolute path in every delegation prompt. The subagent's first action is to `cd` to that path. From that point, the subagent follows the standard Study, Plan, Execute, Verify, Commit lifecycle.

---

## Forbidden Operations

These commands are forbidden without **explicit user request** through the active runtime's user-decision primitive (Always-Ask category per the [`discussion` skill's Decision Classification](../discussion/SKILL.md#decision-classification) — they are destructive / irreversible operations).

| Forbidden command | Why | Safe alternative |
|---|---|---|
| `git push --force` / `-f` / `--force-with-lease` on shared branches | Rewrites remote history; can erase others' work | Open a new PR or revert the bad commit |
| `git reset --hard` | Discards uncommitted changes irreversibly | `git restore -s HEAD -- <path>` for a single file; commit-then-revert for repo-wide undo |
| `git checkout .` / `git restore .` | Mass discard of unstaged changes | Commit-then-discard individual files |
| `git commit --amend` after push | Rewrites pushed history | New commit (`fix: <description>`) or revert |
| `git rebase -i` on pushed history | Rewrites pushed history | New commits |
| `git branch -D` on unmerged branches | Discards branch tip irreversibly | `git branch -d` (only succeeds if merged) |
| `git stash` inside a worktree | Stash is per-worktree but easy to forget / lose if worktree is force-removed — never use stash to defer work across delegation boundaries | Create a temporary linked worktree (`git worktree add -b emergency-fix <path> <base>`), do the work, commit, then remove the temp worktree. Per `git-scm.com/docs/git-worktree`. |
| `gh pr close` without merge | Discards reviewed work | Either merge or convert to draft |
| `gh issue delete` | GitHub does not support undelete | `gh issue close` + comment explaining |
| `git worktree remove --force <path>` / `git worktree remove -f <path>` | Discards any uncommitted changes inside the worktree without review; work staged in the worktree (notes, edits, partial commits) is permanently lost | Run `git status` inside the worktree first to confirm a clean tree AND that the branch is merged into base; then use standard `git worktree remove <path>` (no `--force`). If unclean: commit, discard, or escalate to user through the active runtime's user-decision primitive before removal. |
| Subagent: `git push` / `gh pr *` / `gh issue *` | Bypasses manager's integration authority | Subagent reports `DONE`; manager handles |

**Cross-layer drift is not yet detected automatically.** Until issue #258 lands, every PR that touches multiple layers (e.g., agent docs + runtime specs + plugin agents) must be hand-reviewed for drift via adversarial review per `evaluation/SKILL.md`. See issue #258 for the planned validator.

**Safe-list exceptions** — these patterns may LOOK destructive but are routine and require no confirmation:

| Pattern | Why safe |
|---|---|
| `rm -rf node_modules/` | Routine clean-and-reinstall |
| `rm -rf dist/` / `build/` / `.next/` / `__pycache__/` / `.cache/` / `.turbo/` / `coverage/` | Routine build artifact cleanup |
| `git worktree remove <path>` after merge | Lifecycle cleanup per Procedure P5 |
| `git branch -d <merged-branch>` | Safe-delete (`-d` lowercase) only succeeds on merged branches |

---

## Procedures

Numbered procedures the manager runs during a git-active session. Subagents execute Procedure P3 (commit) inside their delegated worktree; everything else is manager-only.

### P1 — Verify prerequisites

At session start when the user selects "Git workflow (worktree + PR)":

1. Run `gh --version` to confirm CLI availability.
2. Run `gh auth status` to confirm authentication.
3. Run `git remote get-url origin` to confirm the remote is configured.
4. Run `git ls-remote --heads origin <base-branch>` to confirm the base branch exists on the remote.
5. Run `git check-ignore -q .gobbi/projects/<name>/worktrees/` to confirm the worktree directory is gitignored.

If any **Critical** prerequisite fails, worktree creation still proceeds (local git); the manager defers the PR and surfaces the "PR deferred" notice rather than aborting the session. If any **Warning** prerequisite fails, inform the user and continue (or remediate per their choice).

### P2 — Create worktree

P2 is invoked from Configuration row 1 (orchestration/SKILL.md Step 1), not from Execution start. The Execution-start invocation path is retired; executors are passed the existing `session.json.git.worktreePath`.

Steps (run once at Configuration row 1; not re-invoked per task entering Execution):

1. **Sync the base branch** — `git checkout <base-branch> && git pull --ff-only` to ensure the worktree branches from the up-to-date base.
2. **Re-verify base branch on remote** — `git ls-remote --heads origin <base-branch>` (the base may have been deleted between session start and now).
3. **Create the worktree** — `git worktree add -b <branch-name> .gobbi/projects/<name>/worktrees/<branch-name> <base-branch>`. Branch name follows the regex in [`conventions.md` § Branch Naming](conventions.md#branch-naming).
4. **Install dependencies in the worktree** — each worktree has its own working directory; package managers, virtual environments, and build caches are not shared. Run the project's install command (e.g., `bun install`, `npm ci`) before delegating.
5. **Pass the absolute worktree path** to every delegation prompt that operates on this task.

### P3 — Delegate within worktree (subagent procedure)

The subagent's first action is to `cd` to the worktree's absolute path. From there, the subagent follows the standard Study → Plan → Execute → Verify → Commit lifecycle (per [`execution/SKILL.md`](../execution/SKILL.md)). Per-task commit rules:

- **Commit only after Verify passes** — never commit unverified work.
- **One focused commit per subtask** — commit grammar per [`conventions.md` § Commit Messages](conventions.md#commit-messages).
- **Commit message footer carries `AI-Provenance-Record:`** per [`conventions.md` § Commit Trailers](conventions.md#commit-trailers).
- **Never push** — the manager owns push.

### P4 — Push and open PR

After all subtasks for the issue are complete and verified:

1. `cd` to the worktree path.
2. **Push the branch** — `git push -u origin <branch-name>`.
3. **Open the PR** with `gh pr create` — title and body follow [`conventions.md` § Pull Request Format](conventions.md#pull-request-format).
4. **Apply type label** — `gh pr edit <num> --add-label <type>` per [`conventions.md` § Label Registry](conventions.md#label-registry).
5. **Monitor CI** — `gh pr checks <num> --watch` (or equivalent for external CI).

### P5 — Land PR

**Pre-merge gate** — all preconditions must hold before merging:

- [ ] All CI checks green on the PR branch HEAD
- [ ] All subtasks marked done in the plan
- [ ] No subagent has uncommitted changes in the worktree
- [ ] PR body has all required sections per [`conventions.md` § Pull Request Format](conventions.md#pull-request-format)
- [ ] If targeting a non-default branch: note linked issues that the manager must close manually post-merge (closing keywords only trigger on default-branch merges)

If any precondition fails, do not merge — surface the failing item to the user.

**Merge sequence** (all preconditions pass):

1. `gh pr merge <num> --squash --delete-branch` — atomic squash merge + remote branch deletion.
2. `git checkout <base-branch> && git pull --ff-only` — sync the local base branch with the merge.
3. Before removing the worktree: run `git status` inside it to confirm a clean working tree AND that the branch is merged into base. Then `git worktree remove .gobbi/projects/<name>/worktrees/<branch-name>`. **Never use `--force` / `-f` without explicit user approval through the active runtime's user-decision primitive** — force-remove silently discards any uncommitted work inside the worktree (Forbidden Operations). If the status is unclean, commit or discard explicitly before removal.
4. `git worktree prune` — clean stale references.
5. **Clean up empty parent directories** — nested branch names like `feat/42-x` create `worktrees/feat/` parent dirs; `git worktree remove` only removes the leaf. Run `find .gobbi/projects/<name>/worktrees/ -type d -empty -delete`.
6. **If non-default-branch PR**: close linked issues — `gh issue close <num> -c "Closed by PR #<pr-num>"` for each.

### P6 — Recover orphaned worktree

When `gh pr list` or `git worktree list` surfaces an orphaned worktree (left from a crashed or abandoned session):

1. **Inspect** — `cd <orphaned-worktree> && git log -3` to see what's there.
2. **Surface to manager** via `NEEDS_CONTEXT` with a `user-question:` block: "Found orphaned worktree at `<path>` with N commits — recover the work, resume from here, or clean up?" — the manager presents this to the user through the active runtime's user-decision primitive.
3. **If recover** — continue from the existing commits (skip P2; jump to P3 if work needs to continue, or P4 if work is complete).
4. **If clean up** — `git worktree remove <path>` + `git worktree prune` + cleanup empty parent dirs.

### P7 — Handle CI failure

When a PR's CI fails:

1. **Identify the failed run** — `gh run list --branch <branch-name> --limit 5`.
2. **View logs** — `gh run view <run-id> --log-failed`.
   - For external CI (CircleCI, Jenkins, etc.), `gh` returns nothing useful — surface the status check URL from the PR for the user to inspect.
3. **Diagnose root cause** from the logs.
4. **Fix in the worktree** — delegate to executor with the diagnosis as scope context; executor commits the fix.
5. **Push the fix** — `git push` (CI re-runs automatically against the updated branch).
6. **Monitor** — `gh pr checks <num> --watch` until pass or the user decides to defer.

---

## Failure Modes and Recovery

Common failures and their recovery paths.

| Failure | Recovery |
|---|---|
| Worktree creation fails — branch already exists | Branch may be in use by another session or left over. Report to user; offer to reuse the existing worktree (Procedure P6) or rename the branch. |
| `gh` CLI not authenticated | Covered by Procedure P1 — verified at session setup. |
| Orphaned worktrees from crashed session | Procedure P6 (Recover orphaned worktree). |
| CI failure on the PR | Procedure P7 (Handle CI failure). |
| Cleanup failure when removing a worktree | Normal removal fails when the worktree has uncommitted files or locked refs. Run `git status` inside the worktree first — if unclean, commit or discard explicitly before retrying removal. `--force` / `-f` is Forbidden without explicit user approval through the active runtime's user-decision primitive (it silently discards uncommitted work). After successful removal, prune (`git worktree prune`) and clean empty parent dirs. |
| Stash content lost during worktree removal | Stash is per-worktree and lost with the worktree. **Do not use stash inside worktrees** (Forbidden Operations table). For context switches, create a temporary linked worktree per the safe-alternative rule. |
| Base branch deleted on remote between session start and worktree creation | Procedure P2 step 2 (re-verification) catches this. Surface to user; switch base or recreate. |

---

## Output paths

Git operations don't write to session record directly (writes happen via session note / mistake files, which root at `session.json.git.worktreePath` — always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal). The main "outputs" of the git skill are git objects: commits, branches, PRs, issues.

**Path conventions**

- `<branch-name>` — kebab-case, matches the regex in [`conventions.md` § Branch Naming](conventions.md#branch-naming) (e.g., `feat/42-oauth-login`)
- `<name>` — project name from `session.json.project`
- `<num>` — GitHub issue or PR number

| Output | Owner | Destination |
|---|---|---|
| Worktree directory | manager (P2 create, P5 remove) | `.gobbi/projects/<name>/worktrees/<branch-name>/` |
| Local branch | manager (P2 create) / subagent (P3 commit) | local `.git/refs/heads/<branch-name>` |
| Remote branch | manager (P4 push, P5 merge+delete) | `origin/<branch-name>` |
| GitHub issue | manager (P1/orchestration) | GitHub repository issues |
| GitHub PR | manager (P4 create, P5 merge) | GitHub repository PRs |
| Session notes / mistakes | manager + subagent | `.gobbi/projects/<name>/sessions/.../`, `.gobbi/projects/<name>/mistakes/` — rooted at `session.json.git.worktreePath` (always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal). Transcript paths (`session.json.transcriptPath`) live in `~/.claude/projects/` — outside both trees. |

---

## Constraints

- **MUST give every task its own worktree** — isolation invariant; one worktree, one branch, one PR.
- **MUST verify prerequisites** at session start (Procedure P1) and re-verify at point of use (Procedure P2 step 2 for base branch).
- **MUST never push from a subagent** — subagents commit; the manager pushes.
- **MUST never create or merge a PR from a subagent** — subagents return `DONE`; the manager handles PR creation and merge.
- **MUST never run a Forbidden Operations command** without explicit user request through the active runtime's user-decision primitive (Always-Ask category).
- **MUST never use `git stash` inside a worktree** — use a temporary linked worktree instead (per `git-scm.com/docs/git-worktree`).
- **MUST install dependencies per worktree** — each worktree has its own working directory; package managers and caches are not shared.
- **MUST validate branch names + commit messages** against the regexes in [`conventions.md`](conventions.md) before pushing.
- **MUST attach `AI-Provenance-Record:`** to every agent-authored commit — never `Co-Authored-By:`.
- **MUST run the pre-merge gate checklist** before invoking `gh pr merge` (Procedure P5).
- **MUST close linked issues manually** when the PR targets a non-default branch (closing keywords don't auto-fire — Procedure P5 step 6).
- **MUST root session notes and mistakes at `session.json.git.worktreePath`** — always set in normal operation; a `null` value indicates a malformed/partial `session.json` and must be surfaced as an error, not used as a main-tree write signal. Transcript paths (`session.json.transcriptPath`) live in `~/.claude/projects/` — outside both trees and never redirected.
- **MUST never modify `~/.gitconfig` or `.git/config`** — user config only.
- **MUST never `git branch -D` an unmerged branch** without user confirmation.
- **MUST never `git reset --hard` outside Forbidden Operations exceptions** without user confirmation.
- **Base branch is project-specific** — never hardcoded; ask the user at session setup and store as session-level configuration.
- **GitHub + the `gh` CLI are required only for the PR lifecycle** — worktree creation and commits work without them; when `gh`, auth, or the remote is unavailable the PR is deferred (push/open when `gh` is available) and the session never falls back to the main tree.
