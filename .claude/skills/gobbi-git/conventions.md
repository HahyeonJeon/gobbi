# Git Conventions

Naming and formatting standards for branches, commits, PRs, issues, and worktree directories. These conventions apply when gobbi-git is active. All formats align with the Conventional Commits v1.0.0 standard.

---

## Branch Naming

Branch names encode the work type, tracking issue, and a short description so that any developer or agent can identify the branch's purpose at a glance. For example, a branch for issue 42 implementing OAuth login would be named feat/42-oauth-login.

**Type prefixes** (aligned with Conventional Commits):

| Prefix | Purpose |
|--------|---------|
| feat/ | New feature |
| fix/ | Bug fix |
| hotfix/ | Urgent production fix |
| chore/ | Maintenance, dependencies |
| docs/ | Documentation only |
| refactor/ | Code restructuring, no behavior change |
| test/ | Test additions or modifications |
| ci/ | CI/CD configuration |
| perf/ | Performance improvement |

**Naming rules:**

- All lowercase, words separated by hyphens
- Include the issue number when a tracking issue exists
- Keep the description under 50 characters
- Be specific about what the branch delivers — the name should distinguish this branch from other work in the same area

---

## Commit Messages

Follow the Conventional Commits v1.0.0 standard for all commit message formatting — type, optional scope, description, optional body, optional footer. The standard itself defines the structure; this section covers only project-specific constraints that go beyond the format.

**Commit discipline:** Each subagent commit should be one focused, specific change. A commit that touches unrelated areas is a commit that will be difficult to review, revert, or bisect. If a task naturally produces multiple logical changes, commit them separately.

**Scope matching:** The commit type and scope should match the task's domain as stated in the delegation briefing. A developer subagent working on a feat/42-oauth-login branch should not be producing docs: or chore: commits unless the delegation explicitly includes that work.

**Commit timing:** Commit only after verification passes — never commit unverified work. The verification step exists to catch problems before they enter the history; committing before verification defeats the purpose.

**Body principle:** When a commit body is warranted, explain why the change was made rather than what changed. The diff shows the what; the body provides the reasoning that the diff cannot convey.

---

## Pull Request Format

The PR title follows the same Conventional Commits format as commit messages: type, optional scope, description.

The PR body should explain what changed and why, link to the tracking issue, and describe how to verify the changes. The body serves reviewers who need to understand the scope and testers who need to know what to check — write for those audiences rather than following a rigid structure.

**Issue linking caveat:** Closing keywords in a PR body only auto-close the linked issue when the PR targets the repository's default branch. If the PR targets a non-default branch (such as a develop branch), the issue must be closed explicitly after the final merge reaches the default branch. This is a GitHub platform behavior, not a configuration option.

**Merge strategy:** Squash merge with branch deletion. All PR commits collapse into one commit on the target branch, keeping the history clean. The branch is deleted after merge to prevent stale branch accumulation.

---

## Issue Format

Issues are the contract between ideation and execution. They can be created by the orchestrator from ideation output or picked up from existing issues.

**When creating an issue:**

- Title in imperative mood, descriptive and specific — same naming sensibility as branch descriptions
- Body contains the problem statement, proposed approach, acceptance criteria, and labels
- The issue becomes the source of truth for what the task delivers

**When picking up an existing issue:**

- Read the full issue body and comments for context before starting work
- The issue number drives the branch name and PR linkage

---

## Sub-issues

When a feature decomposes into three or more independent tasks that each produce their own commit or PR, sub-issues can track them under a parent issue. The parent issue captures the overall feature; each sub-issue is scoped to one deliverable.

The orchestrator creates the parent issue from ideation output, then creates sub-issues during planning — one per task. Sub-issues follow the same naming conventions as regular issues, and the branch for each sub-issue uses the sub-issue number in its name (for example, `feat/{sub-issue-number}-{description}`). The parent issue closes when all sub-issues are resolved.

This is guidance for multi-task features, not a mandate. Simple tasks continue to use a single issue. Use sub-issues when the decomposition is clear, the tasks are genuinely independent, and tracking progress per task would be meaningful.

The `gh issue` CLI does not have native sub-issue support. Sub-issue relationships are managed through the GitHub API directly via `gh api`.

---

## Labels

Labels organize issues along two independent axes: type and status.

**Type labels** mirror the branch prefix taxonomy: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`. Apply the matching type label when creating an issue. Type labels are always recommended — they connect the issue to the kind of work it tracks and make filtering straightforward.

**Status labels** reflect where work stands in the lifecycle: `in-progress` (worktree created, delegation started) and `ready-for-review` (PR created). Status labels are optional — apply them when the project uses a label system or when the user has enabled status tracking. Not every project benefits from this level of overhead.

The orchestrator applies labels; subagents never touch them. This is consistent with the role boundary that reserves all issue and PR management for the orchestrator.

---

## Worktree Directory Naming

Worktrees are created inside `.claude/worktrees/` within the main repository. The directory name preserves the branch name exactly, including slashes — so a branch named feat/42-oauth-login becomes `.claude/worktrees/feat/42-oauth-login/`. This keeps worktrees co-located with the repo rather than scattered as sibling directories, and the preserved branch path makes it easy to identify what each worktree is for without inspecting git state. Naming collisions are prevented because each branch name is unique.

The `.claude/worktrees/` directory must be in `.gitignore` to prevent worktree contents from appearing in the main repo's git status.

---

## Base Branch

The base branch — what feature branches are created from and what PRs target — is project-specific. It is not hardcoded in this skill.

Common patterns include trunk-based development with a single main branch, GitFlow with a develop branch, or custom branching models. The orchestrator asks the user at session setup and stores the answer as session-level configuration. All branch creation and PR targeting use this configured base branch.
