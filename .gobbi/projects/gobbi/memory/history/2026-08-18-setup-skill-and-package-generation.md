# Setup skill, per-runtime hooks, and generated plugin package completed

**Completed at:** 2026-08-18T00:20:00Z

## Changes

- Added `gobbi/setup`, the operation skill that checks prerequisites and creates a consumer project's
  missing Gobbi layout, instruction placeholders, Claude Code settings, and Codex role contracts. It writes
  no skill and no `skills/` directory, never edits an existing file, and never writes outside the project
  root. Its writer is `gobbi/scripts/apply-setup.sh`, whose every write is create-if-absent.
- Replaced the single `Stop` hook with one hook file per runtime, each using that runtime's own plugin-root
  variable: Claude Code and Codex on `UserPromptSubmit`, Grok on `Stop` because its `UserPromptSubmit` is
  observe-only, and Cursor on `sessionStart` because its CLI never fires `stop`. See
  [stop reminder](../design/feature/stop-reminder.md).
- Hardened `apply-setup.sh` containment after evaluation found it could write outside the project root
  through a `.gobbi` symlink. Containment had been tested lexically against a concatenated string, which
  could never fail. Replaced with `physical_ancestor()`, resolving each target's deepest existing ancestor
  with `cd -P`. Six escape shapes closed; containment now holds by two independent mechanisms, since the
  per-row `-L` check stops the dangling-link shapes the ancestor check cannot see.
- Added `scripts/sync-plugin-package.sh`, which derives `plugins/gobbi/`'s `skills/`, `agents/`, and
  `runtimes/` from the canonical tree. `--check` exits non-zero on divergence, `--materialize` rebuilds.
  This replaces hand-syncing, which had already drifted once — four days after the previous generator was
  deleted at `efac11d7` "pending a simpler replacement" that never landed.
- Renamed the package's non-Claude role contracts from `role-variants/` to `runtimes/` and repointed the
  Cursor and Grok manifests. Canonical keeps all four runtimes under
  `agents/{claude,codex,cursor,grok}/`; only the package differs, because a plugin's `agents/` directory is
  scanned recursively and each subfolder becomes part of the agent's scoped identifier. See
  [identity-and-load role contracts](../design/process/identity-and-load-role-contracts.md).
- Excluded two canonical paths from the package: `link-project-skills.sh`, a repository-local development
  script, and `html-css/migration.md`, this project's own refactor ledger — 771 lines of paths that exist in
  no consumer tree, with nothing linking to it.
- Two commits on `chore/gobbi-setup`: `f0b4a714` the setup skill and containment hardening, `69850fba` the
  package generator and the `runtimes/` rename. Parent `c75dc0cc`.

## Evidence

- Four independent evaluations. The first returned REVISE on the High containment defect; re-evaluation
  returned PASS over roughly 70 live runs. The Topic 02 evaluation returned REVISE on a prerequisite checker
  that had silently stopped running ten checks, and all seven of its findings are closed.
- `--check` verified to catch content, missing, unexpected, mode, and symlink divergence, and to ignore
  package-owned paths. Prerequisite checker reports 102 passed, 2 warnings, 0 failed.
- Runtime behavior measured rather than assumed, under isolated config directories: Claude Code dereferences
  symlinks whose target is elsewhere in the marketplace and scans `agents/` recursively at unlimited depth;
  Grok follows per-entry symlinks but not a symlinked component directory, and a declared `agents` path
  replaces default discovery; Codex drops every symlink at every granularity while reporting
  `installed, enabled`. Cursor could not be measured — it has no offline observable.

## Open

- `.cursor/agents/` is a hand-maintained copy while the other four runtime mirrors are symlinks, so it is the
  one mirror that can drift silently. Converting it is deferred because Cursor cannot be verified.
- `--materialize` deletes untracked package-only files with no `--dry-run`. `--check` lists them first and
  tracked files recover through Git.
- Two user-only actions remain: trusting `hooks/codex-hooks.json` in Codex `/hooks`, and deciding the
  disposition of the user-level `~/.grok/hooks/hooks.json`.
