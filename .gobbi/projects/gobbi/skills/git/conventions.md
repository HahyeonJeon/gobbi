# Git Conventions

Deterministic rules for branch naming, commit grammar, footer trailers, PR template, label registry, sub-issues, worktree path formula, and base branch. Every rule is expressed as a regex, a table, or a literal template so agents can self-validate before pushing.

Formats align with:
- [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) — commit grammar
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow) — branch / PR lifecycle
- [Linux kernel `submitting-patches.html`](https://docs.kernel.org/process/submitting-patches.html) — commit message size + voice
- [`git worktree(1)`](https://git-scm.com/docs/git-worktree) — worktree semantics

---

## Branch Naming

### Validator (two-step)

Branch name validation for **non-session feature branches** is a two-step procedure (session-worktree branches use the dedicated rule in § Session-Worktree Branches below):

**Step 1 — Shape check (regex):**

```regex
^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$
```

The agent runs this regex against the proposed branch name before `git worktree add -b`. A mismatch is a precondition violation — surface to the user and re-derive.

**Step 2 — 3-50 character length check on the description slug:**

After the shape check passes, extract the description slug — everything after `<type>/` and after the optional issue number prefix (`\d+-`). Check that the slug length is between 3 and 50 characters (inclusive). A slug shorter than 3 chars is too terse to be meaningful; longer than 50 chars makes the branch name unwieldy in tooling.

```
description-slug = branch-name after stripping "<type>/" and optional "<issue-num>-"
e.g., "feat/42-oauth-login"  → slug = "oauth-login"     (10 chars — PASS)
      "feat/42-x"            → slug = "x"               (1 char  — FAIL: too short)
      "feat/42-{60+ chars}"  → slug = "{60+ chars}"     (60 chars — FAIL: too long)
```

Both steps must pass. A branch name that passes the regex but fails the length check is still invalid.

### Type prefixes

| Prefix | Purpose | Example |
|---|---|---|
| `feat/` | New feature | `feat/42-oauth-login` |
| `fix/` | Bug fix | `fix/123-null-pointer` |
| `hotfix/` | Urgent production fix | `hotfix/critical-auth-leak` |
| `chore/` | Maintenance, dependencies | `chore/bump-bun-1.2` |
| `docs/` | Documentation only | `docs/api-reference` |
| `refactor/` | Code restructuring, no behavior change | `refactor/extract-logger` |
| `test/` | Test additions or modifications | `test/89-edge-cases` |
| `ci/` | CI / CD configuration | `ci/cache-bun-deps` |
| `perf/` | Performance improvement | `perf/cache-hot-path` |
| `build/` | Build system changes | `build/migrate-vite` |
| `style/` | Code style only (formatting, no logic change) | `style/format-cli` |

### Rules

These rules govern **non-session feature branches**; session-worktree branches use the dedicated rule in § Session-Worktree Branches below.

| Rule | Pattern | Example pass | Example fail |
|---|---|---|---|
| Type prefix from registry above | `^(feat\|fix\|...)/...` | `feat/oauth` | `feature/oauth` |
| Issue number when issue exists | `...\d+-...` | `feat/42-oauth-login` | `feat/oauth-login` (when issue #42 exists) |
| All lowercase | character class `[a-z0-9]` | `feat/42-oauth-login` | `feat/42-OAuth-Login` |
| Hyphens as separator | no underscores, no spaces | `feat/42-oauth-login` | `feat/42_oauth_login` |
| Description length 3–50 chars (post-`/`) | leaf portion length | `feat/42-oauth-login` | `feat/42-x` (too short); `feat/42-{60+ chars}` (too long) |
| No trailing slash, no `..` segments | path-safety | `feat/42-oauth-login` | `feat/42-x/` or `feat/../x` |

### Session-Worktree Branches

Per-session worktree branches created at Configuration Step 1 (orchestration/SKILL.md row 1) do **not** use the type-prefix grammar or the 3–50-char slug rule above — those govern non-session feature branches. Session-worktree branches use a fixed, machine-generated shape keyed to the running system and the session UUID:

```regex
^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

- `claude` for the `claude-code` system; `codex` for the `codex` system.
- `\d{4}-\d{2}-\d{2}` — session-start date `YYYY-MM-DD`.
- The trailing group is the full lowercase runtime session id resolved by Gobbi bootstrap: `CLAUDE_CODE_SESSION_ID` for Claude Code, `CODEX_THREAD_ID` for native Codex.

Examples:
- `claude-2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2` — PASS
- `codex-2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2` — PASS
- `chore/session-2026-06-05-06668274` — old convention, no longer generated (existing branches are not renamed)

The shape-check regex and the 3–50-char slug rule in **§ Branch Naming → Validator** apply to **non-session** branches only. The session-worktree validator above is the sole shape check for Step-1 worktree branches.

---

## Commit Messages

Conventional Commits v1.0.0 grammar with Linux-kernel-derived size limits.

### Subject regex

```regex
^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)(\([a-z0-9-]+\))?!?: [a-z].{1,67}[^.]$
```

Constraints:
- **Total subject length ≤ 72 chars** (Linux kernel says 70-75; we pick 72 as the round Conventional-Commits-friendly number)
- **Imperative present-tense** ("add", not "added" or "adds")
- **Lowercase first letter after `: `**
- **No trailing period**
- **Type from the same registry as branch prefixes** (`feat` / `fix` / `hotfix` / `chore` / `docs` / `refactor` / `test` / `ci` / `perf` / `build` / `style`)
- **Optional scope**: lowercase + hyphen-separated noun in parens — `feat(parser):`, `fix(auth-flow):`
- **Breaking change**: append `!` before the colon — `feat(auth)!: drop password fallback`. Also requires a `BREAKING CHANGE:` footer.

### Body rules

| Rule | Value |
|---|---|
| Body wrap | 75 columns hard wrap (per Linux kernel) |
| Body explains | **why** the change was made (the diff shows **what**) |
| Body separator | One blank line between subject and body |

### Scope discipline

The commit type and scope match the task's domain stated in the delegation prompt. A subagent working on `feat/42-oauth-login` should not produce `docs:` or `chore:` commits unless the delegation explicitly includes that work.

### Timing rule

Commit only after the executor's Verify phase passes (per [`execution/SKILL.md`](../execution/SKILL.md)). Never commit unverified work.

### Per-task discipline

One focused commit per subtask. If a task naturally produces multiple logical changes, commit them separately. A commit touching unrelated areas will be difficult to review, revert, or bisect.

---

## Commit Trailers

Required and optional footer trailers. Trailers go in the commit body after a blank line, in the order specified.

### Required trailers

| Trailer | Required when | Format | Example |
|---|---|---|---|
| `AI-Provenance-Record:` | Every agent-authored commit | `AI-Provenance-Record: gobbi://session/{session-id}/task/{task-id}` | `AI-Provenance-Record: gobbi://session/2026-05-20-abc123/task/03-add-cache-layer` |

The `AI-Provenance-Record:` trailer is the canonical AI provenance marker for gobbi. It points back to the session and task that produced the commit, making the agent's work auditable without conflating the agent with a human collaborator. **Do NOT use `Co-Authored-By:` for agents** — that footer implies collaborator consent and was repudiated by the wider community (see GitHub Copilot Co-authored-by controversy, April-May 2026, where Microsoft reversed automatic Co-Authored-By insertion).

### Conditional trailers

| Trailer | Required when | Format |
|---|---|---|
| `BREAKING CHANGE:` | Commit breaks an API or contract | `BREAKING CHANGE: <one-line description of the break + migration hint>` |
| `Fixes:` | Commit fixes a specific past bug commit | `Fixes: <12+ char SHA> ("<commit subject>")` (per Linux kernel format) |
| `Closes #<num>` | PR body closes a default-branch issue | `Closes #42` |
| `Refs #<num>` | Related issue, not closing | `Refs #42` |
| `Signed-off-by:` | Project enables DCO (Developer Certificate of Origin) | `Signed-off-by: <name> <email>` |

### Trailer order (when multiple apply)

1. `BREAKING CHANGE:` (if any)
2. `Fixes:` (if any)
3. `Refs:` / `Closes:` (if any)
4. `AI-Provenance-Record:` (marks the agent boundary — last UNLESS DCO is enabled)
5. `Signed-off-by:` (if DCO — legal/human attestation always goes last; human attestation has highest precedence over AI-provenance markers)

**Rule:** `AI-Provenance-Record:` is last for agent commits EXCEPT when DCO is enabled. When `Signed-off-by:` is present (project enables DCO), it comes after `AI-Provenance-Record:` — legal/human attestation has higher precedence and must be the final trailer.

### Full commit example

```
feat(auth)!: drop password fallback in favor of OAuth-only flow

The password fallback is removed because the OAuth path has been
production-validated for 90 days with zero auth failures. Keeping
both paths doubles the auth surface area without measurable benefit.

Operators upgrading must run `gobbi auth migrate` to convert
remaining password-based sessions. See migration guide for details.

BREAKING CHANGE: removes the `/api/auth/password` endpoint. Existing
password-only users must complete the OAuth setup before the next
release.

Fixes: a1b2c3d4e5f6 ("auth: tolerate password fallback")

Refs #42

AI-Provenance-Record: gobbi://session/2026-05-20-abc123/task/03-drop-password-fallback
```

---

## Pull Request Format

### Title

Same regex + grammar as the commit subject (Conventional Commits). For squash-merged PRs, the title becomes the squashed commit's subject, so the same constraints apply.

### Body — required template

The PR body has **four required sections** in this order. Stamp the template; do not improvise structure.

```markdown
## Summary
<2-4 bullets describing what changed and why, at the feature level (not file level)>

## Changes
<file-or-area-grouped bullets — what areas of the code were touched and why>

## Test plan
- [ ] <concrete verification step the reviewer can run>
- [ ] <…>

## Linked issues
Closes #<num>   <!-- only on default-branch PRs -->
Refs #<num>     <!-- otherwise -->
```

### Issue linking — non-default branch caveat

Closing keywords (`Closes #X`, `Fixes #X`, `Resolves #X`) only auto-close the linked issue when the PR targets the repository's **default branch**. If the PR targets a non-default branch (such as `develop`), the manager must explicitly close the issue after the merge reaches the default branch:

```bash
gh issue close <num> -c "Closed by PR #<pr-num>"
```

This is a GitHub platform behavior, not a configuration option.

### Merge strategy

**Squash merge** is the only merge strategy:

```bash
gh pr merge <num> --squash
```

All PR commits collapse into one commit on the target branch (preserving the linear history of the base). The squashed commit's subject is the PR title; the squashed commit's body is the PR body's `## Summary` section.

Branch deletion is NOT part of the merge command. Do not pass `--delete-branch` — it runs while the worktree still holds the branch and the delete fails ("branch used by worktree"). Branch cleanup happens in the reordered finalization sequence: the worktree is removed first, then `git push origin --delete <branch>` deletes the remote branch and the sanctioned `git branch -D <branch>` deletes the local branch after PR-association confirms the squash-merge. See [`git/SKILL.md` § P5 — Land PR](SKILL.md#p5--land-pr) for the full sequence; do not duplicate it here.

A squash merge produces a NEW commit with no history overlap with the source branch, so `git branch -d` will NOT recognize the source branch as merged. The local branch must be force-deleted via the sanctioned `-D` path (P5 step 5 / the Forbidden Operations `-D` carve-out in `git/SKILL.md`), conditioned on PR-association merge-confirmation — never left to `git branch -d`, which fails on a squash-merged branch.

---

## Issue Format

Issues are the contract between ideation and execution.

### When creating an issue

| Field | Rule |
|---|---|
| Title | Imperative present-tense, descriptive, ≤ 80 chars (same voice as branch descriptions) |
| Body | Problem statement + proposed approach + acceptance criteria |
| Labels | At least one type label from the Label Registry below |

### When picking up an existing issue

- Read the full issue body and all comments for context before starting work.
- The issue number drives the branch name and PR linkage — extract it before Procedure P2.

---

## Sub-issues

When a feature decomposes into **three or more independent tasks**, use the parent / sub-issue model. The parent issue captures the overall feature; each sub-issue is scoped to one deliverable.

### Rules

| Rule | Value |
|---|---|
| Trigger threshold | ≥ 3 independent tasks |
| Naming | Sub-issues follow the same regex as regular issues |
| Branch per sub-issue | Branch name uses the sub-issue number: `feat/{sub-issue-number}-<description>` |
| Parent close | Manager closes the parent manually after all sub-issues are closed — GitHub does not auto-close parents |
| API | The `gh issue` CLI does not have native sub-issue support; use GitHub's parent-child issue API directly |

Sub-issues are guidance for multi-task features, not a mandate. Simple tasks continue to use a single issue.

---

## Label Registry

GitHub does not auto-create labels. On a fresh repository, the manager creates any needed labels before applying them via `gh label create <name> --color <hex>`. Re-creating an existing label has no effect, so the manager can safely attempt creation on first use without checking.

### Type labels (mirror branch prefixes)

| Label | Color (hex) |
|---|---|
| `feat` | `#a2eeef` |
| `fix` | `#d73a4a` |
| `hotfix` | `#b60205` |
| `chore` | `#e4e669` |
| `docs` | `#0075ca` |
| `refactor` | `#5319e7` |
| `test` | `#bfd4f2` |
| `ci` | `#fbca04` |
| `perf` | `#fef2c0` |
| `build` | `#c5def5` |
| `style` | `#f9d0c4` |

### Status labels (optional, lifecycle-driven)

| Label | Color | When applied | When removed |
|---|---|---|---|
| `in-progress` | `#fbca04` | Worktree created, delegation started | Replaced by `ready-for-review` |
| `ready-for-review` | `#0075ca` | PR created | Removed at PR merge (issue close clears all status labels) |

Status labels are optional — apply them when the project uses a label-based status system. Not every project benefits from this overhead.

### Label ownership

The manager applies and modifies labels. Subagents never touch labels. This is consistent with the role boundary that reserves all issue and PR management for the manager.

---

## Worktree Path Formula

### Path template

```
<repo-root>/.gobbi/projects/<project-name>/worktrees/<branch-name>/
```

Examples:
- Branch `feat/42-oauth-login` → `<repo-root>/.gobbi/projects/gobbi/worktrees/feat/42-oauth-login/`
- Branch `fix/123-null-pointer` → `<repo-root>/.gobbi/projects/gobbi/worktrees/fix/123-null-pointer/`

### Rules

| Rule | Value |
|---|---|
| Worktree root | `.gobbi/projects/<project-name>/worktrees/` (project-scoped under `.gobbi/`, not co-located with `.claude/`) |
| Directory name preserves branch name | Including slashes — `feat/42-oauth-login` becomes a nested path |
| Naming collisions | Prevented because each branch name is unique (branch-exclusivity rule below) |
| `.gitignore` requirement | The `.gobbi/projects/*/worktrees/` glob MUST be in `.gitignore` to prevent worktree contents from appearing in the main repo's `git status` |
| Verification | Pre-create check: `git check-ignore -q .gobbi/projects/<project-name>/worktrees/` (per Procedure P1) |

### Branch exclusivity

Git enforces that a branch can only be checked out in one worktree at a time. If branch creation fails during worktree setup, the branch may already be active in another worktree from a concurrent or crashed session — recover via Procedure P6.

### Cleanup of empty parent directories

Nested branch names that use slashes (e.g., `feat/42-oauth-login`) create intermediate directories under `worktrees/`. `git worktree remove` only removes the leaf directory. Run this after worktree removal:

```bash
# Scope to the REMOVED worktree's own parent chain — NEVER `find worktrees/ ...` over the
# shared root, which deletes a concurrent live session's just-scaffolded empty dirs.
rmdir -p "$(dirname .gobbi/projects/<project-name>/worktrees/<branch-name>)" 2>/dev/null || true
```

---

## Base Branch

The base branch — what feature branches are created from and what PRs target — is **project-specific** and never hardcoded in this skill.

### Rules

| Rule | Value |
|---|---|
| Hardcoding forbidden | Skill must not assume `main`, `master`, `develop`, or any other branch name |
| Source of truth | User selects at session setup (Question 2 of `/gobbi` bootstrap); answer is stored as session-level configuration |
| Resolution | All branch creation (`git worktree add -b ... <base>`) and PR targeting (`gh pr create --base <base>`) use this configured value |

### Common patterns

| Pattern | Base branch |
|---|---|
| Trunk-based development | `main` (or `master` on older repos) |
| GitFlow | `develop` for features; `main` for releases |
| Custom branching | Project-specified (e.g., `next`, `staging`) |

---

## Runtime git posture — where it is configured

The *runtime git posture* — which git ops run on their own, which prompt for approval, and which are blocked — is described in [`SKILL.md` § Runtime git environment](SKILL.md#runtime-git-environment). This note is the canonical pointer to **where** that posture is set per runtime. It does not restate the model; read the SKILL.md section for the behavior.

| Surface | Sets | Notes |
|---|---|---|
| `.codex/config.toml` | Codex sandbox mode, approval policy, and network access | Worktree HEAD ships **no** sandbox-loosening default — no `network_access = true`, no broad allow-list (D2 safe-by-default). The default Codex posture (`workspace-write` + `on-request`, network off) is the runtime's own default, not a gobbi override. |
| `.codex/agents/*.toml` | Per-runtime git discipline for each Codex custom agent | Thin wrappers that point at the canonical `agents/{role}.md` role prompt; they carry the role's git posture pointer, not a copy of the model. |
| `agents/manager.md`, `agents/executor.md` (role prompts) | Per-role git posture (manager remediation-vs-defer; executor commit-only, manager-handles-push) | The role prompts are the canonical role contract on both runtimes; the `.codex/agents/*.toml` wrappers point back to them. |
| Claude Code settings (`allowedDomains`, `excludedCommands`) | Claude Code network + sandbox posture | Same safe-by-default rule: gobbi ships no network enablement; the remediation menu OFFERS it, the user decides. |

**Hooks are NOT a git-posture surface (INT-4).** The gobbi hooks (`hooks/session-end.sh`, `hooks/post-tool-use-agents.sh`) are **token reconcilers**, not git-metadata or git-lifecycle hooks. A change to runtime git posture is a change to `.codex/config.toml` / `.codex/agents/*.toml` / the role prompts — never to the hooks.
