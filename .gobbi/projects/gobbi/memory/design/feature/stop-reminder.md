# Session hooks

## Status

Removed, pending reimplementation. The 2026-11 refactor removed every script and hook: the SessionStart settings
check (`check-settings.sh`), the per-prompt and Stop reminder (`remind.sh`), the per-runtime setup scripts,
`scripts/sync-plugin-package.sh`, `scripts/prove-gobbi-setup.sh`, and `link-project-skills.sh`. The Codex,
Cursor, and Grok manifests no longer declare `hooks`, and no runtime in this checkout registers a hook.
`scripts/guard/guard.py sync` now keeps the package in step with canonical (see
[Repository guard](../architecture/repository-guard.md)).

Until reimplementation, the setup guides under `skills/gobbi/setup/` and the README install steps that name these
scripts or hooks are out of date, and the Gobbi entry skill neither probes the layout nor runs a setup check.
The CHANGELOG Removed section records the same gap.

## What the removed design did

- One SessionStart hook per runtime ran that runtime's setup script with `--check` and reported the result, and a
  separate reminder hook injected six short statements on `UserPromptSubmit` (Claude Code, Codex) or `Stop`
  (Grok). Cursor used `sessionStart` for both.
- Hook text reaches the model differently per runtime; the measured mechanics stay in the learnings:
  [Claude](../../learnings/claude/tips.md), [Codex](../../learnings/codex/tips.md), and
  [Grok](../../learnings/grok/tips.md).

A reimplementation is a new design decision and a new file or an update here, not a restore of the old scripts.
