# Consumer project bootstrap gap

A user hit `.gobbi/` never being created in a real external project, with its runtime state directories not
ignored, after installing Gobbi v1.0.0. This is the root-cause analysis and the verification behind the fix
shipped 2026-08-01 across 13 commits (`b375c1eb..b26f08b0`).

## Root cause

Gobbi v0.5.0 shipped a `packages/cli` binary that performed the `.gobbi/` bootstrap in a consumer project on
first use. Gobbi v1.0.0 moved to plugin-only distribution and deleted that CLI, but no skill absorbed the
bootstrap responsibility it had carried. Nothing in the plugin ever created `.gobbi/` or its ignore rules, so
a fresh consumer project stayed unbootstrapped indefinitely.

## Fix

`gobbi/SKILL.md` now defines the required layout inline in Procedure Step 1.1, and `git`, `cowork`, and
`workflow` now perform one user-approved bootstrap commit of that layout in the main checkout before the
session's immutable base is captured. The full design, including the locked decisions and the
bootstrap-ordering resolution, is recorded in
[`design/architecture/consumer-project-bootstrap.md`](../../design/architecture/consumer-project-bootstrap.md).

## Verification

- **End-to-end bootstrap proof** in a throwaway consumer repository: 10 of 10 cases passed, run independently
  twice with matching results, including both stop conditions and a live demonstration that the naive
  project resolver (`basename(git rev-parse --show-toplevel)`) returns the session branch name
  (`feature-login`) instead of the project (`consumer-repo`).
- `check-markdown-links.sh` over every skill, agent, `CLAUDE.md`, `AGENTS.md`, and `README.md`: all 698
  relative paths and 76 anchors resolved across 166 files, exit 0 — the file count matched the pre-change
  baseline, confirming the change added no new file needing a mirror update.
- `sync-plugin-package.sh --check`: plugin source topology intact, exit 0.
- A cross-document contradiction sweep across every skill, agent, `CLAUDE.md`, `AGENTS.md`,
  `.codex/AGENTS.md`, `README.md`, `CHANGELOG.md`, and `scripts/`: found none. Retired v0.5.0 state
  (`rawdata`, `packages/cli`, `gobbi.db`, `state.db`) is absent everywhere.
- Rule 4 dependency direction audited across all eight edited skills: `git` and `memory` have no outbound
  skill references; `wrap-up` references only `record` and `memory`.

## Limits

- No independent Claude-and-Codex evaluation ran over `b375c1eb..b26f08b0`. Every verification above is
  self-verification by the implementing session plus one round of manager reproduction.
- One stop condition in `git/SKILL.md` Step 2.1 — a required path component is a file or symbolic link —
  does not name a detection command the way the other three do, even though it is trivially detectable by
  inspecting the path. Left unfixed; tracked in
  [`backlogs/project.md`](../../backlogs/project.md#git-skill-stop-condition-missing-a-detection-command).
- Publication intent was local retention only: nothing pushed, no PR, no merge.
