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

## Runtime git environment

Git runs under a runtime sandbox. The sandbox decides which git operations run on their own, which prompt for approval, and which are blocked outright. The split is the same on both runtimes: `git commit` writes inside the workspace and runs in-boundary; `git push` and `gh` need network and are out-of-boundary, so they prompt or fail by default. This is the *runtime git posture* — read it before attempting a push or a PR, not after the wall is hit.

This section is the home of the **git-relevant** runtime sandbox model — the sandbox modes, approval policies, and network behavior that decide whether `git commit` / `git push` / `gh` run, prompt, or block. For the **operational usage** of these Codex sandbox modes (how `codex exec` is launched with `--sandbox workspace-write` / `read-only` for bridge and evaluator work), see [`codex` skill § codex exec](../codex/SKILL.md#codex-exec). For the per-runtime env-var surface (session id, network signal), see the [Runtime Matrix](../codex/SKILL.md#runtime-matrix).

### Claude Code

The agent runs under an OS sandbox.

- **No network domains are pre-allowed.** Reaching `github.com` / `api.github.com` for `git push` or `gh` prompts for approval on first use, unless `allowedDomains` lists the domain. If `allowManagedDomainsOnly` is set in managed settings, non-allowed domains are blocked outright instead of prompting.
- **`gh` may fail TLS verification under the macOS Seatbelt sandbox.** `gh` is a Go CLI, and Go's TLS path is blocked under Seatbelt. The remedy is listing `gh` in `excludedCommands` so it runs outside the sandbox. A passing `gh --version` / `gh auth status` check (Procedure P1) does not guarantee `gh pr create` (Procedure P4) succeeds under the sandbox.
- **`Bash(git push *)` ask-rules force a prompt** even when the command would otherwise auto-run sandboxed. A sandbox-failed command may retry outside the sandbox via `dangerouslyDisableSandbox` — unless Strict mode (`allowUnsandboxedCommands: false`) removes that escape hatch.
- **Commit works in the worktree without extra config**; the sandbox grants writes to the shared `.git` so `git commit` updates refs and the index, but writes to `.git/hooks/` and `.git/config` stay denied.

Source anchor: https://code.claude.com/docs/en/sandboxing

### Codex

Codex has three sandbox modes (`read-only` / `workspace-write` / `danger-full-access`) and a set of approval policies (e.g., `untrusted` / `on-request` / `never`, plus a granular policy object — see the config-reference URL below for the current full set). In a git repo the default is `workspace-write` + `on-request`. The git consequences are:

- **`workspace-write` keeps network OFF by default.** Enable it explicitly via `[sandbox_workspace_write] network_access = true` (default `false`). Gobbi does not ship this enabled.
- **`git commit` runs in-boundary** under `workspace-write` — it writes inside the workspace `.git`, so no escalation.
- **`git push` and `gh` need network and escalate.** Under `on-request` they raise an approval prompt; if approved they run within sandbox constraints. Under `never` no prompt is offered, so a network-needing command cannot proceed autonomously.
- **`read-only` mode forbids edits AND command execution without approval.** A read-only Codex session cannot run the worktree-commit model — `git commit` itself is blocked, not only push.

Source anchors: https://developers.openai.com/codex/concepts/sandboxing, https://developers.openai.com/codex/agent-approvals-security, https://developers.openai.com/codex/config-reference

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

These prerequisites gate the **PR lifecycle only**. The worktree and its branch are always created with local git — no `gh` is required for them.

**PR-deferred resilience — five triggers.** The manager DEFERS the PR (creates the worktree and commits on the branch, then surfaces a "PR deferred — push/open when the blocker clears" notice) on ANY of these five triggers. The deferral mechanism is the same for all five; only the trigger differs:

1. **`gh` missing** — the CLI is not installed or not on `PATH`.
2. **`gh` unauthenticated** — `gh auth status` fails; no API access.
3. **No remote** — the repo has no configured `origin`.
4. **Network-blocked** — the sandbox has network off (default Codex `workspace-write`; Claude Code with the push domain not in `allowedDomains`), so `git push` / `gh` cannot reach the remote. Detected by the git posture probe at P1.
5. **Approval-not-granted** — on Codex `on-request` the user declined the push/`gh` escalation, or the session is on `never` (no escalation is offered). The networked op cannot proceed autonomously.

The session never falls back to working in the main tree. See [Runtime git environment](#runtime-git-environment) for the per-runtime posture behind triggers 4–5.

**Remediation menu — OFFERED before deferral, never auto-applied (Always-Ask).** Before deferring on trigger 4 or 5, the manager OFFERS a runtime-specific remediation the user may accept or decline. This is an Always-Ask decision per the [`discussion` skill's Decision Classification](../discussion/SKILL.md#decision-classification) (it modifies sandbox / config state). The manager NEVER auto-edits `.codex/config.toml` or Claude Code settings, and gobbi ships NO default network enablement. If the user declines, the op defers.

| Runtime | Offered remediation |
|---|---|
| Claude Code | Add `github.com` (and `api.github.com`) to `allowedDomains`; add `gh` to `excludedCommands` to fix the Seatbelt TLS failure. |
| Codex | Opt into `[sandbox_workspace_write] network_access = true`, OR approve the `on-request` escalation for the specific push/`gh` op. |

The menu is **OFFERED only** — the manager surfaces it through the active runtime's user-decision primitive and applies nothing on its own. A declined remediation routes to the PR-deferred path above.

**Read-only Codex policy (OQ-5).** A `read-only` Codex session cannot commit or `git worktree add`, so the worktree-commit model cannot run at all — this is not a per-op deferral but a session-level blocker. Read-only is detected **behaviorally**, not from a probe field: the posture probe honestly reports `sandbox_mode: unknown` (it is not introspectable), so read-only surfaces when the first write op — `git worktree add` (Procedure P2) or the first `git commit` — is blocked or demands approval. On that block the manager surfaces: "gobbi needs at least `workspace-write`." It then OFFERS two options — (i) re-launch the session with `workspace-write`, or (ii) run an explicit read-only **plan/chat-only** mode (no commits, no Execution). It does NOT fall back to per-op approval escalation and does NOT fail silently.

**Warning — inform the user, continue:**

| Prerequisite | If missing |
|---|---|
| Configured base branch exists on the remote | Worktree creation will fail later; user may intend to create it |
| `.gobbi/projects/<name>/worktrees/` in `.gitignore` | Worktree contents appear in the main repo's `git status` |
| No orphaned worktrees from crashed sessions | Offer cleanup or recovery. For a SINGLE orphan mid-session, use Procedure P6. When MORE THAN ONE orphan is detected, offer the Procedure P8 bulk sweep (audited, liveness-protected). |
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
| Merge | `gh pr merge --squash` (no `--delete-branch`); pulls into local base, then removes the worktree before deleting the remote + local branch (P5 sequence) | **Never merges** |
| Cleanup | Worktree remove + prune + empty parent dir cleanup | Never |

The manager passes the worktree's absolute path in every delegation prompt. The subagent's first action is to `cd` to that path. From that point, the subagent follows the standard Study, Plan, Execute, Verify, Commit lifecycle.

**The split maps onto each runtime's sandbox boundary.** `git commit` writes inside the workspace `.git`, so it runs **in-boundary** on BOTH runtimes — a subagent can always commit its verified work without escalation. `git push` and `gh` need network, so they are **out-of-boundary** (they prompt for approval or fail by default) — which is exactly why the manager owns them and the subagent never pushes. The split is not only a gobbi convention; it lines up with what each sandbox allows. See [Runtime git environment](#runtime-git-environment) for the per-runtime posture.

**`.git/hooks` and `.git/config` writes are OS-denied.** Commit-in-worktree works on both runtimes because the sandbox grants writes to the shared `.git` (refs + index). It does NOT grant writes to `.git/hooks/` or `.git/config` — those are denied by the OS sandbox, not only by the gobbi rule in the [Memory Access Matrix](#memory-access-matrix). The "never modify `.git/config`" rule is an OS-enforced reality: an agent that tries cannot succeed regardless of intent.

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
| `git branch -D` on unmerged branches | Discards branch tip irreversibly | `git branch -d` (only succeeds if merged). **Sanctioned exception:** `git branch -D` IS allowed — no Always-Ask — WHEN the branch is confirmed merged-by-squash via PR-association (a merged PR whose head was this branch). This is the ONLY safe `-D` use: a squash-merge produces a new commit with no history overlap, so `git branch -d` cannot recognize the branch as merged and force-delete is the only path. See Procedure P5 step 5 for the procedure. The ban above stands for genuinely unmerged branches (no merged-PR association). |
| `git stash` inside a worktree | Stash is per-worktree but easy to forget / lose if worktree is force-removed — never use stash to defer work across delegation boundaries | Create a temporary linked worktree (`git worktree add -b emergency-fix <path> <base>`), do the work, commit, then remove the temp worktree. Per `git-scm.com/docs/git-worktree`. |
| `gh pr close` without merge | Discards reviewed work | Either merge or convert to draft |
| `gh issue delete` | GitHub does not support undelete | `gh issue close` + comment explaining |
| `git worktree remove --force <path>` / `git worktree remove -f <path>` | Discards any uncommitted changes inside the worktree without review; work staged in the worktree (notes, edits, partial commits) is permanently lost | Run `git status` inside the worktree first to confirm a clean tree AND that the branch is merged into base by PR-association (P5 step 3's `gh pr view <num> --json state,mergedAt` MERGED check — NOT `git branch --merged`, which a squash false-negatives); then use standard `git worktree remove <path>` (no `--force`). If unclean: commit, discard, or escalate to user through the active runtime's user-decision primitive before removal. |
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

1. **Read the runtime git posture FIRST** — run [`skills/git/scripts/git-posture-probe.sh`](scripts/git-posture-probe.sh) to learn the runtime / network / sandbox-mode / approval-policy BEFORE assuming the PR lifecycle (push / `gh`) can run. The probe is read-only; it never mutates state. A field reported as `unknown` (sandbox-mode and approval-policy are not introspectable) means "ask before assuming push works" — do not treat `unknown` as "enabled". The probe does NOT detect read-only Codex (`sandbox_mode` is always `unknown`); read-only surfaces behaviorally when `git worktree add` (Procedure P2) or the first `git commit` is blocked — at that point apply the read-only policy in [Prerequisites](#prerequisites).
2. Run `gh --version` to confirm CLI availability.
3. Run `gh auth status` to confirm authentication.
4. Run `git remote get-url origin` to confirm the remote is configured.
5. Run `git ls-remote --heads origin <base-branch>` to confirm the base branch exists on the remote.
6. Run `git check-ignore -q .gobbi/projects/<name>/worktrees/` to confirm the worktree directory is gitignored.

If any **Critical** prerequisite fails — or the posture probe shows the network blocked, or a push/`gh` approval is declined or unavailable (`approval-not-granted`, surfaced behaviorally when the user declines the `on-request` escalation or the session is on `never`) — worktree creation still proceeds (local git); the manager defers the PR and surfaces the "PR deferred" notice rather than aborting the session (the five-trigger deferral in [Prerequisites](#prerequisites)). If any **Warning** prerequisite fails, inform the user and continue (or remediate per their choice).

### P2 — Create worktree

P2 is invoked from Configuration row 1 (orchestration/SKILL.md Step 1), not from Execution start. The Execution-start invocation path is retired; executors are passed the existing `session.json.git.worktreePath`.

Steps (run once at Configuration row 1; not re-invoked per task entering Execution):

1. **Sync the base branch** — `git checkout <base-branch> && git pull --ff-only` to ensure the worktree branches from the up-to-date base.
2. **Re-verify base branch on remote** — `git ls-remote --heads origin <base-branch>` (the base may have been deleted between session start and now).
3. **Create the worktree** — `git worktree add -b <branch-name> .gobbi/projects/<name>/worktrees/<branch-name> <base-branch>`. Branch name follows the regex in [`conventions.md` § Branch Naming](conventions.md#branch-naming).
4. **Install dependencies in the worktree** — each worktree has its own working directory; package managers, virtual environments, and build caches are not shared. Run the project's install command (e.g., `bun install`, `npm ci`) before delegating. **This step needs network**: under a sandbox with network off (default Codex `workspace-write`; Claude Code with no matching `allowedDomains`) it may be blocked or escalate to approval. The install is NOT guaranteed under sandbox — if it is blocked, handle it via the remediation menu, then the PR-deferred path, in [Prerequisites](#prerequisites). Do not assume the install always succeeds.
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
3. **Open the PR — or reuse the open one (idempotent).** Before creating, check whether a PR for this branch already exists: `gh pr list --head <branch-name> --json number,state`. If an open PR is found (e.g. Execution already opened it and Wrap-up is now adding promotion commits), do NOT create a duplicate — step 2 has already pushed the new commits to the same branch, so the existing PR now carries them; reuse its number and continue. Only if no open PR exists, create one with `gh pr create` — title and body follow [`conventions.md` § Pull Request Format](conventions.md#pull-request-format).
4. **Apply type label** — `gh pr edit <num> --add-label <type>` per [`conventions.md` § Label Registry](conventions.md#label-registry). Skip if the label is already applied (reused PR).
5. **Monitor CI** — `gh pr checks <num> --watch` (or equivalent for external CI).

### P5 — Land PR

**Pre-merge gate** — all preconditions must hold before merging:

- [ ] All CI checks green on the PR branch HEAD
- [ ] All subtasks marked done in the plan
- [ ] No subagent has uncommitted changes in the worktree
- [ ] PR body has all required sections per [`conventions.md` § Pull Request Format](conventions.md#pull-request-format)
- [ ] If targeting a non-default branch: note linked issues that the manager must close manually post-merge (closing keywords only trigger on default-branch merges)

If any precondition fails, do not merge — surface the failing item to the user.

**Merge-conflict recovery (runtime-neutral).** A base-sync `git pull --ff-only` (P2 step 1 or the post-merge sync below) or a PR-branch conflict against the base must not be resolved silently. Recovery path: **detect** the conflict (the `--ff-only` pull aborts, or the PR shows merge conflicts) → **surface to the manager** → the manager delegates resolution to the executor, who **resolves it in the worktree** (the in-boundary commit model applies) → **re-verify** (run the task's verification commands again on the resolved tree) → **continue** the merge sequence. Forbidden Operations still apply: no force-push and no `git reset --hard` without an explicit Always-Ask approval. This split — manager detects/owns the merge, executor resolves in the worktree — follows the same boundary as commit-vs-push.

**Merge sequence** (all preconditions pass):

The order is deliberate: the worktree must be removed BEFORE either branch is deleted, because a branch held by a worktree cannot be deleted (remote or local). Do NOT pass `--delete-branch` to `gh pr merge` — it runs while the worktree still holds the branch and the delete fails ("branch used by worktree").

1. **Merge the PR** — `gh pr merge <num> --squash`. Squash-merge only; do NOT add `--delete-branch` (it cannot delete a worktree-held branch).
2. **Sync the local base** — `git checkout <base-branch> && git pull --ff-only` to bring the local base to the merge commit.
3. **Remove the worktree** — run `git status` inside it first to confirm a clean working tree. Confirm the branch is merged into base by PR-association — `gh pr view <num> --json state,mergedAt` shows `MERGED` with a non-null `mergedAt` (the SAME method as step 5) — NOT `git branch --merged` / `git branch -d` recognition, which a squash-merge false-negatives (a squash produces a new commit with no history overlap). Then `git worktree remove .gobbi/projects/<name>/worktrees/<branch-name>`, followed by `git worktree prune` (clean stale references) and the empty-parent cleanup — scope it to the REMOVED worktree's own parent chain, NEVER `find .gobbi/projects/<name>/worktrees/ -type d -empty -delete` over the shared root (that recurses the whole `worktrees/` tree and deletes a CONCURRENT live session's just-scaffolded empty dirs — see `mistakes/git/worktree-empty-dir-sweep-deletes-live-session-scaffold.md`): `rmdir -p "$(dirname .gobbi/projects/<name>/worktrees/<branch-name>)" 2>/dev/null || true` (removes only the leftover parent chain of the just-removed worktree — e.g. the `worktrees/feat/` left by a nested `feat/42-x` — and stops at the first non-empty dir, so the shared `worktrees/` root and other live worktrees are untouched). **Never use `--force` / `-f` without explicit user approval through the active runtime's user-decision primitive** — force-remove silently discards any uncommitted work inside the worktree (Forbidden Operations). If the status is unclean, commit or discard explicitly before removal.
4. **Delete the REMOTE branch** — `git push origin --delete <branch-name>`. The worktree no longer holds the branch, so the delete now succeeds (this is why `--delete-branch` at step 1 fails and is dropped).
5. **Delete the LOCAL branch** — first confirm the squash-merge landed via PR-association: `gh pr view <num> --json state,mergedAt` shows `MERGED` with a non-null `mergedAt`, or `gh api repos/{owner}/{repo}/commits/<base-branch>/pulls` associates the branch's PR as merged. Then run `git branch -D <branch-name>` as the SANCTIONED exception (Forbidden Operations § `-D` carve-out): a squash-merge defeats `git branch -d`, so force-delete is the only path AFTER merge is confirmed. The tip stays in the reflog. If PR-association does NOT confirm the merge (PR deferred, merge not yet on base), do NOT delete — surface it through the active runtime's user-decision primitive instead.
6. **Close issues with done-detection** — for a non-default-branch PR, closing keywords never auto-fire, so close each issue manually: `gh issue close <num> -c "Closed by PR #<pr-num>"`. Detect issues to close by PR-association, from two concrete sources: (a) keyword-LINKED issues — `gh pr view <num> --json closingIssuesReferences` (the issues a `Closes #` / `Fixes #` keyword links); (b) MENTIONED-but-unlinked issues — the timeline / cross-reference API: `gh api repos/{owner}/{repo}/issues/<n>/timeline` (or the PR's cross-reference events) surfaces issues the PR or its commits reference WITHOUT a closing keyword. Confirm-and-close each detected issue per object. **Honest boundary:** PR-association only finds issues the PR REFERENCES (linked OR mentioned). A done issue the PR NEVER references cannot be auto-detected — SURFACE the open-issue list to the user at this manual close step so they can identify any such issue; never auto-close one that PR-association did not associate. Closing stays manual because the non-default base makes closing keywords inert.

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

If a merge conflict surfaces during the fix loop (the branch falls behind base and a re-sync conflicts), apply the same recovery as P5: detect → surface to the manager → executor resolves in the worktree → re-verify → re-push. No force-push without an explicit Always-Ask approval.

### P8 — Retro / bulk cleanup

P8 is the BULK companion to P6. P6 recovers a SINGLE orphaned worktree mid-session; P8 sweeps ACCUMULATED cruft across all four object classes (worktrees, remote branches, local branches, open issues) in one audited, confirmed pass. Modeled on the `gh poi` audit + dry-run + protect-list algorithm (use the algorithm, not the tool — no external CLI-extension dependency). Run the stages in this fixed order; every delete and close is an `[ASK]` destructive operation (Always-Ask per the [`discussion` skill's Decision Classification](../discussion/SKILL.md#decision-classification)).

**1. AUDIT (read-only).** Enumerate every object and record baseline counts: worktrees (`git worktree list`), remote branches (`git branch -r`), local branches (`git branch`), open issues (`gh issue list`). No mutation in this stage. The counts seed the durable record (stage 8).

**2. PROTECT (the data-loss guard).** Build the exclude set BEFORE classifying for deletion: the base branch, the current session branch, and any branch checked out in a **LIVE** worktree, plus any user-named protect-list entry. A worktree is **LIVE** if EITHER a held-flock probe shows the lock is held — `flock -n <session-root>/session.json.lock true` FAILS to acquire ⇒ the lock is held ⇒ a live session owns it — OR an active session process holds the worktree (process probe). A branch-tip commit younger than a freshness window (recommend 24h) is a CORROBORATING signal only, never the sole criterion. **NEVER classify a worktree LIVE or orphan from bare `session.json.lock` existence** — the lock is a PERSISTENT advisory marker (`record/scripts/init-record-map.sh` creates it create-if-absent), so a crashed session leaves the file behind; its mere presence proves nothing. A worktree is a CRASHED-ORPHAN only when ALL hold: `flock -n ... true` SUCCEEDS (lock not held, or no lock), no active process, and the tip commit is older than the freshness window. When a worktree is LIVE, PROTECT the worktree AND the branch it holds — never touch either.

**3. CLASSIFY (PR-association only — DQ4).** Classify each non-protected object by PR-association, NOT by reading acceptance-criteria bodies:
   - **Per branch** — merged-detection via `gh api repos/{owner}/{repo}/commits/<sha-or-branch>/pulls` or `gh pr view <branch> --json state,mergedAt` → `{merged-squash, merged-normal, unmerged, active-worktree}`. Cross with stage-2 liveness: a branch held by a LIVE worktree is `active-worktree` and protected.
   - **Per issue** — PR-association via two concrete sources: keyword-LINKED issues from `gh pr view <num> --json closingIssuesReferences`, and MENTIONED-but-unlinked issues from the timeline / cross-reference API (`gh api repos/{owner}/{repo}/issues/<n>/timeline` or the PR cross-reference events) → `{resolved-by-merged-PR, open-genuine}`. Because gobbi targets a non-default base, closing keywords never auto-fire, so all closing is manual. No acceptance-body reading (DQ4). A done issue that NO merged PR references cannot be classified `resolved-by-merged-PR` — it is SURFACED at the per-object `[ASK]` confirm (stage 5) for the user to identify, never auto-closed; P8 close is destructive, so an unreferenced issue is never swept silently.

**4. DRY-RUN (preview before any confirm).** Present the FULL classified plan — each object with its classification and the proposed action (keep vs delete/close) and the reason — WITHOUT acting (the `gh poi --dry-run` model). The user reviews the whole set before any confirmation round.

**5. CONFIRM `[ASK]` (destructive).** Nothing acts without confirmation (default-safe). After the dry-run review: **confirm-per-CLASS** for the bulk merged objects (the user approves "delete these N merged-squash branches / close these N resolved issues" as a reviewed batch per class); **per-OBJECT confirm** for any unmerged or ambiguous object (a tip near the freshness window, an inconclusive flock probe). An **unmerged-branch delete requires an EXTRA explicit per-object confirm** — unmerged means unique work at risk (S-07). Authority: [`discussion` skill](../discussion/SKILL.md#decision-classification).

**6. TOCTOU re-check.** IMMEDIATELY before acting on each object, RE-VERIFY its merged-state and worktree-liveness (re-run the held-flock / process probe and the PR-association check). State can change between the dry-run and the act — a concurrent session may have started, a branch may have been pushed. If the re-check disagrees with the dry-run classification, SKIP that object and record the skip; do not act on stale classification.

**7. ACT (per-object, idempotent, resumable).** Act only on confirmed, TOCTOU-revalidated objects:
   - **Worktrees** — `git status` clean check first (no `--force`/`-f` without Always-Ask), then `git worktree remove <path>` + `git worktree prune` + empty-parent cleanup scoped to the removed worktree's parent (`rmdir -p "$(dirname <path>)" 2>/dev/null || true`) — NEVER `find .../worktrees/ -type d -empty -delete` over the shared root, which wipes a concurrent live session's empty scaffold dirs (`mistakes/git/worktree-empty-dir-sweep-deletes-live-session-scaffold.md`).
   - **Branches** — `git push origin --delete <branch>` (remote) + the sanctioned `git branch -D <branch>` (local) per the P5 step 5 / Forbidden Operations `-D` carve-out (only after PR-association confirms the squash-merge).
   - **Issues** — `gh issue close <num> -c "<reason>"`. NEVER `gh issue delete` (Forbidden Operations — GitHub has no undelete).

   Each object action is idempotent: an already-deleted object that re-appears as "not found" is treated as done, not an error. If the sweep aborts midway (network drop, approval declined), the durable record (stage 8) holds the per-object status; a resume re-runs AUDIT + the TOCTOU re-check and acts only on objects not yet marked done.

**8. DURABLE RECORD.** Write the sweep result — the audit baseline counts, the full classification, the confirmed set, and the acted / skipped / failed status per object with reasons — to the PROJECT-ROOT reports tier: `.gobbi/projects/<name>/reports/{area}/{date}-retro-sweep.md` (the retro-sweep is a git-workflow report, so `{area}` = `git`). `reports` is a project-only memory type (it has NO `features/{f}/` tier), and the path lives OUTSIDE the gitignored `sessions/` tree so the record survives worktree removal; it is committed. This record is what makes a partial sweep resumable (stage 7).

---

## Worktree CWD discipline

How current working directory (CWD) and paths behave inside a worktree. A subagent runs git ops and session writes from a worktree, but the CWD it can rely on is not stable. This section states the rules that keep both surfaces anchored to the worktree.

**CWD resets between turns.** In Claude Code, each Bash tool call resets the CWD to the session start directory. A relative path resolves against that directory, not against where a prior command left off. A `cd` does not persist across tool boundaries. So every git op and every session-record write MUST use an explicit absolute path — never a relative or `pwd`-derived one.

**Absolute-worktree-path mandate.** Session writes (notes, staging, memory drafts) root at the absolute `session.json.git.worktreePath`. A `null` `worktreePath` is a malformed or partial `session.json` — surface it as an error, never treat it as a main-tree write signal. This is the write-path rule in the [Memory Access Matrix](#memory-access-matrix); follow it there.

**`git -C <worktree-abs>` for all git ops.** Never a bare `git` that resolves against the reset CWD — after a reset it commits to the main tree's branch instead of the worktree branch. Always pass `git -C <worktree-abs>`. This is the established pattern in the executor and leader role prompts (`agents/executor.md:99-101`, `agents/leader.md:112`) — both carry the `git -C` discipline (INT-6).

**Codex CWD inheritance.** `codex exec` inherits the CWD from the calling shell, and codex auto-detects the git project root — which may be the worktree root. When session paths live outside the detected root, `--cd <root>` anchors codex and `--add-dir` extends the writable set. This is the git consequence; the full `codex exec` CWD detail is owned by [`codex` skill § Operational discipline](../codex/SKILL.md#operational-discipline) — see it there, do not duplicate.

---

## Failure Modes and Recovery

Common failures and their recovery paths. The **Runtime** column marks which runtimes a failure applies to (`claude` / `codex` / `both`). Runtime-specific rows trace back to the per-runtime posture in [Runtime git environment](#runtime-git-environment); `both` rows are runtime-neutral.

| Failure | Runtime | Recovery |
|---|---|---|
| Worktree creation fails — branch already exists | both | Branch may be in use by another session or left over. Report to user; offer to reuse the existing worktree (Procedure P6) or rename the branch. |
| `gh` CLI not authenticated | both | Covered by Procedure P1 — verified at session setup. |
| Orphaned worktrees from crashed session | both | Procedure P6 (Recover orphaned worktree) for a single orphan; Procedure P8 (Retro / bulk cleanup) when more than one has accumulated. |
| CI failure on the PR | both | Procedure P7 (Handle CI failure). |
| Merge conflict on base sync or PR branch | both | Detect → surface to the manager → executor resolves in the worktree → re-verify → continue (P5 Merge-conflict recovery; P7 step 6). No force-push without Always-Ask. |
| Write to `.git/hooks` or `.git/config` attempted from inside the worktree | both | OS-denied by the sandbox (not only the gobbi rule) — the write cannot succeed. Commit (refs + index) is unaffected. See [Role Boundaries](#role-boundaries). |
| `git push` / `gh` blocked — network off or approval not granted | codex | Default `workspace-write` keeps network OFF; `on-request` raises an approval prompt and `never` offers none. The manager OFFERS the remediation menu, then DEFERS the PR (triggers 4–5 in [Prerequisites](#prerequisites)). |
| `git push` / `gh` blocked — domain not allowed or `gh` TLS fails under Seatbelt | claude | No domains pre-allowed (needs `allowedDomains`); `gh` may fail TLS under macOS Seatbelt (needs `excludedCommands`). The manager OFFERS the remediation menu, then DEFERS the PR (triggers 4–5 in [Prerequisites](#prerequisites)). |
| Cleanup failure when removing a worktree | both | Normal removal fails when the worktree has uncommitted files or locked refs. Run `git status` inside the worktree first — if unclean, commit or discard explicitly before retrying removal. `--force` / `-f` is Forbidden without explicit user approval through the active runtime's user-decision primitive (it silently discards uncommitted work). After successful removal, prune (`git worktree prune`) and clean empty parent dirs. |
| Stash content lost during worktree removal | both | Stash is per-worktree and lost with the worktree. **Do not use stash inside worktrees** (Forbidden Operations table). For context switches, create a temporary linked worktree per the safe-alternative rule. |
| Base branch deleted on remote between session start and worktree creation | both | Procedure P2 step 2 (re-verification) catches this. Surface to user; switch base or recreate. |

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
| Remote branch | manager (P4 push, P5 `git push origin --delete` after worktree removal) | `origin/<branch-name>` |
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
- **MUST never `git branch -D` an unmerged branch** without user confirmation — EXCEPT the sanctioned post-squash-merge delete (P5 step 5 / Forbidden Ops carve-out), which is ask-free only when PR-association confirms the branch is merged-by-squash.
- **MUST never `git reset --hard` outside Forbidden Operations exceptions** without user confirmation.
- **Base branch is project-specific** — never hardcoded; ask the user at session setup and store as session-level configuration.
- **GitHub + the `gh` CLI are required only for the PR lifecycle** — worktree creation and commits work without them; when `gh`, auth, or the remote is unavailable the PR is deferred (push/open when `gh` is available) and the session never falls back to the main tree.
