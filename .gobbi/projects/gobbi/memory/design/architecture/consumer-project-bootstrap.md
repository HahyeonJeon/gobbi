# Consumer project bootstrap and layout

## Problem

Gobbi v1.0.0 ships as a Claude Code and Codex plugin with no bootstrap CLI. v0.5.0 had a `packages/cli`
binary that created `.gobbi/` in a consumer project on first use; v1.0.0 deleted that CLI and no skill
absorbed the responsibility. A user hit this directly: `.gobbi/` was never created in their project, and its
runtime state directories were not ignored, so session and worktree churn could be committed. Fixed
2026-08-01 across 13 commits (`b375c1eb..b26f08b0`).

## Canonical layout

`gobbi/SKILL.md` Procedure Step 1.1 defines this layout inline. The user decided against a separate child
document for it, to keep the definition in one place:

```text
.gobbi/                          tracked
├── .gitignore                   tracked
└── projects/<project>/          tracked
    ├── memory/                  tracked   the project memory root
    ├── sessions/                ignored
    └── worktrees/               ignored
```

`<project>` is `basename(dirname(git rev-parse --path-format=absolute --git-common-dir))`. This is the
resolver that must be used. The naive `basename(git rev-parse --show-toplevel)` returns the session **branch
name** instead of the project, because every Cowork and Workflow session runs inside a session worktree whose
own top level is the branch.

## Locked decisions

The user made these decisions during the 2026-08-01 fix:

- **Nested layout, not flat.** `.gobbi/projects/<project>/...` stays; a flat top-level form was considered
  and rejected.
- **The layout is defined, not built, by `gobbi/SKILL.md`.** Step 1.1 states the shape inline and creates
  nothing; each mode's owner creates a path only when its first record needs it.
- **`.gobbi/.gitignore` is the only file carrying Gobbi's ignore rules.** Gobbi never writes a consumer
  project's root `.gitignore`. That file's canonical content is one comment line plus
  `projects/*/sessions/` and `projects/*/worktrees/` — both patterns carry a middle slash, which anchors them
  to `.gobbi/`. A slashless pattern such as `sessions/` would match at any depth and swallow durable memory
  under `memory/design/sessions/`.
- **The project memory root is `.gobbi/projects/<project>/memory/`, tracked, with no marker file.** "Tracked"
  means "not ignored"; git cannot track an empty directory, so the root exists only once it holds a real
  record, and bootstrap creates the namespace roots only — never a `memory/` category directory.
- **`rules/` is not bootstrapped.** Every agent contract already treats an absent-or-empty `rules/` as
  `NO_PROJECT_RULES`, so creating it ahead of content would assert a distinction that carries no meaning.
- **The consumer repository's root `.gitignore` was reduced** to exactly `node_modules/` and
  `.claude/.env`. `tmp/` was dropped entirely rather than ignored, because `scripts/check-codex-plugin-smoke.sh`
  was found to actively create it — one dual-system proposer called the path dead and the other showed it
  live; the smoke script now uses an OS temp directory instead.

## Bootstrap ordering

Creating this layout the first time is a chicken-and-egg problem: Cowork and Workflow both start by capturing
an immutable base commit before the session worktree exists, but that base commit is exactly where the layout
must already exist for the session to read it.

Resolved with one user-approved bootstrap commit in the main checkout, made before the immutable base is
captured; that bootstrap commit becomes the base. `git` Rule `G-2` ("Validate every writer root") and
`cowork` Rule 1 were both amended with this bounded exception rather than adding a new rule. The bootstrap
commit is the only tracked write Gobbi ever makes outside a session worktree, and it covers only the required
layout and its ignore file — nothing else.

## Stop conditions

`git/SKILL.md` Step 2.1 verifies the layout before recommending a base, in this order: an ancestor ignores
`.gobbi/` (unrepairable from inside `.gobbi/`, since a nested `.gobbi/.gitignore` under an ignored ancestor is
never read, not even a self-negating `!.gobbi/`); a file is already tracked under a path the layout requires
to be ignored (detected with `git ls-files`, because `git check-ignore` only answers "would this be ignored,"
not "is this tracked"); a conflicting or partial ignore file already exists at the layout's path; and a
required path component exists as a file or a symbolic link instead of a directory. See
[`learnings/git/tips.md`](../../learnings/git/tips.md) for the verification mechanics behind these checks, and
[`backlogs/project.md`](../../backlogs/project.md) for the one stop condition still missing a named detection
command.

## References

- `gobbi/SKILL.md` Procedure Step 1.1 — canonical layout definition
- `git/SKILL.md` § G-2, Step 2.1 — bootstrap authorization and verification
- `cowork/SKILL.md` Rule 1 — bootstrap exception
- `.gobbi/.gitignore` — canonical ignore rules
