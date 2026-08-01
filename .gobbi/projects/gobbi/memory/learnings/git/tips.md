# Git Tips

## Verifying an ignore rule needs more than `git check-ignore` alone

**Context:** Confirming that a path is correctly tracked or ignored, especially while bootstrapping a new
directory layout.

**Tip:** `git check-ignore` without `--no-index` silently skips an already-tracked path and reports it as not
ignored — always pass `--no-index`. It also cannot detect a file that is tracked despite living under an
ignored path, because it only answers "would this be ignored," not "is this tracked"; use
`git ls-files -- <path>` for that (a file committed before the ignore rule existed stays tracked, and an
ignore rule never untracks it). A directory-only pattern cannot match a path that does not exist on disk, so
create every directory before checking it, and query the path with no trailing slash, since a trailing slash
changes which pattern matches. An uncommitted `.gitignore` still takes effect, because git reads it from the
working tree — rules can be verified before they are committed.

**Application:** Use this sequence whenever a task adds or audits `.gitignore` rules: create the paths, check
each one with `git check-ignore --no-index -v <path>` (no trailing slash), then separately confirm with
`git ls-files -- <path>` that nothing already tracked lives under a path meant to be ignored.

## Middle-slash patterns anchor; slashless patterns match at any depth

**Context:** Writing a `.gitignore` pattern for a directory nested under other tracked content.

**Tip:** A pattern containing a middle slash (for example `projects/*/sessions/`) is anchored to the
directory that holds the `.gitignore` file. A slashless pattern (for example `sessions/`) matches at any
depth instead, so it can silently ignore an unrelated same-named directory much deeper in the tree — a
`.gobbi/.gitignore` rule of `sessions/` would also swallow durable content under `memory/design/sessions/`.

**Application:** Anchor any ignore pattern meant for one specific location with a middle slash. Reserve
slashless patterns for names that must be ignored everywhere.

## An ignored ancestor directory blocks re-inclusion from inside it

**Context:** A directory's own `.gitignore` is expected to re-include a path that an ancestor `.gitignore`
already ignores.

**Tip:** If any ancestor's `.gitignore` ignores a directory, git never reads a `.gitignore` nested inside
that directory — not even a self-negating rule such as `!.gobbi/` written inside `.gobbi/.gitignore` itself.
This is not repairable from inside the ignored directory; the fix has to happen in the ancestor's ignore
file.

**Application:** Treat "an ancestor ignores this whole directory" as a stop condition, not something a nested
ignore file can work around. Find the exact ignoring file and line with `git check-ignore -v`.

## Resolve a consumer project's key from the shared git directory, not the worktree root

**Context:** Deriving a stable project identifier for a session that may run inside a linked worktree.

**Tip:** `basename(git rev-parse --show-toplevel)` returns the current worktree's top level, which for every
Cowork and Workflow session is the session branch name, not the project. Use
`basename(dirname(git rev-parse --path-format=absolute --git-common-dir))` instead —
`--git-common-dir` names the one shared repository directory regardless of which worktree is active.

**Application:** Use the `--git-common-dir` form for any path that must be stable across a project's
worktrees, such as a project memory root or a project-scoped cache key.
