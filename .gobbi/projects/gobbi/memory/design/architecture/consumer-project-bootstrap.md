# Consumer project bootstrap and layout

## Problem

Gobbi v1.0.0 shipped as a Claude Code and Codex plugin with no bootstrap CLI. Grok is now a third consumer
runtime and uses the same `.gobbi/` layout. v0.5.0 had a `packages/cli` binary that created `.gobbi/` in a
consumer project on first use; v1.0.0 deleted that CLI and no skill absorbed the responsibility. A user hit
this directly: `.gobbi/` was never created in their project, and its runtime state directories were not
ignored, so session and worktree churn could be committed. Fixed 2026-08-01 across 13 commits
(`b375c1eb..b26f08b0`).

## Canonical layout

`gobbi/SKILL.md` Procedure Step 1.2 defines this layout inline. The user decided against a separate child
document for it, to keep the definition in one place:

```text
.gobbi/                          tracked
├── .gitignore                   tracked
└── projects/<project>/          tracked
    ├── agents/                  tracked, 0-byte README.md
    ├── skills/                  tracked, 0-byte README.md
    ├── memory/                  tracked   the project memory root
    │   ├── design/
    │   │   ├── README.md         tracked, 0-byte
    │   │   ├── architecture/
    │   │   ├── feature/
    │   │   ├── process/
    │   │   └── roadmap/
    │   ├── learnings/
    │   ├── reports/
    │   │   ├── README.md         tracked, 0-byte
    │   │   ├── note/
    │   │   ├── review/
    │   │   └── analysis/
    │   ├── history/README.md     tracked, 0-byte
    │   ├── materials/
    │   │   ├── README.md         tracked, 0-byte
    │   │   ├── references/
    │   │   ├── assets/
    │   │   ├── docs/
    │   │   └── data/
    │   └── backlogs/README.md    tracked, 0-byte
    ├── sessions/                ignored, not created by setup
    └── worktrees/               ignored, not created by setup
```

`<project>` is `basename(dirname(git rev-parse --path-format=absolute --git-common-dir))`. This is the
resolver that must be used. The naive `basename(git rev-parse --show-toplevel)` returns the session **branch
name** instead of the project, because every Cowork and Workflow session runs inside a session worktree whose
own top level is the branch.

## Locked decisions

The user locked these layout decisions in the 2026-08-01 fix and the later standalone `gobbi-setup` topic:

- **Nested layout, not flat.** `.gobbi/projects/<project>/...` stays; a flat top-level form was considered
  and rejected.
- **The layout is defined, not built, by `gobbi/SKILL.md`.** Step 1.2 states the shape inline and creates
  nothing. Setup scripts under `gobbi/setup/` create a missing path only when the user runs them. Cowork
  and Workflow still create a session path only when its first record needs it.
- **`.gobbi/.gitignore` is the only file carrying Gobbi's ignore rules.** Gobbi never writes a consumer
  project's root `.gitignore`. That file's canonical content is one comment line plus
  `projects/*/sessions/` and `projects/*/worktrees/` — both patterns carry a middle slash, which anchors them
  to `.gobbi/`. A slashless pattern such as `sessions/` would match at any depth and swallow durable memory
  under `memory/design/sessions/`.
- **The project memory root is `.gobbi/projects/<project>/memory/`, tracked, with no marker file.** "Tracked"
  means "not ignored"; git cannot track an empty directory. Setup scripts create the six Memory category
  directories and the named design, reports, and materials subject directories. It writes a 0-byte
  `README.md` only at `agents/`, `skills/`, and the five category roots whose Memory conventions define a
  README: design, reports, history, materials, and backlogs. It does not create `memory/README.md`,
  `learnings/README.md`, a leaf README, or invented learnings or backlog files. After commit and clone,
  `learnings/` and the leaf subject directories vanish until a later file lands.
- **`rules/` is not bootstrapped.** Every agent contract already treats an absent-or-empty `rules/` as
  `NO_PROJECT_RULES`, so creating it ahead of content would assert a distinction that carries no meaning.
- **The consumer repository's root `.gitignore` was reduced** to exactly `node_modules/` and
  `.claude/.env`. `tmp/` was dropped entirely rather than ignored, because `scripts/check-codex-plugin-smoke.sh`
  was found to actively create it — one dual-system proposer called the path dead and the other showed it
  live; the smoke script now uses an OS temp directory instead.
- **This Gobbi authoring repository is expected to FAIL the checker** on `memory/materials/`
  (and its README and subject dirs), `.gobbi/projects/gobbi/skills/README.md`, and
  `memory/design/roadmap` until the user runs setup scripts here. Do not create those
  paths.

## Bootstrap ordering

Creating this layout the first time is a chicken-and-egg problem: Cowork and Workflow both start by capturing
an immutable base commit before the session worktree exists, but that base commit is exactly where the layout
must already exist for the session to read it.

Resolved with one user-approved bootstrap commit in the main checkout, made before the immutable base is
captured; that bootstrap commit becomes the base. Cowork's isolated-worktree rule and Workflow's
`Create the worktree and configuration` step own this bounded
exception, while Git supplies repository-state, commit, and recovery preferences. The bootstrap commit is the
only tracked write Gobbi makes outside a session worktree, and it covers only the required layout and its
ignore file — nothing else.

## Stop conditions

Gobbi Step 1.3 and the selected Cowork or Workflow configuration preflight verify the layout before capturing
the base. They stop when an ancestor ignores `.gobbi/`; a file is already tracked where the layout requires
ignored state; the existing `.gobbi/.gitignore` has conflicting or partial bytes; or a required path component
is a file or symbolic link instead of a directory. Use `git check-ignore --no-index -v` for ignore behavior,
`git ls-files` for tracked state, exact-byte comparison for the ignore file, and `test -e`, `test -d`, and
`test -L` for existing path components. See [`learnings/git/tips.md`](../../learnings/git/tips.md) for the
verification mechanics behind these checks.

## References

- `gobbi/SKILL.md` Procedure Step 1.2 — canonical layout definition
- `gobbi/setup/<runtime>.md` and `gobbi/setup/scripts/<runtime>.sh` — per-runtime setup guides and writers
- `cowork/SKILL.md` Rule 1 and Step 1.1 — Cowork bootstrap authority and verification
- `workflow/SKILL.md` Step 1.2 — Workflow bootstrap authority and verification
- `git/SKILL.md` — repository-state, commit, and recovery preferences
- `.gobbi/.gitignore` — canonical ignore rules
