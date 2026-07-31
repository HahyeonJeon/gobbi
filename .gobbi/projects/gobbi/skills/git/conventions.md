# Git Conventions

Deterministic mappings for Gobbi session branches, worktree paths, focused commits, provenance trailers,
optional issues, pull requests, labels, and merge format. [`SKILL.md`](SKILL.md) owns the Workflow and Cowork
contract sources, lifecycle, authority gates, failure handling, and cleanup order.

The formats align with [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow), and [`git worktree`](https://git-scm.com/docs/git-worktree).

## Session branch naming

A Gobbi session branch is derived once from the active runtime system, session start date, and Gobbi-owned UUID:

```text
<runtime-prefix>-<YYYY-MM-DD>-<gobbi-session-uuid>
```

The complete validator is:

```regex
^(claude|codex)-\d{4}-\d{2}-\d{2}-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
```

| Runtime system | Prefix |
|---|---|
| `claude-code` | `claude` |
| `codex` | `codex` |

Examples:

- `claude-2026-07-20-37d3c8ef-57dd-477a-b10c-dcbbc1c2327d`
- `codex-2026-07-20-37d3c8ef-57dd-477a-b10c-dcbbc1c2327d`

Workflow reads the UUID from `session.json.sessionId`. Cowork reads it from the conversation-locked contract
and verifies it against the branch and commit provenance during recovery. It is never a runtime ID, issue
number, pull-request number, or task slug, and a runtime context boundary never renames the session branch.

### Non-session branches

When a separately scoped operation needs a non-session branch, use:

```regex
^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$
```

The description slug after the optional issue number is 3–50 characters. An issue number is included only when an issue actually exists; it is never required by shape alone.

| Prefix | Purpose | Example |
|---|---|---|
| `feat/` | New behavior | `feat/42-oauth-login` |
| `fix/` | Defect correction | `fix/null-pointer` |
| `hotfix/` | Urgent deployed-system correction | `hotfix/auth-leak` |
| `chore/` | Maintenance | `chore/bump-bun` |
| `docs/` | Documentation only | `docs/api-reference` |
| `refactor/` | Structure without intended behavior change | `refactor/extract-logger` |
| `test/` | Test-only change | `test/89-edge-cases` |
| `ci/` | Continuous integration configuration | `ci/cache-deps` |
| `perf/` | Measured performance improvement | `perf/cache-hot-path` |
| `build/` | Build system change | `build/migrate-vite` |
| `style/` | Formatting with no logic change | `style/format-cli` |

## Worktree path

The session worktree path is:

```text
<repo-root>/.gobbi/projects/<project>/worktrees/<session-branch>/
```

For project `gobbi` and branch `codex-2026-07-20-37d3c8ef-57dd-477a-b10c-dcbbc1c2327d`:

```text
<repo-root>/.gobbi/projects/gobbi/worktrees/codex-2026-07-20-37d3c8ef-57dd-477a-b10c-dcbbc1c2327d/
```

| Property | Mapping |
|---|---|
| Worktree root | `.gobbi/projects/<project>/worktrees/` |
| Leaf | exact session branch |
| Workflow source | absolute normalized path in `session.json.git.worktreePath` |
| Cowork source | absolute normalized path in the conversation-locked Git contract |
| Ignore check | `git check-ignore -q .gobbi/projects/<project>/worktrees/` |
| Collision behavior | stop and inspect; never add a suffix or remove the existing path automatically |

## Base branch and commit

Workflow reads its project-specific base branch and commit from `session.json.git`. Cowork locks the inspected
base branch and immutable base commit in its conversation contract before creating the worktree. A dirty,
detached, or ambiguous Cowork checkout requires a user decision; Git never invents `main`, `master`, `develop`,
or a remote default.

The selected value is used for branch creation and whole-branch comparison. A later publication operation
revalidates the target base before pull-request, merge, or synchronization work.

## Publication mapping

Workflow maps `session.json.settings.git` to actions without hidden coupling:

| Settings | Required result |
|---|---|
| `publication: local` | verified local commits; branch and worktree retained |
| `publication: push` | local result plus session-branch push; no pull request |
| `publication: pull-request` | local result plus push and open/reused pull request |
| `createIssue: false` | no issue action |
| `createIssue: true` | create/reuse an issue independently of publication |
| `draftPullRequest: false` | create a new configured pull request ready for review |
| `draftPullRequest: true` | create a new configured pull request as draft |

`draftPullRequest` does not change an already existing pull request automatically. Issue absence never changes the branch shape, commit trailer, publication path, or pull-request validity.

Cowork has no persisted publication settings. It retains verified local commits by default; a later push,
pull request, issue, merge, or cleanup requires a separate explicit Git operation and current user authority.

## Commit messages

Use Conventional Commits grammar:

```regex
^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)(\([a-z0-9-]+\))?!?: [a-z].{1,67}[^.]$
```

### Subject rules

- total length is at most 72 characters;
- use imperative present tense;
- start the description with a lowercase letter;
- omit a trailing period;
- use an optional lowercase hyphenated scope only when it improves discrimination; and
- add `!` only for a deliberate breaking contract that also has a `BREAKING CHANGE:` trailer.

### Body rules

| Property | Convention |
|---|---|
| Separation | one blank line after the subject |
| Line width | 75 columns where prose wrapping is practical |
| Content | explain why and any non-obvious consequence; do not narrate the diff |
| Focus | one planned task or one separately justified finalization change |

One task may need more than one commit only when the commits are independently reviewable and the locked plan permits the split. Unrelated areas never share a commit.

## Commit trailers

Every agent-authored commit has this exact trailer shape:

```text
AI-Provenance-Record: gobbi://session/<gobbi-session-uuid>/task/<stable-task-id>
```

Example:

```text
AI-Provenance-Record: gobbi://session/37d3c8ef-57dd-477a-b10c-dcbbc1c2327d/task/05d-git-owner
```

The session segment uses the Workflow manifest UUID or Cowork contract UUID. The task segment uses the stable
plan or manager assignment ID. Do not use a runtime ID, branch name, issue number, filename, role, or Wrap-up
label as a substitute.

### Trailer order

1. `BREAKING CHANGE:` when applicable.
2. `Fixes:` when the change repairs a named prior commit.
3. `Refs:` or `Closes:` when an issue actually exists.
4. `AI-Provenance-Record:` for every agent-authored commit.
5. `Signed-off-by:` only when the project has an explicit Developer Certificate of Origin requirement.

Do not use `Co-Authored-By:` for an agent. The provenance trailer records the agent boundary without asserting human collaborator consent.

### Example

```text
docs(git): align local-first session finalization

Make issue and remote publication optional while preserving one isolated
session worktree and focused verified local commits.

AI-Provenance-Record: gobbi://session/37d3c8ef-57dd-477a-b10c-dcbbc1c2327d/task/05d-git-owner
```

## Pull-request format

### Title

Use the commit subject grammar. Under squash merge, this becomes the base-branch commit subject.

### Required body

```markdown
## Summary
- <outcome and reason>

## Changes
- <area and observable change>

## Verification
- [ ] <exact command or evidence>

## Gobbi session
- Mode: `<workflow-or-cowork>`
- Session: `<gobbi-session-uuid>`
- Branch: `<session-branch>`
- Handoff: `<durable-repository-relative-path-or-conversation-only>`
```

When an issue exists, append this optional section:

```markdown
## Linked issues
Refs #<number>
```

Use `Closes #<number>` only when the target branch and repository behavior will actually close the issue. For a non-default target, close a finished issue explicitly after confirmed merge when that issue action is authorized. A missing issue section is valid.

### New versus existing pull request

| State | Action |
|---|---|
| One open request with exact head and base | reuse it; verify its current head after push |
| No matching open request | create one from the template |
| Multiple or mismatched requests | stop and surface the ambiguity |
| `draftPullRequest: true` on new request | include the CLI draft option |
| Existing request plus `draftPullRequest: true` | preserve its existing state unless the user separately authorizes a state change |

## Merge format

Gobbi's supported default is squash merge:

```text
gh pr merge <number> --squash
```

Do not add automatic branch deletion to the merge command. [`SKILL.md`](SKILL.md) owns the user gate and post-merge cleanup order.

A squash merge creates a new base-branch commit without making the source tip an ancestor. Therefore `git branch -d` may reject the local session branch. The only matching force-delete format is:

```text
git branch -D <session-branch>
```

It is valid only after the Git operation directly proves the exact branch was the head of the confirmed merged pull request. This format mapping does not relax that proof or authorize the action.

## Optional issue format

Issue creation is used only when Workflow has `createIssue: true` or a separate Cowork Git operation has
explicit authority.

| Field | Convention |
|---|---|
| Title | imperative, descriptive, at most 80 characters |
| Body | problem, proposed outcome, acceptance evidence |
| Label | one applicable type label when the repository supports it |
| Session link | include the Gobbi session UUID when useful for recovery |

When three or more independently trackable remote deliverables exist and the user wants GitHub tracking, one parent issue plus sub-issues may be used. This is optional project organization, never a prerequisite for the session branch or Execution tasks.

## Label registry

Labels are optional repository metadata. The manager applies them only when the configured GitHub action uses them.

| Label | Color | Meaning |
|---|---|---|
| `feat` | `#a2eeef` | new behavior |
| `fix` | `#d73a4a` | defect correction |
| `hotfix` | `#b60205` | urgent deployed-system correction |
| `chore` | `#e4e669` | maintenance |
| `docs` | `#0075ca` | documentation |
| `refactor` | `#5319e7` | structural change |
| `test` | `#bfd4f2` | tests |
| `ci` | `#fbca04` | continuous integration |
| `perf` | `#fef2c0` | performance |
| `build` | `#c5def5` | build system |
| `style` | `#f9d0c4` | formatting only |

Do not create a label merely because it appears in this registry. Repository label creation is an external mutation and follows the configured issue or pull-request action.

## Release metadata

Git finalization never changes a plugin or package version as a side effect. A version changes only when the
locked implementation task explicitly includes that file and value.

## Runtime git posture

[`SKILL.md` § Probe posture](SKILL.md#21-probe-posture-and-create-one-isolated-worktree) owns how runtime
sandbox, network, and approval state affect Git actions. [`scripts/git-posture-probe.sh`](scripts/git-posture-probe.sh)
is the read-only probe. This conventions document owns no runtime configuration and authorizes no edit to
`.codex/config.toml`, Claude settings, `.git/config`, or user Git configuration.
