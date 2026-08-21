# Setup skill and generated plugin package

## Result

Accepted on `chore/gobbi-setup` at `69850fba`, two commits from parent `c75dc0cc`.

`gobbi/setup` is a new child operation skill that creates a consumer project's missing Gobbi layout,
placeholders, Claude Code settings, and Codex role contracts. It creates no skill, never edits an existing
file, and never writes outside the project root. The reminder hook is now one file per runtime, each using
that runtime's own plugin-root variable.

`scripts/sync-plugin-package.sh` derives the plugin package from the canonical tree. The package is generated,
not hand-synced. Canonical keeps all four runtimes under `agents/{claude,codex,cursor,grok}/`; the package
flattens Claude's contracts and ships the rest under `runtimes/`, because a plugin's `agents/` directory is
scanned recursively and any subfolder there becomes live agent surface.

Session history: [2026-08-18-setup-skill-and-package-generation](../../history/2026-08-18-setup-skill-and-package-generation.md).
Current design: [stop reminder](../../design/feature/stop-reminder.md),
[identity-and-load role contracts](../../design/process/identity-and-load-role-contracts.md).

## What decided the design

Three runtime behaviors were measured, not inferred, and each one removed an option that looked correct on
paper:

- Claude Code scans a plugin's `agents/` recursively, and same-basename files in different subdirectories do
  not collide — they register as distinct live agents. Nesting the runtime copies there would have added ten
  agents whose leaf names read like the real five, with no warning from `claude plugin validate --strict`.
- Codex drops every symlink at every granularity while reporting `installed, enabled`. That silently killed
  the symlink approach for a four-runtime package: install succeeds, skills are simply absent.
- Grok follows per-entry symlinks but not a symlinked component directory, and a declared `agents` path
  replaces default discovery rather than adding to it.

The canonical tree was briefly restructured to make the package a verbatim copy, then reverted on the user's
decision: the source's own coherence outranks the projection's simplicity, and absorbing a consumer's
constraint into the single source of truth is the wrong direction. The projection cost turned out to be one
mapping table and one derived link rewrite.

## Limits

This file records the skill and packaging work. Merge, push, and worktree cleanup are separate Wrap-up Git
actions and are not claimed here.

Cursor was never measured. It has no offline observable — no plugin-list command, hidden subcommands hang on
network initialization, and every path that reports loaded plugins needs an authenticated session. Its
manifest change is a like-for-like repoint, so the risk is unchanged rather than new, but it is unverified.

Grok produced no accepted Partner result in this session; every attempt timed out. The dual-system evaluations
were Claude-side, run as independent fresh agents against frozen subjects.
